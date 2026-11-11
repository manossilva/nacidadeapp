/**
 * Dados da cidade para a aba "Onde estou", lidos da Wikipédia em português:
 * história, bandeira, brasão, hino (se houver), prefeito e vice atuais (com
 * foto e mandatos, quando há) e a lista de vereadores. O artigo certo vem do
 * OpenStreetMap (Nominatim), que aponta o verbete do município — evita cair em
 * homônimos (ex.: o jurista Tobias Barreto). Nem toda cidade tem tudo: o que
 * faltar volta como null.
 */
const WIKI = 'https://pt.wikipedia.org/w/api.php'
const NOMINATIM = 'https://nominatim.openstreetmap.org'
const CACHE_PREFIX = 'ov_city_v2:'
const OLD_CACHE_PREFIXES = ['ov_city_v1:']
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000
const MAX_HISTORY_BLOCKS = 16
const ELECTION_YEAR = 2024
const TERM_YEARS = 4

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
  // Quebra de linha vira "\n": `clean` troca por espaço (senão as palavras
  // grudam) e quem precisa das linhas separadas ainda consegue dividir
  root.querySelectorAll('br').forEach(br => br.replaceWith('\n'))
  return { title: data.parse.title, root }
}

// Miniatura do infobox em tamanho maior (a última opção do srcset é a de 2x)
function imageUrl(img) {
  if (!img) return null
  const best = img.getAttribute('srcset')?.split(',').pop()?.trim().split(' ')[0] || img.getAttribute('src')
  return best ? (best.startsWith('//') ? `https:${best}` : best) : null
}

const normalize = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
const sameName = (a, b) => {
  const [x, y] = [normalize(a), normalize(b)]
  return Boolean(x && y) && (x.includes(y) || y.includes(x))
}

// Link para um artigo que existe (os vermelhos, de artigo inexistente, levam a classe "new")
const articleOf = a => (a && !a.classList.contains('new') && a.getAttribute('href')?.startsWith('/wiki/') ? a.getAttribute('title') : null)

