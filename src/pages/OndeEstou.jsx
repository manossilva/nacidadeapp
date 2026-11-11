import { useEffect, useRef, useState } from 'react'
import { useLocation as useRouterLocation } from 'react-router-dom'
import PageShell from '../components/layout/PageShell'
import EventPost from '../components/cards/EventPost'
import Avatar from '../components/ui/Avatar'
import { IcPin, IcLandmark, IcGlobe, IcMegaphone, IcUsers } from '../components/ui/Icons'
import { useEvents } from '../hooks/usePlaces'
import { useLocation } from '../hooks/useLocation'
import { loadCityInfo } from '../lib/cityInfo'
import { isPublicEvent } from '../lib/events'
import { EXAMPLE_EVENTS } from '../lib/examples'

const AGENDA_ID = 'agenda-publica'

function SectionCard({ icon: Icon, title, children, id }) {
  return (
    <section id={id} className="glass rounded-2xl px-4 py-4 mt-4">
      <h2 className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-ink-400 mb-3">
        {Icon && <Icon className="w-3.5 h-3.5 ic" />} {title}
      </h2>
      {children}
    </section>
  )
}

// Bandeira e brasão lado a lado com o nome e os dados básicos
function CityHero({ info }) {
  return (
    <div className="glass rounded-3xl p-4">
      <div className="flex items-center gap-3">
        {info.coatUrl && (
          <img src={info.coatUrl} alt={`Brasão de ${info.name}`} className="h-16 w-auto max-w-[4.5rem] object-contain flex-none" />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-ink-400">Onde estou</p>
          <h1 className="text-2xl font-extrabold leading-tight text-ink-900 dark:text-sand-50">{info.name}</h1>
          {info.state && <p className="text-sm text-ink-500 dark:text-ink-400">{info.state}</p>}
        </div>
        {info.flagUrl && (
          <img
            src={info.flagUrl}
            alt={`Bandeira de ${info.name}`}
            className="h-14 w-auto max-w-[5.5rem] object-contain rounded-md flex-none"
            style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.15)' }}
          />
        )}
      </div>

      {info.facts?.length > 0 && (
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5 mt-4 pt-4 border-t border-ink-900/10 dark:border-white/10">
          {info.facts.map(f => (
            <div key={f.label} className={f.label === 'Lema' ? 'col-span-2' : ''}>
              <dt className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">{f.label}</dt>
              <dd className="text-sm font-semibold text-ink-800 dark:text-sand-100">{f.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  )
}

function History({ info }) {
  const [open, setOpen] = useState(false)
  const body = useRef(null)
  const blocks = [
    ...(info.intro ?? []).map(text => ({ type: 'p', text })),
    ...(info.history?.blocks ?? []),
  ]
  if (!blocks.length) return null
  const long = blocks.length > 2

  return (
    <SectionCard icon={IcGlobe} title="História da cidade">
      {/* Recolhida mostra 12rem; aberta cresce até a altura real do texto */}
      <div
        className="relative overflow-hidden transition-[max-height] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
        style={{ maxHeight: !long ? 'none' : open ? body.current?.scrollHeight ?? 'none' : '12rem' }}
      >
        <div ref={body} className="space-y-2.5 text-sm leading-relaxed text-ink-700 dark:text-sand-200">
          {blocks.map((b, i) =>
            b.type === 'h'
              ? <h3 key={i} className="font-bold text-ink-900 dark:text-sand-50 pt-1">{b.text}</h3>
              : <p key={i}>{b.text}</p>
          )}
        </div>
        {long && (
          <div className={`history-fade absolute inset-x-0 bottom-0 h-16 pointer-events-none transition-opacity duration-500 ${open ? 'opacity-0' : ''}`} />
        )}
      </div>
      <div className="flex items-center justify-between mt-3">
        {long ? (
          <button onClick={() => setOpen(o => !o)} className="tap text-xs font-bold text-ink-800 dark:text-brand-400 black:text-white">
            {open ? 'Mostrar menos' : 'Ler a história completa'}
          </button>
        ) : <span />}
        <a href={info.wikiUrl} target="_blank" rel="noopener noreferrer" className="text-[11px] text-ink-400 underline">
          Fonte: Wikipédia
        </a>
      </div>
    </SectionCard>
  )
}

// "Partido Social Democrático (PSD)" → "PSD"
const partyAcronym = party => party?.match(/\(([^()]+)\)\s*$/)?.[1] ?? party

function PeopleList({ people }) {
  return (
    <ul className="divide-y divide-ink-900/5 dark:divide-white/5">
      {people.map((p, i) => (
        <li key={`${p.name}-${i}`} className="flex items-baseline justify-between gap-3 py-1.5">
          <span className="text-sm font-medium text-ink-800 dark:text-sand-100">{p.name}</span>
          <span className="text-[11px] text-ink-400 text-right flex-none max-w-[45%]">
            {[partyAcronym(p.party), p.period].filter(Boolean).join(' · ')}
          </span>
        </li>
      ))}
    </ul>
  )
}

// "2021–2024" e "2025–2028" → "Mandatos 2021–2024 e 2025–2028"
function termsLabel(terms = []) {
  if (!terms.length) return null
  return `${terms.length > 1 ? 'Mandatos' : 'Mandato'} ${terms.join(' e ')}`
}

// Só quem está no cargo: prefeito e vice. Depois, os vereadores.
function Government({ info }) {
  const { mayor, vice } = info
  const [photoErr, setPhotoErr] = useState(false)

  return (
    <SectionCard icon={IcLandmark} title="Prefeitura e Câmara">
      {mayor ? (
        <div className="flex items-center gap-3.5">
          {mayor.photoUrl && !photoErr ? (
            <img
              src={mayor.photoUrl}
              alt={`Foto de ${mayor.name}`}
              onError={() => setPhotoErr(true)}
              className="w-[4.5rem] h-[4.5rem] flex-none rounded-2xl object-cover object-top bg-sand-200 dark:bg-ink-800"
            />
          ) : (
            <Avatar name={mayor.name} className="w-[4.5rem] h-[4.5rem]" tone="civic" />
          )}
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">{mayor.title}</p>
            <p className="text-base font-bold leading-tight text-ink-900 dark:text-sand-50">{mayor.name}</p>
            <p className="text-xs text-ink-500 dark:text-ink-400 mt-0.5">
              {[partyAcronym(mayor.party), termsLabel(mayor.terms)].filter(Boolean).join(' · ')}
            </p>
            {mayor.reelected && (
              <span className="inline-block mt-1.5 rounded-full bg-civic-600/10 dark:bg-civic-400/15 ic-public px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">
                Reeleição
              </span>
            )}
          </div>
        </div>
      ) : (
        <>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">Prefeito(a)</p>
          <p className="text-sm text-ink-500 dark:text-ink-400">A Wikipédia não informa quem está no cargo.</p>
        </>
      )}

      <div className="mt-4 pt-3 border-t border-ink-900/10 dark:border-white/10">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">{vice?.title ?? 'Vice-prefeito(a)'}</p>
        {vice ? (
          <p className="text-sm font-bold text-ink-900 dark:text-sand-50">{vice.name}</p>
        ) : (
          <p className="text-xs text-ink-400">A Wikipédia ainda não informa o vice desta cidade.</p>
        )}
      </div>

      {info.website && (
        <a
          href={info.website}
          target="_blank"
          rel="noopener noreferrer"
          className="tap inline-flex items-center gap-1.5 mt-3 text-xs font-bold text-ink-800 dark:text-brand-400 black:text-white"
        >
          <IcGlobe className="w-3.5 h-3.5" /> Site da prefeitura
        </a>
      )}

      <h3 className="flex items-center gap-1.5 text-xs font-bold text-ink-900 dark:text-sand-50 mt-5 mb-1">
        <IcUsers className="w-3.5 h-3.5 ic" /> Vereadores
      </h3>
      {info.councillors ? (
        <>
          <p className="text-[11px] text-ink-400 mb-1">{info.councillors.title}</p>
          <PeopleList people={info.councillors.people} />
        </>
      ) : (
        <p className="text-xs text-ink-400">A Wikipédia ainda não traz a lista de vereadores desta cidade.</p>
      )}
    </SectionCard>
  )
}

export default function OndeEstou() {
  const routerLocation = useRouterLocation()
  const { position, cityName, loading: geoLoading, requestGPS } = useLocation()
  const [info, setInfo] = useState(null)
  const [status, setStatus] = useState('idle') // idle | loading | ready | error

  useEffect(() => {
    if (!position) return
    let cancelled = false
    setStatus('loading')
    loadCityInfo({ lat: position.lat, lng: position.lng, cacheKey: cityName })
      .then(data => { if (!cancelled) { setInfo(data); setStatus(data ? 'ready' : 'error') } })
      .catch(() => { if (!cancelled) setStatus('error') })
    return () => { cancelled = true }
  }, [position?.lat, position?.lng, cityName])

  // Agenda pública: avisos e festas do órgão público desta cidade
  const { events: saved } = useEvents({ limit: 100 })
  const real = saved.filter(isPublicEvent)
  const agenda = (real.length ? real : EXAMPLE_EVENTS.filter(isPublicEvent))
    .sort((a, b) => new Date(a.starts_at) - new Date(b.starts_at))

  // Vindo do banner de eventos públicos, desce até a agenda (de novo quando a história carrega)
  useEffect(() => {
    if (routerLocation.hash !== `#${AGENDA_ID}`) return
    document.getElementById(AGENDA_ID)?.scrollIntoView({ block: 'start' })
  }, [routerLocation.hash, routerLocation.key, status])

  return (
    <PageShell>
      <div className="pt-5">
        {!position && !geoLoading && (
          <div className="glass rounded-2xl p-4 flex items-center gap-3">
            <IcPin className="w-5 h-5 ic flex-none" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-ink-700 dark:text-sand-200">Ative a localização</p>
              <p className="text-xs text-ink-400 mt-0.5">Para contar a história da cidade onde você está</p>
            </div>
            <button onClick={requestGPS} className="tap text-xs font-bold text-ink-700 dark:text-sand-200 whitespace-nowrap">
              Ativar →
            </button>
          </div>
        )}

        {(status === 'loading' || (geoLoading && !position)) && (
          <div className="space-y-4">
            <div className="h-40 rounded-3xl animate-pulse bg-sand-300/60 dark:bg-ink-800" />
            <div className="h-56 rounded-2xl animate-pulse bg-sand-300/60 dark:bg-ink-800" />
          </div>
        )}

        {status === 'error' && (
          <p className="glass rounded-2xl p-4 text-sm text-ink-500 dark:text-ink-400">
            Não foi possível carregar a história da cidade agora. Tente de novo em instantes.
          </p>
        )}

        {status === 'ready' && info && (
          <>
            <CityHero info={info} />
            {info.notFound ? (
              <p className="glass rounded-2xl p-4 mt-4 text-sm text-ink-500 dark:text-ink-400">
                Ainda não encontramos a história de {info.name} na Wikipédia.
              </p>
            ) : (
              <>
                <History info={info} />
                {info.anthem && (
                  <SectionCard title="Hino">
                    <p className="text-sm font-semibold text-ink-800 dark:text-sand-100">{info.anthem}</p>
                  </SectionCard>
                )}
                <Government info={info} />
              </>
            )}
          </>
        )}

        {/* Agenda pública */}
        <section id={AGENDA_ID} className="mt-6 scroll-mt-16">
          <h2 className="flex items-center gap-2 text-lg font-extrabold text-ink-900 dark:text-sand-50">
            <IcMegaphone className="w-5 h-5 ic-public" /> Agenda pública
          </h2>
          <p className="text-xs text-ink-500 dark:text-ink-400 mt-0.5 mb-4">
            Avisos, festas e serviços {info?.name ? `de ${info.name}` : 'da cidade'} para moradores e visitantes
          </p>
          <div className="space-y-4">
            {agenda.map((e, i) => (
              <div key={e.id} className="rise" style={{ '--i': i }}>
                <EventPost event={e} />
              </div>
            ))}
          </div>
        </section>

        <div className="h-6" />
      </div>
    </PageShell>
  )
}
