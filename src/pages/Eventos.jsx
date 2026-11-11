import { useEffect, useMemo, useState } from 'react'
import PageShell from '../components/layout/PageShell'
import EventPost from '../components/cards/EventPost'
import Segmented from '../components/ui/Segmented'
import { IcLandmark, IcCalendar } from '../components/ui/Icons'
import { useEvents } from '../hooks/usePlaces'
import { useLocation } from '../hooks/useLocation'
import { HOME_CATEGORIES } from '../lib/categories'
import { PERIODS, inPeriod, isPublicEvent } from '../lib/events'
import { EXAMPLE_EVENTS } from '../lib/examples'

// Bolinha dos eventos públicos — azul, a cor dos órgãos públicos. Vem na frente das
// 6 sessões para aparecer sem precisar arrastar a fileira
const PUBLIC_FILTER = { id: 'publico', label: 'Públicos', icon: IcLandmark }

// Banco lento ou fora do ar: depois disso a agenda mostra os exemplos sem esperar
const MAX_WAIT_MS = 2000

// Agenda: só o que os clientes (lojas e órgãos públicos) cadastram.
// Dois filtros que se combinam: quando (período) e o quê (sessão ou públicos).
export default function Eventos() {
  const [period, setPeriod] = useState('hoje')
  const [filter, setFilter] = useState(null)
  const { cityName } = useLocation()

  // Sem período no hook: traz tudo que vem pela frente e filtra aqui
  const { events: saved, loading } = useEvents({ limit: 100 })
  const all = saved.length ? saved : EXAMPLE_EVENTS

  const [waited, setWaited] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setWaited(true), MAX_WAIT_MS)
    return () => clearTimeout(t)
  }, [])

  const events = useMemo(() => {
    return all
      .filter(e => inPeriod(e, period))
      .filter(e => {
        if (!filter) return true
        if (filter === PUBLIC_FILTER.id) return isPublicEvent(e)
        return !isPublicEvent(e) && e.category === filter
      })
      .sort((a, b) => new Date(a.starts_at) - new Date(b.starts_at))
  }, [all, period, filter])

  const activeLabel = [...HOME_CATEGORIES, PUBLIC_FILTER].find(c => c.id === filter)?.label

  return (
    <PageShell>
      <div className="pt-5 pb-4">
        <h1 className="text-2xl font-bold text-ink-900 dark:text-sand-50">Agenda</h1>
        <p className="text-sm mt-0.5 text-ink-500 dark:text-ink-400">
          {cityName ? `O que vai rolar em ${cityName}` : 'O que vai rolar por aqui'}
        </p>
      </div>

      {/* Filtro 1 — quando */}
      <Segmented options={PERIODS} value={period} onChange={setPeriod} ariaLabel="Período" />

      {/* Filtro 2 — o quê: eventos públicos + as 6 sessões, em fileira como os stories */}
      <div
        className="flex gap-3 overflow-x-auto scrollbar-none -mx-4 px-4 pt-4 pb-1"
        role="group"
        aria-label="Tipo de evento"
      >
        {[PUBLIC_FILTER, ...HOME_CATEGORIES].map(({ id, label, icon: Icon }) => {
          const active = filter === id
          const isPublic = id === PUBLIC_FILTER.id
          return (
            <button
              key={id}
              onClick={() => setFilter(active ? null : id)}
              aria-pressed={active}
              className="tap flex-none w-16 flex flex-col items-center gap-1.5"
            >
              <span className={`w-14 h-14 rounded-full flex items-center justify-center ${
                isPublic ? (active ? 'bubble-public-current' : 'bubble-public') : active ? 'bubble-current' : 'bubble'
              }`}>
                <Icon className="w-6 h-6" />
              </span>
              <span className={`text-[10px] font-bold uppercase tracking-wide whitespace-nowrap transition-colors ${
                isPublic
                  ? 'ic-public'
                  : active ? 'text-ink-900 dark:text-brand-400 black:text-white' : 'text-ink-500 dark:text-ink-400'
              }`}>
                {label}
              </span>
            </button>
          )
        })}
      </div>

      <section className="mt-4">
        {loading && !waited ? (
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="max-w-[470px] mx-auto aspect-[4/5] rounded-2xl animate-pulse bg-sand-300/60 dark:bg-ink-800" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div key={`${period}:${filter}`} className="rise py-12 text-center">
            <IcCalendar className="w-8 h-8 text-ink-300 dark:text-ink-600 mx-auto mb-2" />
            <p className="text-sm text-ink-500 dark:text-ink-400">
              {filter === PUBLIC_FILTER.id
                ? 'Nenhum evento público'
                : `Nada${activeLabel ? ` de ${activeLabel.toLowerCase()}` : ''}`}
              {' '}na agenda para {PERIODS.find(p => p.id === period).when}.
            </p>
          </div>
        ) : (
          <div key={`${period}:${filter}`} className="space-y-4">
            {events.map((e, i) => (
              <div key={e.id} className="rise" style={{ '--i': i }}>
                <EventPost event={e} />
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="h-6" />
    </PageShell>
  )
}
