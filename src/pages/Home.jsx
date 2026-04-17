import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import PageShell from '../components/layout/PageShell'
import FeaturedBanner from '../components/cards/FeaturedBanner'
import EventCard from '../components/cards/EventCard'
import PlaceCard from '../components/cards/PlaceCard'
import NearbyCircles from '../components/cards/NearbyCircles'
import Empty from '../components/ui/Empty'
import { usePlaces, useEvents, useNearby } from '../hooks/usePlaces'
import { useGeolocation } from '../hooks/useGeolocation'
import { MOCK_PLACES, MOCK_EVENTS } from '../lib/mockData'
import { USE_MOCK } from '../lib/config'

const dayLabel = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })

function SectionLabel({ children, to, linkLabel = 'Ver tudo' }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="font-bold text-base" style={{ color: '#1f2e1a' }}>{children}</h2>
      {to && (
        <Link to={to} className="text-xs font-semibold" style={{ color: '#3d5733' }}>
          {linkLabel} →
        </Link>
      )}
    </div>
  )
}

export default function Home() {
  const { events: supaEvents, loading: loadingFE } = useEvents({ featured: true, period: 'week', limit: 1, enabled: !USE_MOCK })
  const { events: supaEventsToday, loading: loadingEvents } = useEvents({ period: 'today', limit: 6, enabled: !USE_MOCK })
  const { places: supaPlaces, loading: loadingPlaces } = usePlaces({ limit: 6, enabled: !USE_MOCK })

  const featuredItem = USE_MOCK ? MOCK_EVENTS[0] : (supaEvents[0] ?? null)
  const events = USE_MOCK ? MOCK_EVENTS : supaEventsToday
  const places = USE_MOCK ? MOCK_PLACES : supaPlaces
  const loading = USE_MOCK ? false : (loadingFE || loadingEvents || loadingPlaces)

  const { position, loading: geoLoading, request: requestGeo } = useGeolocation()
  const { items: nearbyItems, loading: nearbyLoading } = useNearby({
    lat: position?.lat,
    lng: position?.lng,
    radius: 1.5,
    limit: 12,
  })

  const mockNearby = useMemo(
    () => MOCK_PLACES.map(p => ({ ...p, _type: 'place', _distance: Math.random() * 1.5 })),
    []
  )
  const nearbyData = position ? nearbyItems : (USE_MOCK ? mockNearby : nearbyItems)

  return (
    <PageShell>
      <div className="pt-5 pb-4">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#9aad92' }}>
          {dayLabel}
        </p>
        <h1 className="text-3xl font-bold leading-tight" style={{ color: '#1f2e1a' }}>
          O que rola<br />em Aracaju hoje?
        </h1>
      </div>

      {featuredItem && <FeaturedBanner item={featuredItem} type="event" />}

      <section className="mt-6">
        <SectionLabel to="/lugares">Tá rolando agora</SectionLabel>
        <NearbyCircles
          items={nearbyData}
          loading={geoLoading || nearbyLoading}
          hasLocation={!!position || USE_MOCK}
          onRequestLocation={requestGeo}
        />
      </section>

      <section className="mt-7">
        <SectionLabel to="/eventos">Eventos de hoje</SectionLabel>
        {loading ? (
          <SkeletonList />
        ) : events.length === 0 ? (
          <Empty text="Nenhum evento hoje. Tenta amanhã!" py="py-4" />
        ) : (
          <div className="space-y-2">
            {events.map(e => <EventCard key={e.id} event={e} compact />)}
          </div>
        )}
      </section>

      <section className="mt-7">
        <SectionLabel to="/lugares">Lugares que valem</SectionLabel>
        {loading ? (
          <SkeletonGrid />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {places.map(p => <PlaceCard key={p.id} place={p} />)}
          </div>
        )}
      </section>

      <Link
        to="/feed"
        className="mt-6 flex items-center justify-between p-4 rounded-2xl active:scale-[0.98] transition-transform"
        style={{ background: 'rgba(46,66,38,0.92)', boxShadow: '0 4px 20px rgba(30,46,26,0.2)' }}
      >
        <div>
          <p className="font-bold text-sm" style={{ color: '#f5f0e8' }}>Quem tá colado agora?</p>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(245,240,232,0.6)' }}>Veja o feed de quem saiu hoje</p>
        </div>
        <span className="text-lg" style={{ color: 'rgba(245,240,232,0.7)' }}>→</span>
      </Link>

      <div className="h-6" />
    </PageShell>
  )
}

function SkeletonList() {
  return (
    <div className="space-y-2">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-20 rounded-2xl animate-pulse" style={{ background: 'rgba(212,191,160,0.4)' }} />
      ))}
    </div>
  )
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="aspect-[4/3] rounded-2xl animate-pulse" style={{ background: 'rgba(212,191,160,0.4)' }} />
      ))}
    </div>
  )
}
