import { useState } from 'react'
import PageShell from '../components/layout/PageShell'
import EventCard from '../components/cards/EventCard'
import Empty from '../components/ui/Empty'
import { useEvents } from '../hooks/usePlaces'
import { MOCK_EVENTS } from '../lib/mockData'
import { USE_MOCK } from '../lib/config'

const PERIODS = [
  { value: 'today',    label: 'Hoje' },
  { value: 'tomorrow', label: 'Amanhã' },
  { value: 'week',     label: 'Esta semana' },
]

export default function Eventos() {
  const [period, setPeriod] = useState('today')

  const { events: supaEvents, loading } = useEvents({ period, limit: 40, enabled: !USE_MOCK })
  const events = USE_MOCK ? MOCK_EVENTS : supaEvents

  return (
    <PageShell>
      <div className="pt-5 pb-4">
        <h1 className="text-2xl font-bold" style={{ color: '#1f2e1a' }}>Eventos</h1>
        <p className="text-sm mt-0.5" style={{ color: '#728c68' }}>O que tá rolando em Aracaju</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {PERIODS.map(p => (
          <button
            key={p.value}
            onClick={() => setPeriod(p.value)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              period === p.value ? 'pill-active' : 'pill'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <section className="mt-5">
        {loading ? (
          <SkeletonList />
        ) : events.length === 0 ? (
          <Empty text="Nenhum evento nesse período. Tenta outro dia!" />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {events.map(e => <EventCard key={e.id} event={e} />)}
          </div>
        )}
      </section>
    </PageShell>
  )
}

function SkeletonList() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-20 rounded-2xl animate-pulse" style={{ background: 'rgba(212,191,160,0.4)' }} />
      ))}
    </div>
  )
}
