import { useState, useMemo } from 'react'
import PageShell from '../components/layout/PageShell'
import GooglePlaceCard from '../components/cards/GooglePlaceCard'
import { useLocation } from '../hooks/useLocation'
import { useGooglePlaces } from '../hooks/useGooglePlaces'
import { IcPin, IcSearch, IcMap } from '../components/ui/Icons'

const TYPES = [
  { id: null,               label: 'Todos' },
  { id: 'restaurant',       label: 'Restaurantes' },
  { id: 'bar',              label: 'Bares' },
  { id: 'cafe',             label: 'Cafés' },
  { id: 'night_club',       label: 'Baladas' },
  { id: 'tourist_attraction', label: 'Atrações' },
  { id: 'lodging',          label: 'Hotéis' },
  { id: 'museum',           label: 'Museus' },
  { id: 'park',             label: 'Parques' },
  { id: 'church',           label: 'Igrejas' },
  { id: 'supermarket',      label: 'Mercados' },
]

const RADII = [1, 2, 3, 5, 8, 10, 15, 20]

const CATEGORY_GROUPS = [
  { label: 'Restaurantes & Cafés',  types: ['restaurant', 'cafe', 'bakery', 'meal_delivery', 'meal_takeaway'] },
  { label: 'Bares & Baladas',       types: ['bar', 'night_club'] },
  { label: 'Igrejas & Religiosos',  types: ['church', 'hindu_temple', 'mosque', 'synagogue'] },
  { label: 'Atrações & Museus',     types: ['tourist_attraction', 'museum', 'art_gallery', 'amusement_park', 'aquarium', 'zoo'] },
  { label: 'Hotéis & Hospedagem',   types: ['lodging', 'campground', 'rv_park'] },
  { label: 'Parques & Natureza',    types: ['park', 'natural_feature', 'campground'] },
  { label: 'Compras & Serviços',    types: ['supermarket', 'shopping_mall', 'store', 'pharmacy', 'bank', 'gas_station', 'beauty_salon', 'gym'] },
]

function groupPlaces(places) {
  const grouped = []
  const assigned = new Set()
  for (const group of CATEGORY_GROUPS) {
    const items = places.filter(p => group.types.includes(p.primaryType) && !assigned.has(p.id))
    if (items.length > 0) {
      items.forEach(p => assigned.add(p.id))
      grouped.push({ label: group.label, items })
    }
  }
  const others = places.filter(p => !assigned.has(p.id))
  if (others.length > 0) grouped.push({ label: 'Outros', items: others })
  return grouped
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="aspect-[3/4] rounded-2xl animate-pulse"
          style={{ background: 'rgba(212,191,160,0.35)' }} />
      ))}
    </div>
  )
}

