/**
 * Dados da cidade para a aba "Onde estou", lidos da Wikipédia em português:
 * história, bandeira, brasão, hino (se houver), prefeito atual e as listas de
 * prefeitos e vereadores. O artigo certo vem do OpenStreetMap (Nominatim), que
 * aponta o verbete do município — evita cair em homônimos (ex.: o jurista
 * Tobias Barreto). Nem toda cidade tem tudo: o que faltar volta como null.
 */
const WIKI = 'https://pt.wikipedia.org/w/api.php'
const NOMINATIM = 'https://nominatim.openstreetmap.org'
const CACHE_PREFIX = 'ov_city_v1:'
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000
const MAX_HISTORY_BLOCKS = 16

const clean = el =>
  (el?.textContent ?? '')
    .replace(/\s+/g, ' ')
    .replace(/\(\s+/g, '(')
    .replace(/\s+([),;:.])/g, '$1')
    .trim()

async function locate(lat, lng) {
  const res = await fetch(
    `${NOMINATIM}/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&extratags=1&accept-language=pt-BR`
  )
  if (!res.ok) throw new Error('Não foi possível identificar a cidade.')
  const data = await res.json()
  const a = data.address ?? {}
  const tag = data.extratags?.wikipedia
  return {
    city: a.city || a.town || a.municipality || a.village || a.county || data.name || null,
    state: a.state ?? null,
    wikiTitle: tag?.startsWith('pt:') ? tag.slice(3) : null,
  }
}

async function fetchArticle(title) {
  const params = new URLSearchParams({
    action: 'parse', page: title, prop: 'text', redirects: '1',
    disableeditsection: '1', disabletoc: '1', format: 'json', formatversion: '2', origin: '*',
  })
  const res = await fetch(`${WIKI}?${params}`)
  if (!res.ok) return null
  const data = await res.json()
  if (data.error || !data.parse?.text) return null

  const doc = new DOMParser().parseFromString(data.parse.text, 'text/html')
  const root = doc.querySelector('.mw-parser-output') ?? doc.body
  root.querySelectorAll('style, script, sup.reference, .mw-editsection, .navbox, .mw-empty-elt').forEach(n => n.remove())
  // Quebra de linha vira espaço, senão as palavras grudam ao ler o texto
  root.querySelectorAll('br').forEach(br => br.replaceWith(' '))
  return { title: data.parse.title, root }
}

// Miniatura do infobox em tamanho maior (a última opção do srcset é a de 2x)
function imageUrl(img) {
  if (!img) return null
  const best = img.getAttribute('srcset')?.split(',').pop()?.trim().split(' ')[0] || img.getAttribute('src')
  return best ? (best.startsWith('//') ? `https:${best}` : best) : null
}

function parseInfobox(root) {
  const box = root.querySelector('table[class*="infobox"]')
  if (!box) return null

  const rows = [...box.querySelectorAll('tr')]
    .filter(tr => tr.children.length === 2)
    .map(tr => ({
      label: clean(tr.children[0]).replace(/^•\s*/, ''),
      value: clean(tr.children[1]),
      cell: tr.children[1],
    }))
    .filter(r => r.label && r.value)

  const find = re => rows.find(r => re.test(r.label))
  const images = [...box.querySelectorAll('img')]
  const site = find(/^S[íi]tio|^Site/i)

  const facts = [
    ['Fundação', find(/^Funda[çc][ãa]o/i)?.value],
    ['Emancipação', find(/^Emancipa[çc][ãa]o/i)?.value],
    ['Gentílico', find(/^Gent[íi]lico/i)?.value],
    ['População', rows.find(r => /hab\.?$/.test(r.value) && /Total/i.test(r.label))?.value],
    ['Área', rows.find(r => /km²$/.test(r.value) && /^Total/i.test(r.label))?.value],
    ['Lema', find(/^Lema/i)?.value],
  ].filter(([, value]) => value).map(([label, value]) => ({ label, value }))

  return {
    isMunicipality: Boolean(find(/Unidade federativa|^Prefeito|^Gent[íi]lico/i)),
    flagUrl: imageUrl(images.find(i => /^bandeira/i.test(i.alt))),
    coatUrl: imageUrl(images.find(i => /^bras[ãa]o/i.test(i.alt))),
    mayor: find(/^Prefeito/i)?.value ?? null,
    anthem: find(/^Hino/i)?.value ?? null,
    website: site?.cell.querySelector('a.external')?.href ?? null,
    facts,
  }
}

// Parágrafos da abertura do artigo, antes do primeiro título de seção
function parseIntro(root) {
  const out = []
  for (const node of root.children) {
    if (node.matches('h2, .mw-heading')) break
    if (node.matches('p')) {
      const t = clean(node)
      if (t.length > 60) out.push(t)
    }
  }
  return out
}

// Conteúdo de uma seção: do título até o próximo título de mesmo nível ou acima
function findSection(root, matcher) {
  const heading = [...root.querySelectorAll('h2, h3, h4')].find(h => matcher.test(clean(h)))
  if (!heading) return null
  const level = Number(heading.tagName[1])
  const nodes = []
  let node = (heading.closest('.mw-heading') ?? heading).nextElementSibling
  while (node) {
    const inner = node.matches('h2, h3, h4') ? node : node.querySelector(':scope > h2, :scope > h3, :scope > h4')
    if (inner && Number(inner.tagName[1]) <= level) break
    nodes.push(node)
    node = node.nextElementSibling
  }
  return { title: clean(heading), nodes }
}

