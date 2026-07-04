import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageShell from '../components/layout/PageShell'
import FeaturedBanner from '../components/cards/FeaturedBanner'
import EventCard from '../components/cards/EventCard'
import PlaceCard from '../components/cards/PlaceCard'
import NearbyCircles from '../components/cards/NearbyCircles'
import Empty from '../components/ui/Empty'
import { IcStar, IcParty, IcMusic, IcUsers, IcCross, IcPin, IcMap } from '../components/ui/Icons'
import { usePlaces, useEvents, useNearby } from '../hooks/usePlaces'
import { useLocation } from '../hooks/useLocation'
import { useGooglePlaces } from '../hooks/useGooglePlaces'
import { MOCK_PLACES, MOCK_EVENTS } from '../lib/mockData'
import { USE_MOCK } from '../lib/config'
import { getPhotoUrl, typeLabel } from '../lib/googlePlaces'
import { formatDistance } from '../lib/geolocation'

const SEGMENTS = [
  { id: 'todos',     label: 'Todos',     Icon: IcStar,   categories: [] },
  { id: 'publico',   label: 'Público',   Icon: IcUsers,  categories: ['cultural', 'esportivo', 'festival'] },
  { id: 'festa',     label: 'Festa',     Icon: IcParty,  categories: ['festival'] },
  { id: 'show',      label: 'Show',      Icon: IcMusic,  categories: ['show'] },
  { id: 'religioso', label: 'Religioso', Icon: IcCross,  categories: ['outro'] },
]