export default function Nearby() {
  const {
    position, radiusKm,
    loading: locLoading,
    requestGPS, setRadius,
  } = useLocation()

  const [type, setType] = useState(null)

  const { places, loading: placesLoading, error: placesError, noKey } = useGooglePlaces({
    lat: position?.lat,
    lng: position?.lng,
    radiusKm,
    type,
  })

  const grouped = useMemo(() => {
    if (type !== null) return null
    return groupPlaces(places)
  }, [places, type])

  const loading = locLoading || placesLoading

  return (
    <PageShell>
      {/* Header */}
      <div className="pt-5 pb-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-ink-400 mb-1">Onde estou</p>
        <h1 className="text-2xl font-bold text-ink-800 dark:text-sand-100">Perto de mim</h1>
        {position && !loading && (
          <p className="text-sm text-ink-500 dark:text-ink-400 mt-0.5">
            {places.length > 0
              ? `${places.length} local${places.length !== 1 ? 'is' : ''} num raio de ${radiusKm} km`
              : `Raio: ${radiusKm} km`}
          </p>
        )}
      </div>

      {/* No API key */}
      {noKey && (
        <div className="glass rounded-2xl p-4 mb-4">
          <p className="font-semibold text-sm text-ink-700 dark:text-sand-200">Google Maps não configurado</p>
          <p className="text-xs text-ink-500 dark:text-ink-400 mt-1">
            Adicione <code className="bg-ink-100/50 px-1 rounded">VITE_GOOGLE_MAPS_KEY</code> no painel da Vercel para ativar a busca.
          </p>
        </div>
      )}

      {/* Controls — radius + type filter */}
      {position && (
        <>
          <div className="glass rounded-2xl px-4 py-3 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-ink-600 dark:text-sand-300">Raio de busca</span>
              <span className="text-sm font-bold text-ink-800 dark:text-sand-100">{radiusKm} km</span>
            </div>
            <input
              type="range" min={1} max={20} step={1}
              value={radiusKm}
              onChange={e => setRadius(Number(e.target.value))}
              className="w-full accent-ink-700"
            />
            <div className="flex gap-2 overflow-x-auto scrollbar-none mt-2.5">
              {RADII.map(r => (
                <button
                  key={r}
                  onClick={() => setRadius(r)}
                  className={`flex-none text-xs font-semibold px-2.5 py-1 rounded-lg transition-all ${
                    radiusKm === r ? 'pill-active' : 'pill'
                  }`}
                >
                  {r} km
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-none mb-4">
            {TYPES.map(t => (
              <button
                key={String(t.id)}
                onClick={() => setType(t.id)}
                className={`flex-none text-xs font-semibold px-3.5 py-2 rounded-2xl whitespace-nowrap transition-all ${
                  type === t.id ? 'pill-active' : 'pill'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Loading */}
      {loading && <SkeletonGrid />}

      {/* Results */}
      {!loading && position && !noKey && (
        placesError ? (
          <div className="glass rounded-2xl p-4 text-center">
            <p className="text-sm text-red-600 dark:text-red-400 font-medium">Erro ao buscar locais</p>
            <p className="text-xs text-ink-500 mt-1">{placesError}</p>
          </div>
        ) : places.length === 0 ? (
          <div className="py-12 text-center">
            <IcSearch className="w-10 h-10 text-ink-300 dark:text-ink-600 mx-auto mb-3" />
            <p className="text-ink-600 dark:text-sand-300 font-medium">Nenhum local encontrado</p>
            <p className="text-sm text-ink-400 mt-1">Tente aumentar o raio de busca</p>
          </div>
        ) : type !== null ? (
          <>
            <p className="text-xs text-ink-400 dark:text-ink-500 mb-3">
              {places.length} local{places.length !== 1 ? 'is' : ''} encontrado{places.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {places.map(p => <GooglePlaceCard key={p.id} place={p} />)}
            </div>
          </>
        ) : (
          <div className="space-y-8">
            {grouped.map(group => (
              <section key={group.label}>
                <div className="flex items-center gap-2 mb-3">
                  <h2 className="font-bold text-sm text-ink-700 dark:text-sand-200">{group.label}</h2>
                  <span className="text-[10px] text-ink-400 bg-ink-100/50 dark:bg-ink-800/50 px-2 py-0.5 rounded-full">
                    {group.items.length}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {group.items.map(p => <GooglePlaceCard key={p.id} place={p} />)}
                </div>
              </section>
            ))}
          </div>
        )
      )}

      {/* Empty state — no location */}
      {!loading && !position && (
        <div className="py-14 text-center">
          <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center mx-auto mb-4">
            <IcPin className="w-8 h-8 text-ink-600 dark:text-sand-300" />
          </div>
          <p className="font-semibold text-ink-700 dark:text-sand-200">Defina sua localização</p>
          <p className="text-sm text-ink-500 dark:text-ink-400 mt-1 mb-5">
            Use o GPS ou busque uma cidade acima para ver locais próximos.
          </p>
          <button onClick={requestGPS} className="btn-primary max-w-xs mx-auto">
            <IcMap className="w-4 h-4" />
            Usar minha localização
          </button>
        </div>
      )}

      <div className="h-6" />
    </PageShell>
  )
}
