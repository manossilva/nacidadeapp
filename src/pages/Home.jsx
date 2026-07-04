import { useState, useMemo } from 'react'
import PageShell from '../components/layout/PageShell'
import FeaturedBanner from '../components/cards/FeaturedBanner'
import { IcPin, IcMap, IcSearch } from '../components/ui/Icons'
import { useEvents } from '../hooks/usePlaces'
import { useLocation } from '../hooks/useLocation'
import { useGooglePlaces } from '../hooks/useGooglePlaces'
import { getPhotoUrl, typeLabel } from '../lib/googlePlaces'
import { formatDistance } from '../lib/geolocation'

// Tipos permitidos — o restante é filtrado fora
const ALLOWED_TYPES = new Set([
  'church', 'hindu_temple', 'mosque', 'synagogue',
  'bar',
  'cafe', 'bakery',
  'night_club',
])

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return { text: 'Bom dia', emoji: '☀️' }
  if (h < 18) return { text: 'Boa tarde', emoji: '🌤️' }
  return { text: 'Boa noite', emoji: '🌙' }
}

function PlaceListItem({ place, hasEvent }) {
  const [imgErr, setImgErr] = useState(false)
  const name     = place.displayName?.text ?? 'Local'
  const photo    = (!imgErr && place.photos?.[0]?.name)
    ? getPhotoUrl(place.photos[0].name, 200)
    : null
  const isOpen   = place.currentOpeningHours?.openNow
  const type     = typeLabel(place.primaryType)
  const distance = place._distance != null ? formatDistance(place._distance) : null

  function openMaps() {
    if (place.googleMapsUri) window.open(place.googleMapsUri, '_blank', 'noopener')
  }

  return (
    <div
      onClick={openMaps}
      className="card flex items-center gap-3 p-3 cursor-pointer active:scale-[0.98] transition-transform relative"
    >
      {/* Foto miniatura */}
      <div className="w-14 h-14 rounded-xl overflow-hidden bg-sand-200 dark:bg-ink-800 flex-none">
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
            <IcMap className="w-5 h-5 text-sand-400 dark:text-ink-600" />
          </div>
        )}
      </div>

      {/* Informações */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-ink-800 dark:text-sand-100 line-clamp-1">{name}</p>
        <p className="text-xs text-ink-400 dark:text-ink-500 mt-0.5 capitalize">
          {[type, distance].filter(Boolean).join(' · ')}
        </p>
        {isOpen !== undefined && (
          <div className="flex items-center gap-1.5 mt-1.5">
            <span
              className="w-1.5 h-1.5 rounded-full flex-none"
              style={{ background: isOpen ? '#22c55e' : '#f87171' }}
            />
            <span className="text-xs text-ink-500 dark:text-ink-400">
              {isOpen ? 'Aberto' : 'Fechado'}
            </span>
          </div>
        )}
      </div>

      {/* Bolinha piscando — evento nesta semana neste local */}
      {hasEvent && (
        <span
          className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full animate-pulse"
          style={{ background: '#f59e0b' }}
          title="Tem evento essa semana"
        />
      )}
    </div>
  )
}

export default function Home() {
  const [search, setSearch] = useState('')
  const { text: greetText, emoji: greetEmoji } = greeting()

  // Evento em destaque
  const { events: featuredEvents } = useEvents({ featured: true, period: 'week', limit: 1 })
  const featuredItem = featuredEvents[0] ?? null

  // Eventos da semana para checar bolinha
  const { events: weekEvents } = useEvents({ period: 'week', limit: 50 })

  const { position, cityName, radiusKm, loading: geoLoading, requestGPS } = useLocation()

  // Busca todos os locais de uma vez; filtra por tipo client-side
  const { places: allPlaces, loading: placesLoading } = useGooglePlaces({
    lat: position?.lat,
    lng: position?.lng,
    radiusKm,
    type: null,
  })

  const places = useMemo(() => {
    return allPlaces
      .filter(p => ALLOWED_TYPES.has(p.primaryType))
      .filter(p =>
        !search.trim() ||
        (p.displayName?.text ?? '').toLowerCase().includes(search.trim().toLowerCase())
      )
  }, [allPlaces, search])

  // Checa se um local tem evento nesta semana pelo nome
  function hasEventThisWeek(placeName) {
    if (!weekEvents.length || !placeName) return false
    const name = placeName.toLowerCase()
    return weekEvents.some(e =>
      e.custom_location?.toLowerCase().includes(name) ||
      e.name?.toLowerCase().includes(name)
    )
  }

  const loading = geoLoading || placesLoading

  return (
    <PageShell>
      {/* Saudação */}
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

      {/* Barra de busca fixa */}
      <div className="relative mb-4">
        <IcSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400 dark:text-ink-500 pointer-events-none" />
        <input
          className="input pl-9 pr-4 w-full"
          placeholder="Buscar local pelo nome..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Prompt de localização */}
      {!position && !geoLoading && (
        <div className="glass rounded-2xl p-4 mb-4 flex items-center gap-3">
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

      {/* Skeleton */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-20 rounded-2xl animate-pulse"
              style={{ background: 'rgba(212,191,160,0.35)' }} />
          ))}
        </div>
      )}

      {/* Lista vertical de locais */}
      {!loading && position && (
        places.length === 0 ? (
          <div className="py-10 text-center">
            <IcSearch className="w-8 h-8 text-ink-300 dark:text-ink-600 mx-auto mb-2" />
            <p className="text-sm text-ink-500 dark:text-ink-400">
              {search ? `Nenhum local encontrado para "${search}"` : 'Nenhum local encontrado nesse raio.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {places.map(p => (
              <PlaceListItem
                key={p.id}
                place={p}
                hasEvent={hasEventThisWeek(p.displayName?.text)}
              />
            ))}
          </div>
        )
      )}

      <div className="h-6" />
    </PageShell>
  )
}