function parseHistory(root) {
  const section =
    findSection(root, /^Hist[óo]ria/i) ??
    findSection(root, /^(Top[ôo]nimo|Etimologia|Forma[çc][ãa]o)/i)
  if (!section) return null

  const blocks = []
  for (const node of section.nodes) {
    const sub = node.matches('.mw-heading') ? node.querySelector('h3, h4') : null
    if (sub) blocks.push({ type: 'h', text: clean(sub) })
    else if (node.matches('p')) {
      const t = clean(node)
      if (t.length > 40) blocks.push({ type: 'p', text: t })
    }
    if (blocks.length >= MAX_HISTORY_BLOCKS) break
  }
  // Subtítulo sem parágrafo depois não serve para nada
  while (blocks.length && blocks[blocks.length - 1].type === 'h') blocks.pop()
  return blocks.length ? { title: section.title, blocks } : null
}

const wikiLink = title => `https://pt.wikipedia.org/wiki/${encodeURIComponent(title.replaceAll(' ', '_'))}`

// Tabela → grade de textos, repetindo as células mescladas (rowspan/colspan)
// em todas as posições que ocupam, para as colunas não desalinharem
function tableGrid(table) {
  const grid = []
  ;[...table.querySelectorAll('tr')].forEach((tr, r) => {
    grid[r] ??= []
    let c = 0
    for (const cell of tr.children) {
      while (grid[r][c] !== undefined) c++
      const text = clean(cell)
      for (let dr = 0; dr < cell.rowSpan; dr++) {
        grid[r + dr] ??= []
        for (let dc = 0; dc < cell.colSpan; dc++) grid[r + dr][c + dc] = text
      }
      c += cell.colSpan
    }
  })
  return grid.map(row => Array.from(row, v => v ?? ''))
}

// Tabela da seção → lista de pessoas (nome, partido, período).
// Só aceita tabela com coluna de nome: sem ela, melhor não listar do que errar.
function parsePeople(section) {
  if (!section) return null
  const tables = section.nodes.flatMap(n => (n.matches('table.wikitable') ? [n] : [...n.querySelectorAll('table.wikitable')]))

  for (const table of tables) {
    const rows = tableGrid(table)
    if (rows.length < 2) continue

    const headers = rows[0]
    const col = re => headers.findIndex(h => re.test(h))
    const name = col(/^(nome|prefeit|vereador)/i)
    if (name < 0) continue
    const party = col(/partido/i)
    const start = col(/in[íi]cio|posse|per[íi]odo|mandato/i)
    const end = col(/fim|t[ée]rmino/i)

    const people = rows.slice(1)
      // Linha de uma célula só (faixa de título no meio da tabela) não é pessoa
      .filter(r => r.length >= headers.length && new Set(r).size > 1)
      .map(r => ({
        name: r[name],
        party: party >= 0 ? r[party] || null : null,
        period: [start >= 0 ? r[start] : null, end >= 0 && end !== start ? r[end] : null].filter(Boolean).join(' – ') || null,
      }))
      .filter(p => p.name && p.name.length > 2 && !/^\d+$/.test(p.name))
      // Mesma pessoa na linha seguinte só conta se for outro mandato
      .filter((p, i, list) => i === 0 || p.name !== list[i - 1].name || (p.period && p.period !== list[i - 1].period))
    if (people.length) return { title: section.title, people }
  }
  return null
}

async function loadMayors(root, baseName) {
  const inArticle = parsePeople(findSection(root, /prefeit|poder executivo/i))
  if (inArticle) return inArticle
  // Cidades maiores têm a lista num verbete próprio, dividida em várias tabelas
  // por época: ali não dá para ler com segurança, então fica só o link
  const list = await fetchArticle(`Lista de prefeitos de ${baseName}`).catch(() => null)
  return list ? { title: list.title, people: [], url: wikiLink(list.title) } : null
}

async function build(lat, lng) {
  const place = await locate(lat, lng)
  const candidates = [
    place.wikiTitle,
    place.city && place.state ? `${place.city} (${place.state})` : null,
    place.city,
  ].filter(Boolean)

  for (const title of [...new Set(candidates)]) {
    const article = await fetchArticle(title).catch(() => null)
    const info = article && parseInfobox(article.root)
    if (!info?.isMunicipality) continue

    const baseName = article.title.replace(/\s*\(.*\)$/, '')
    const { isMunicipality, ...symbols } = info
    return {
      name: baseName,
      state: place.state,
      wikiUrl: wikiLink(article.title),
      intro: parseIntro(article.root),
      history: parseHistory(article.root),
      ...symbols,
      mayors: await loadMayors(article.root, baseName),
      councillors: parsePeople(findSection(article.root, /vereador|poder legislativo|c[âa]mara municipal/i)),
    }
  }

  // Sem verbete de município: devolve ao menos o nome
  return place.city ? { name: place.city, state: place.state, notFound: true } : null
}

/** Dados da cidade nas coordenadas dadas. `cacheKey` (nome da cidade) evita refazer as buscas. */
export async function loadCityInfo({ lat, lng, cacheKey }) {
  const key = cacheKey ? CACHE_PREFIX + cacheKey : null
  if (key) {
    try {
      const saved = JSON.parse(localStorage.getItem(key))
      if (saved && Date.now() - saved.at < CACHE_TTL) return saved.info
    } catch {}
  }

  const info = await build(lat, lng)
  if (key && info && !info.notFound) {
    try { localStorage.setItem(key, JSON.stringify({ at: Date.now(), info })) } catch {}
  }
  return info
}
