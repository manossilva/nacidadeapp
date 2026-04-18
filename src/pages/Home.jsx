import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import PageShell from '../components/layout/PageShell'
import FeaturedBanner from '../components/cards/FeaturedBanner'
import EventCard from '../components/cards/EventCard'
import PlaceCard from '../components/cards/PlaceCard'
import NearbyCircles from '../components/cards/NearbyCircles'
import Empty from '../components/ui/Empty'
import { IcStar, IcParty, IcMusic, IcUsers, IcCross } from '../components/ui/Icons'
import { usePlaces, useEvents, useNearby } from '../hooks/usePlaces'
import { useGeolocation } from '../hooks/useGeolocation'
import { MOCK_PLACES, MOCK_EVENTS } from '../lib/mockData'
import { USE_MOCK } from '../lib/config'

const SEGMENTS = [
  { id: 'todos',    label: 'Todos',     Icon: IcStar,   categories: [] },
  { id: 'publico',  label: 'Público',   Icon: IcUsers,  categories: ['cultural', 'esportivo', 'festival'] },
  { id: 'festa',    label: 'Festa',     Icon: IcParty,  categories: ['festival'] },
  { id: 'show',     label: 'Show',      Icon: IcMusic,  categories: ['show'] },
  { id: 'religioso',label: 'Religioso', Icon: IcCross,  categories: ['outro'] },
]

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return { text: 'Bom dia', emoji: '☀️' }
  if (h < 18) return { text: 'Boa tarde', emoji: '🌤️' }
  return { text: 'Boa noite', emoji: '🌙' }
}

function SectionLabel({ children, to, linkLabel = 'Ver tudo' }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="font-bold text-base text-ink-800 dark:text-sand-100">{children}</h2>
      {to && (
        <Link to={to} className="text-xs font-semibold text-ink-600 dark:text-sand-400">
          {linkLabel} →
        </Link>
      )}
    </div>
  )
}

export default function Home() {
  const [segment, setSegment] = useState('todos')
  const { text: greetText, emoji: greetEmoji } = greeting()

  const { events: supaFeatured } = useEvents({ featured: true, period: 'week', limit: 1, enabled: !USE_MOCK })
  const { events: supaEvents, loading: loadingEvents } = useEvents({ limit: 20, enabled: !USE_MOCK })
  const { places: supaPlaces, loading: loadingPlaces } = usePlaces({ limit: 6, enabled: !USE_MOCK })

  const featuredItem = USE_MOCK ? MOCK_EVENTS[0] : (supaFeatured[0] ?? null)
  const allEvents    = USE_MOCK ? MOCK_EVENTS : supaEvents
  const places       = USE_MOCK ? MOCK_PLACES : supaPlaces

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

  // Filtra eventos pelo segmento selecionado
  const seg = SEGMENTS.find(s => s.id === segment)
  const filteredEvents = seg?.categories.length
    ? allEvents.filter(e => seg.categories.includes(e.category))
    : allEvents

  return (
    <PageShell>
      {/* Saudação animada */}
      <div className="pt-5 pb-3 greeting-anim">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1 text-ink-400 dark:text-ink-500">
          {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
        <h1 className="text-3xl font-bold leading-tight text-ink-800 dark:text-sand-100">
          {greetText} {greetEmoji}
        </h1>
        <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">O que rola hoje na cidade?</p>
      </div>

      {/* Featured banner reduzido */}
      {featuredItem && (
        <div className="mb-5">
          <FeaturedBanner item={featuredItem} type="event" compact />
        </div>
      )}

      {/* Tá rolando agora */}
      <section className="mb-6">
        <SectionLabel to="/onde-estou">Tá rolando perto</SectionLabel>
        <NearbyCircles
          items={nearbyData}
          loading={geoLoading || nearbyLoading}
          hasLocation={!!position || USE_MOCK}
          onRequestLocation={requestGeo}
        />
      </section>

      {/* Segmentos */}
      <section>
        <SectionLabel>O que você quer?</SectionLabel>

        {/* Tabs de segmento */}
        <div className="flex gap-2 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-none">
          {SEGMENTS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setSegment(id)}
              className={`flex-none flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all active:scale-95 ${
                segment === id ? 'pill-active' : 'pill'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Lista de eventos do segmento */}
        <div className="mt-3 space-y-2">
          {loadingEvents ? (
            <SkeletonList />
          ) : filteredEvents.length === 0 ? (
            <Empty text={`Nenhum evento ${seg?.label?.toLowerCase() ?? ''} por enquanto.`} py="py-6" />
          ) : (
            filteredEvents.slice(0, 8).map(e => <EventCard key={e.id} event={e} compact />)
          )}
        </div>

        {filteredEvents.length > 8 && (
          <Link to="/eventos" className="mt-3 flex justify-center text-sm font-semibold text-ink-600 dark:text-sand-400">
            Ver todos os eventos →
          </Link>
        )}
      </section>

      {/* Lugares */}
      <section className="mt-7">
        <SectionLabel to="/lugares">Lugares que valem</SectionLabel>
        {loadingPlaces ? (
          <SkeletonGrid />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {places.slice(0, 4).map(p => <PlaceCard key={p.id} place={p} />)}
          </div>
        )}
      </section>

      <Link
        to="/feed"
        className="mt-6 flex items-center justify-between p-4 rounded-2xl active:scale-[0.98] transition-transform"
        style={{ background: 'rgba(46,66,38,0.92)', boxShadow: '0 4px 20px rgba(30,46,26,0.2)' }}
      >
        <div>
          <p className="font-bold text-sm text-sand-50">Quem tá colado agora?</p>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(245,240,232,0.6)' }}>Veja o feed de quem saiu hoje</p>
        </div>
        <span className="text-sand-300">→</span>
      </Link>

      <div className="h-6" />
    </PageShell>
  )
}

function SkeletonList() {
  return (
    <div className="space-y-2">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-20 rounded-2xl animate-pulse" style={{ background: 'rgba(212,191,160,0.35)' }} />
      ))}
    </div>
  )
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="aspect-[4/3] rounded-2xl animate-pulse" style={{ background: 'rgba(212,191,160,0.35)' }} />
      ))}
    </div>
  )
}
