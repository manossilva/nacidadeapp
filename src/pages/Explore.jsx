import { useState } from 'react'
import { useParams } from 'react-router-dom'
import PageShell from '../components/layout/PageShell'
import CategoryFilter from '../components/layout/CategoryFilter'
import PlaceCard from '../components/cards/PlaceCard'
import EventCard from '../components/cards/EventCard'
import { SkeletonList } from '../components/ui/Skeleton'
import { usePlaces, useEvents } from '../hooks/usePlaces'

const PERIODS = [
  { value: 'today',    label: 'Hoje' },
  { value: 'tomorrow', label: 'Amanhã' },
  { value: 'week',     label: 'Esta semana' },
]

export default function Explore() {
  const { categoria } = useParams()
  const [activeCategory, setActiveCategory] = useState(categoria ?? null)
  const [period, setPeriod] = useState('today')
  const [tab, setTab] = useState('places') // 'places' | 'events'

  const { places, loading: loadingPlaces } = usePlaces({ category: activeCategory, limit: 30 })
  const { events, loading: loadingEvents } = useEvents({ category: activeCategory, period, limit: 30 })

  return (
    <PageShell>
      <div className="pt-4 pb-3">
        <h1 className="text-2xl font-bold text-gray-900">Explorar</h1>
      </div>

      {/* Filtro de categoria */}
      <CategoryFilter selected={activeCategory} onChange={setActiveCategory} />

      {/* Tabs */}
      <div className="flex gap-1 mt-4 bg-gray-100 rounded-xl p-1">
        {[{ key: 'places', label: 'Lugares' }, { key: 'events', label: 'Eventos' }].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Filtro de período (só para eventos) */}
      {tab === 'events' && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {PERIODS.map(p => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                period === p.value
                  ? 'bg-brand-900 text-white border-brand-900'
                  : 'bg-white text-gray-600 border-gray-200'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}

      {/* Resultados */}
      <section className="mt-4">
        {tab === 'places' ? (
          loadingPlaces ? (
            <SkeletonList count={6} />
          ) : places.length === 0 ? (
            <Empty text="Nenhum local encontrado nessa categoria." />
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {places.map(p => <PlaceCard key={p.id} place={p} />)}
            </div>
          )
        ) : (
          loadingEvents ? (
            <SkeletonList count={6} />
          ) : events.length === 0 ? (
            <Empty text="Nenhum evento nesse período." />
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {events.map(e => <EventCard key={e.id} event={e} />)}
            </div>
          )
        )}
      </section>
    </PageShell>
  )
}

function Empty({ text }) {
  return (
    <div className="py-12 text-center">
      <p className="text-gray-400 text-sm">{text}</p>
    </div>
  )
}
