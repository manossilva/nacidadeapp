import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageShell from '../components/layout/PageShell'
import FeaturedBanner from '../components/cards/FeaturedBanner'
import EventCard from '../components/cards/EventCard'
import Empty from '../components/ui/Empty'
import { IcPin, IcMap, IcStar } from '../components/ui/Icons'
import { useEvents } from '../hooks/usePlaces'
import { useLocation } from '../hooks/useLocation'
import { useGooglePlaces } from '../hooks/useGooglePlaces'
import { getPhotoUrl, typeLabel } from '../lib/googlePlaces'
import { formatDistance } from '../lib/geolocation'

const BUSINESS_TYPES = [
  { id: null,        label: 'Todos' },
  { id: 'church',    label: 'Igrejas' },
  { id: 'bar',       label: 'Bares' },
  { id: 'cafe',      label: 'Cafés' },
  { id: 'night_club', label: 'Shows' },
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
            src={photo} alt={name}
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
  const [bizType, setBizType] = useState(null)
  const { text: greetText, emoji: greetEmoji } = greeting()

  const { events: featuredEvents } = useEvents({ featured: true, period: 'week', limit: 1 })
  const { events: agendaEvents, loading: loadingEvents } = useEvents({ limit: 20 })

  const featuredItem = featuredEvents[0] ?? null

  const { position, cityName, radiusKm, loading: geoLoading, requestGPS } = useLocation()

  const { places: nearbyBusinesses, loading: bizLoading } = useGooglePlaces({
    lat: position?.lat,
    lng: position?.lng,
    radiusKm,
    type: bizType,
  })

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

      {/* Destaque — evento em alta da agenda pública */}
      {featuredItem && (
        <div className="mb-5">
          <FeaturedBanner item={featuredItem} type="event" compact />
        </div>
      )}

      {/* Perto de mim — Google Places */}
      <section className="mb-6">
        <SectionLabel to="/onde-estou" linkLabel="Ver mais">Perto de mim</SectionLabel>

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

        {!position && !geoLoading && (
          <div className="glass rounded-2xl p-4 flex items-center gap-3">
            <IcPin className="w-5 h-5 text-ink-500 dark:text-sand-300 flex-none" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-ink-700 dark:text-sand-200">Ative a localização</p>
              <p className="text-xs text-ink-400 mt-0.5">Para ver igrejas, bares, cafés e shows perto de você</p>
            </div>
            <button onClick={requestGPS} className="text-xs font-bold text-ink-700 dark:text-sand-200 whitespace-nowrap">
              Ativar →
            </button>
          </div>
        )}

        {(geoLoading || (position && bizLoading)) && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-44 rounded-2xl animate-pulse"
                style={{ background: 'rgba(212,191,160,0.35)' }} />
            ))}
          </div>
        )}

        {position && !bizLoading && nearbyBusinesses.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {nearbyBusinesses.slice(0, 12).map(p => (
              <BusinessCard key={p.id} place={p} />
            ))}
          </div>
        )}

        {position && !bizLoading && nearbyBusinesses.length === 0 && (
          <p className="text-sm text-ink-400 dark:text-ink-500">Nenhum local encontrado nesse raio.</p>
        )}
      </section>

      {/* Agenda Pública */}
      <section>
        <SectionLabel to="/eventos" linkLabel="Ver agenda">Agenda Pública</SectionLabel>

        <div className="space-y-2">
          {loadingEvents ? (
            <SkeletonList />
          ) : agendaEvents.length === 0 ? (
            <Empty text="Nenhum evento na agenda por enquanto." py="py-6" />
          ) : (
            agendaEvents.slice(0, 6).map(e => <EventCard key={e.id} event={e} compact />)
          )}
        </div>

        {agendaEvents.length > 6 && (
          <Link to="/eventos" className="mt-3 flex justify-center text-sm font-semibold text-ink-600 dark:text-sand-400">
            Ver toda a agenda →
          </Link>
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