const BUSINESS_TYPES = [
  { id: null,           label: 'Todos' },
  { id: 'restaurant',   label: 'Restaurantes' },
  { id: 'church',       label: 'Igrejas' },
  { id: 'bar',          label: 'Bares' },
  { id: 'cafe',         label: 'Cafés' },
  { id: 'tourist_attraction', label: 'Atrações' },
  { id: 'supermarket',  label: 'Mercados' },
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

function BusinessCard({ place }) {
  const [imgErr, setImgErr] = useState(false)
  const name   = place.displayName?.text ?? 'Local'
  const photo  = (!imgErr && place.photos?.[0]?.name) ? getPhotoUrl(place.photos[0].name, 300) : null
  const isOpen = place.currentOpeningHours?.openNow
  const type   = typeLabel(place.primaryType)

  function openMaps() {
    if (place.googleMapsUri) window.open(place.googleMapsUri, '_blank', 'noopener')
  }

  return (
    <div
      onClick={openMaps}
      className="card overflow-hidden active:scale-[0.97] transition-transform cursor-pointer"
    >
      <div className="relative h-28 bg-sand-200 dark:bg-ink-800">
        {photo ? (
          <img
            src={photo}
            alt={name}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={() => setImgErr(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <IcMap className="w-6 h-6 text-sand-400 dark:text-ink-600" />
          </div>
        )}
        {isOpen !== undefined && (
          <span
            className="absolute top-1.5 left-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full"
            style={{
              background: isOpen ? 'rgba(34,197,94,0.85)' : 'rgba(239,68,68,0.85)',
              color: '#fff',
            }}
          >
            {isOpen ? 'Aberto' : 'Fechado'}
          </span>
        )}
      </div>
      <div className="p-2.5">
        <p className="font-semibold text-xs leading-tight text-ink-800 dark:text-sand-100 line-clamp-1">{name}</p>
        <p className="text-[10px] text-ink-400 dark:text-ink-500 mt-0.5 capitalize">{type}</p>
        {place._distance != null && (
          <div className="flex items-center gap-1 mt-1">
            <IcPin className="w-2.5 h-2.5 text-ink-400 flex-none" />
            <span className="text-[10px] font-semibold text-ink-500 dark:text-ink-400">
              {formatDistance(place._distance)}
            </span>
          </div>
        )}
        {place.rating && (
          <div className="flex items-center gap-1 mt-0.5">
            <IcStar className="w-2.5 h-2.5 text-amber-500" filled />
            <span className="text-[10px] font-semibold text-ink-700 dark:text-sand-300">{place.rating.toFixed(1)}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Home() {
  const [segment, setSegment] = useState('todos')
  const [bizType, setBizType] = useState(null)
  const { text: greetText, emoji: greetEmoji } = greeting()

  const { events: supaFeatured } = useEvents({ featured: true, period: 'week', limit: 1, enabled: !USE_MOCK })
  const { events: supaEvents, loading: loadingEvents } = useEvents({ limit: 20, enabled: !USE_MOCK })
  const { places: supaPlaces, loading: loadingPlaces } = usePlaces({ limit: 6, enabled: !USE_MOCK })

  const featuredItem = USE_MOCK ? MOCK_EVENTS[0] : (supaFeatured[0] ?? null)
  const allEvents    = USE_MOCK ? MOCK_EVENTS : supaEvents
  const places       = USE_MOCK ? MOCK_PLACES : supaPlaces

  const {
    position,
    cityName,
    radiusKm,
    loading: geoLoading,
    requestGPS,
  } = useLocation()

  const { places: nearbyBusinesses, loading: bizLoading } = useGooglePlaces({
    lat: position?.lat,
    lng: position?.lng,
    radiusKm,
    type: bizType,
  })

  const { items: nearbyItems, loading: nearbyLoading } = useNearby({
    lat: position?.lat,
    lng: position?.lng,
    radius: 1.5,
    limit: 12,
  })

  const seg = SEGMENTS.find(s => s.id === segment)
  const filteredEvents = seg?.categories.length
    ? allEvents.filter(e => seg.categories.includes(e.category))
    : allEvents

  return (
    <PageShell>
      {/* Greeting */}
      <div className="pt-5 pb-3 greeting-anim">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1 text-ink-400 dark:text-ink-500">
          {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
        <h1 className="text-3xl font-bold leading-tight text-ink-800 dark:text-sand-100">
          {greetText} {greetEmoji}
        </h1>
        <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">
          {cityName ? `O que rola hoje em ${cityName}?` : 'O que rola hoje na cidade?'}
        </p>
      </div>

      {/* Featured banner */}
      {featuredItem && (
        <div className="mb-5">
          <FeaturedBanner item={featuredItem} type="event" compact />
        </div>
      )}

      {/* Empresas próximas — Google Places */}
      <section className="mb-6">
        <SectionLabel to="/onde-estou" linkLabel="Ver mais">Empresas próximas</SectionLabel>

        {/* Type filter */}
        {position && (
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none mb-3">
            {BUSINESS_TYPES.map(bt => (
              <button
                key={String(bt.id)}
                onClick={() => setBizType(bt.id)}
                className={`flex-none text-[11px] font-semibold px-3 py-1 rounded-xl transition-all ${
                  bizType === bt.id ? 'pill-active' : 'pill'
                }`}
              >
                {bt.label}
              </button>
            ))}
          </div>
        )}

        {/* Prompt to enable location */}
        {!position && !geoLoading && (
          <div className="glass rounded-2xl p-4 flex items-center gap-3">
            <IcPin className="w-5 h-5 text-ink-500 dark:text-sand-300 flex-none" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-ink-700 dark:text-sand-200">Ative a localização</p>
              <p className="text-xs text-ink-400 mt-0.5">Para ver restaurantes, igrejas e mais perto de você</p>
            </div>
            <button onClick={requestGPS} className="text-xs font-bold text-ink-700 dark:text-sand-200 whitespace-nowrap">
              Ativar →
            </button>
          </div>
        )}

        {/* Skeleton */}
        {(geoLoading || (position && bizLoading)) && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-44 rounded-2xl animate-pulse"
                style={{ background: 'rgba(212,191,160,0.35)' }} />
            ))}
          </div>
        )}

        {/* Results grid */}
        {position && !bizLoading && nearbyBusinesses.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {nearbyBusinesses.slice(0, 12).map(p => (
              <BusinessCard key={p.id} place={p} />
            ))}
          </div>
        )}

        {position && !bizLoading && nearbyBusinesses.length === 0 && (
          <p className="text-sm text-ink-400 dark:text-ink-500">Nenhuma empresa encontrada nesse raio.</p>
        )}
      </section>

      {/* Tá rolando perto (Supabase) */}
      <section className="mb-6">
        <SectionLabel to="/onde-estou">Tá rolando perto</SectionLabel>
        <NearbyCircles
          items={nearbyItems}
          loading={geoLoading || nearbyLoading}
          hasLocation={!!position}
          onRequestLocation={requestGPS}
        />
      </section>

      {/* Segmentos + Eventos */}
      <section>
        <SectionLabel to="/eventos" linkLabel="Ver agenda">O que vai rolar</SectionLabel>

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

        <div className="mt-3 space-y-2">
          {loadingEvents ? (
            <SkeletonList />
          ) : filteredEvents.length === 0 ? (
            <Empty text={`Nenhum evento ${seg?.label?.toLowerCase() ?? ''} por enquanto.`} py="py-6" />
          ) : (
            filteredEvents.slice(0, 6).map(e => <EventCard key={e.id} event={e} compact />)
          )}
        </div>

        {filteredEvents.length > 6 && (
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
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {places.slice(0, 6).map(p => <PlaceCard key={p.id} place={p} />)}
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
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="aspect-[4/3] rounded-2xl animate-pulse" style={{ background: 'rgba(212,191,160,0.35)' }} />
      ))}
    </div>
  )
}
