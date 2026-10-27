import { useState, useMemo, useEffect } from 'react'
import PageShell from '../components/layout/PageShell'
import FeaturedBanner from '../components/cards/FeaturedBanner'
import { IcPin, IcMap, IcSearch } from '../components/ui/Icons'
import { useEvents } from '../hooks/usePlaces'
import { useLocation } from '../hooks/useLocation'
import { useGooglePlaces } from '../hooks/useGooglePlaces'
import { getPhotoUrl, typeLabel } from '../lib/googlePlaces'
import { formatDistance } from '../lib/geolocation'
import { HOME_CATEGORIES, ALL_CATEGORY_TYPES } from '../lib/categories'

function CategoryCircles({ selected, onSelect }) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {HOME_CATEGORIES.map(({ id, label, icon: Icon }) => {
        const active = selected === id
        return (
          <button
            key={id}
            onClick={() => onSelect(active ? null : id)}
            aria-pressed={active}
            className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform"
          >
            <span
              className={`w-full max-w-[3.5rem] aspect-square rounded-full flex items-center justify-center transition-colors ${
                active
                  ? 'bg-ink-800 text-sand-50 dark:bg-sand-100 dark:text-ink-900 shadow-lg'
                  : 'glass text-ink-700 dark:text-sand-200'
              }`}
            >
              <Icon className="w-6 h-6" />
            </span>
            <span className={`text-[11px] font-semibold ${
              active ? 'text-ink-800 dark:text-sand-100' : 'text-ink-500 dark:text-ink-400'
            }`}>
              {label}
            </span>
          </button>
        )
      })}
    </div>
  )
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
  const [category, setCategory] = useState(null)
  const activeCategory = HOME_CATEGORIES.find(c => c.id === category) ?? null

  // Evento em destaque
  const { events: featuredEvents } = useEvents({ featured: true, period: 'week', limit: 1 })
  const featuredItem = featuredEvents[0] ?? null

  // Eventos da semana para checar bolinha
  const { events: weekEvents } = useEvents({ period: 'week', limit: 50 })

  const { position, cityName, radiusKm, loading: geoLoading, requestGPS } = useLocation()

  // Atualiza sozinho a cidade com base em onde a pessoa está
  useEffect(() => {
    const perm = navigator.permissions?.query({ name: 'geolocation' }) ?? Promise.resolve(null)
    perm.then(s => { if (s?.state !== 'denied') requestGPS() }).catch(() => requestGPS())
  }, [requestGPS])

  // Sem sessão: busca as 5 juntas; com sessão: só os tipos dela
  const { places: allPlaces, loading: placesLoading } = useGooglePlaces({
    lat: position?.lat,
    lng: position?.lng,
    radiusKm,
    type: activeCategory?.types ?? ALL_CATEGORY_TYPES,
  })

  const places = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return allPlaces
    return allPlaces.filter(p => (p.displayName?.text ?? '').toLowerCase().includes(q))
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

  // Com posição salva, o GPS atualiza em segundo plano sem esconder a lista
  const loading = placesLoading || (geoLoading && !position)

  // Título sempre em uma linha: a fonte encolhe para nomes de cidade longos
  const titleChars = (cityName ? `O que rola em ${cityName} hoje?` : 'O que rola por aqui hoje?').length
  const titleSize = `clamp(1rem, calc((min(100vw, 42rem) - 2rem) / ${(titleChars * 0.56).toFixed(1)}), 1.75rem)`

  return (
    <PageShell>
      {/* Título — a cidade vem da localização e troca sozinha */}
      <div className="pt-5 pb-5 greeting-anim">
        <h1
          className="flex items-center gap-[0.25em] whitespace-nowrap font-bold tracking-tight leading-tight text-ink-800 dark:text-sand-100"
          style={{ fontSize: titleSize }}
        >
          <span className="flex-none">{cityName ? 'O que rola em' : 'O que rola'}</span>
          <span
            key={cityName ?? 'aqui'}
            className={`min-w-0 truncate text-rust-500 dark:text-rust-400 ${geoLoading && !cityName ? 'animate-pulse' : 'city-swap'}`}
          >
            {cityName ?? 'por aqui'}
          </span>
          <span className="flex-none">hoje?</span>
        </h1>
      </div>

      {/* Sessões — as 5 fixas */}
      <CategoryCircles selected={category} onSelect={setCategory} />

      {/* Destaque — evento em alta da agenda pública */}
      {featuredItem && (
        <div className="mt-5">
          <FeaturedBanner item={featuredItem} type="event" compact />
        </div>
      )}

      {/* Barra de busca fixa */}
      <div className="relative mt-5 mb-4">
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
            <p className="text-xs text-ink-400 mt-0.5">Para ver igrejas, festas, passeios e bares perto de você</p>
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
              {search
                ? `Nenhum local encontrado para "${search}"`
                : `Nenhum local${activeCategory ? ` de ${activeCategory.label.toLowerCase()}` : ''} nesse raio.`}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-ink-400 dark:text-ink-500">
              {activeCategory ? activeCategory.label : 'Perto de você'} · {places.length}
            </p>
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