// "Fulano (Partido, 2025–2028)" → nome, partido, mandato e o artigo da pessoa, se existir
function parseMayorCell(cell) {
  if (!cell) return null
  const text = clean(cell)
  const name = text.replace(/\s*\(.*$/, '').trim()
  if (!name) return null
  const inside = text.match(/\(([^()]*)\)\s*$/)?.[1] ?? ''
  const years = inside.match(/(\d{4})\s*[–-]\s*(\d{4})/)
  const first = cell.querySelector('a')
  return {
    name,
    party: inside.split(',')[0].replace(/\d{4}.*$/, '').trim() || null,
    term: years ? { start: Number(years[1]), end: Number(years[2]) } : null,
    article: first && sameName(clean(first), name) ? articleOf(first) : null,
  }
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
    mayor: parseMayorCell(find(/^Prefeit/i)?.cell),
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

const termLabel = t => `${t.start}–${t.end}`

// O que o artigo do próprio prefeito conta: foto, se é prefeito ou prefeita,
// desde quando está no cargo e quem é o vice
async function loadMayorProfile(title) {
  const article = await fetchArticle(title).catch(() => null)
  const box = article?.root.querySelector('table[class*="infobox"]')
  if (!box) return null

  const rows = [...box.querySelectorAll('tr')]
  const office = rows.findIndex(tr => tr.children.length === 1 && /^(\d+\.?[ºª°]?\s*)?Prefeit[oa] (de|do|da|dos|das) /i.test(clean(tr)))
  // Só as linhas do cargo de prefeito: as de duas colunas logo abaixo do título
  // (pulando faixas como "No cargo") até a faixa do próximo cargo do quadro
  const own = []
  for (const tr of office < 0 ? [] : rows.slice(office + 1)) {
    if (tr.children.length === 2) own.push(tr)
    else if (own.length) break
  }
  const row = re => own.find(tr => tr.children.length === 2 && re.test(clean(tr.children[0])))

  // Vários vices ao longo do tempo vêm um por linha: vale o que está no cargo
  const viceRow = row(/^Vice-prefeit/i)
  const viceLines = (viceRow?.children[1].textContent ?? '').split('\n').map(l => l.replace(/\s+/g, ' ').trim()).filter(Boolean)
  const viceLine = viceLines.find(l => /atual/i.test(l)) ?? viceLines[viceLines.length - 1] ?? ''
  const vice = viceLine.replace(/\s*\(.*$/, '').trim()

  // "1 de janeiro de 2021 até a atualidade": o ano logo antes de "até a atualidade"
  const since = clean(row(/^Per[íi]odo/i)?.children[1]).match(/(\d{4})\D{0,12}at[ée] (?:a )?atual/i)?.[1]
  const photo = [...box.querySelectorAll('img')].find(i => Number(i.getAttribute('width')) >= 100)

  return {
    photoUrl: imageUrl(photo),
    wikiUrl: wikiLink(article.title),
    title: office >= 0 && /Prefeita /i.test(clean(rows[office])) ? 'Prefeita' : 'Prefeito',
    since: since ? Number(since) : null,
    vice: vice && !/^(nenhum|vago|sem vice|—|-)/i.test(vice)
      ? { name: vice, title: /^Vice-prefeita/i.test(clean(viceRow.children[0])) ? 'Vice-prefeita' : 'Vice-prefeito' }
      : null,
  }
}

// Sem o vice no artigo do prefeito, o artigo da eleição costuma trazer a chapa.
// O título varia ("em Aracaju", "de Lagarto (Sergipe)"), por isso a busca.
async function loadViceFromElection(city, mayorName) {
  const params = new URLSearchParams({
    action: 'query', list: 'search', srlimit: '5', format: 'json', formatversion: '2', origin: '*',
    srsearch: `intitle:"Eleição municipal" intitle:"${city}" intitle:${ELECTION_YEAR}`,
  })
  const res = await fetch(`${WIKI}?${params}`)
  if (!res.ok) return null
  const found = (await res.json()).query?.search ?? []
  const escaped = city.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const hit = found.find(r => new RegExp(`^Eleição municipal \\S+ ${escaped}( \\(.+\\))? em ${ELECTION_YEAR}$`, 'i').test(r.title))
  if (!hit) return null

  const article = await fetchArticle(hit.title)
  const box = article?.root.querySelector('table[class*="infobox"]')
  if (!box) return null
  const rows = [...box.querySelectorAll('tr')].map(tr => [...tr.children])
  const candidates = rows.find(cells => cells.length > 1 && /^Candidat/i.test(clean(cells[0])))
  const vices = rows.find(cells => cells.length > 1 && /^Vice/i.test(clean(cells[0])))
  if (!candidates || !vices) return null

  // Só vale o vice da coluna em que o candidato é o prefeito: na dúvida, nada
  const column = candidates.findIndex((cell, i) => i > 0 && sameName(clean(cell), mayorName))
  const name = column > 0 ? clean(vices[column]).replace(/\s*\(.*$/, '').trim() : ''
  return name ? { name, title: 'Vice-prefeito(a)' } : null
}

// Mandatos a mostrar: o atual e, em caso de reeleição, o anterior também
function mayorTerms(term, since, table) {
  if (!term) return []
  const terms = [term]
  // 1) o artigo do prefeito diz desde quando ele está no cargo
  let previous = since && since < term.start ? { start: Math.max(since, term.start - TERM_YEARS), end: term.start - 1 } : null
  // 2) a tabela de prefeitos da cidade: as duas últimas linhas são da mesma pessoa
  if (!previous && table?.people.length >= 2) {
    const [before, last] = table.people.slice(-2)
    const year = p => Number(p.period?.match(/\d{4}/)?.[0])
    if (before.name === last.name && year(last) === term.start && year(before) < term.start) {
      previous = { start: year(before), end: term.start - 1 }
    }
  }
  if (previous) terms.unshift(previous)
  return terms.map(termLabel)
}

async function loadGovernment(root, cityName, infoboxMayor) {
  if (!infoboxMayor) return { mayor: null, vice: null }
  const profile = infoboxMayor.article ? await loadMayorProfile(infoboxMayor.article).catch(() => null) : null
  const vice = profile?.vice ?? await loadViceFromElection(cityName, infoboxMayor.name).catch(() => null)
  const terms = mayorTerms(infoboxMayor.term, profile?.since, parsePeople(findSection(root, /prefeit|poder executivo/i)))

  return {
    mayor: {
      name: infoboxMayor.name,
      party: infoboxMayor.party,
      title: profile?.title ?? 'Prefeito(a)',
      photoUrl: profile?.photoUrl ?? null,
      wikiUrl: profile?.wikiUrl ?? null,
      terms,
      reelected: terms.length > 1,
    },
    vice,
  }
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
    const { isMunicipality, mayor, ...symbols } = info
    return {
      name: baseName,
      state: place.state,
      wikiUrl: wikiLink(article.title),
      intro: parseIntro(article.root),
      history: parseHistory(article.root),
      ...symbols,
      ...(await loadGovernment(article.root, baseName, mayor)),
      councillors: parsePeople(findSection(article.root, /vereador|poder legislativo|c[âa]mara municipal/i)),
    }
  }

  // Sem verbete de município: devolve ao menos o nome
  return place.city ? { name: place.city, state: place.state, notFound: true } : null
}

/** Dados da cidade nas coordenadas dadas. `cacheKey` (nome da cidade) evita refazer as buscas. */
export async function loadCityInfo({ lat, lng, cacheKey }) {
  const key = cacheKey ? CACHE_PREFIX + cacheKey : null
  // Formato antigo do cache (com a lista completa de prefeitos) não serve mais
  try {
    Object.keys(localStorage)
      .filter(k => OLD_CACHE_PREFIXES.some(prefix => k.startsWith(prefix)))
      .forEach(k => localStorage.removeItem(k))
  } catch {}
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
