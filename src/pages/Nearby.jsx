import { useEffect, useState } from 'react'
import PageShell from '../components/layout/PageShell'
import GooglePlaceCard from '../components/cards/GooglePlaceCard'
import { useGeolocation } from '../hooks/useGeolocation'
import { useGooglePlaces } from '../hooks/useGooglePlaces'
import { IcPin, IcSearch, IcMap } from '../components/ui/Icons'

const TYPES = [
  { id: null,              label: 'Todos' },
  { id: 'restaurant',      label: 'Restaurantes' },
  { id: 'bar',             label: 'Bares' },
  { id: 'cafe',            label: 'Cafés' },
  { id: 'night_club',      label: 'Baladas' },
  { id: 'tourist_attraction', label: 'Atrações' },
  { id: 'lodging',         label: 'Hotéis' },
  { id: 'museum',          label: 'Museus' },
  { id: 'park',            label: 'Parques' },
]

const RADII = [1, 2, 3, 5, 8, 10, 15, 20]

export default function Nearby() {
  const { position, loading: geoLoading, error: geoError, request } = useGeolocation()
  const [type, setType]       = useState(null)
  const [radiusKm, setRadius] = useState(5)

  useEffect(() => { request() }, [])

  const { places, loading: placesLoading, error: placesError, noKey } = useGooglePlaces({
    lat: position?.lat,
    lng: position?.lng,
    radiusKm,
    type,
  })

  const loading = geoLoading || placesLoading

  return (
    <PageShell>
      {/* Cabeçalho */}
      <div className="pt-5 pb-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-ink-400 mb-1">Onde estou</p>
        <h1 className="text-2xl font-bold text-ink-800 dark:text-sand-100">Perto de mim</h1>
        {position && (
          <p className="text-sm text-ink-500 dark:text-ink-400 mt-0.5">
            Estabelecimentos num raio de {radiusKm} km
          </p>
        )}
      </div>

      {/* Erro de geolocalização */}
      {geoError && (
        <div className="glass rounded-2xl p-4 mb-4 border border-amber-300/30">
          <p className="font-semibold text-sm text-amber-700 dark:text-amber-400">Localização bloqueada</p>
          <p className="text-xs text-ink-500 mt-0.5">{geoError}</p>
          <button onClick={request} className="mt-2 text-sm font-semibold text-ink-700 dark:text-sand-200 underline">
            Tentar novamente
          </button>
        </div>
      )}

      {/* Aviso de key não configurada */}
      {noKey && (
        <div className="glass rounded-2xl p-4 mb-4">
          <p className="font-semibold text-sm text-ink-700 dark:text-sand-200">Google Maps não configurado</p>
          <p className="text-xs text-ink-500 dark:text-ink-400 mt-1">
            Adicione <code className="bg-ink-100/50 px-1 rounded">VITE_GOOGLE_MAPS_KEY</code> no painel da Vercel para ativar a busca por negócios reais.
          </p>
        </div>
      )}

      {/* Controles — só mostra se tiver localização */}
      {position && (
        <>
          {/* Raio — slider */}
          <div className="glass rounded-2xl px-4 py-3 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-ink-600 dark:text-sand-300">Raio de busca</span>
              <span className="text-sm font-bold text-ink-800 dark:text-sand-100">{radiusKm} km</span>
            </div>
            <input
              type="range"
              min={1}
              max={20}
              step={1}
              value={radiusKm}
              onChange={e => setRadius(Number(e.target.value))}
              className="w-full accent-ink-700"
            />
            <div className="flex justify-between text-[10px] text-ink-400 mt-1">
              <span>1 km</span>
              <span>20 km</span>
            </div>
          </div>

          {/* Atalhos de raio */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none mb-4">
            {RADII.map(r => (
              <button
                key={r}
                onClick={() => setRadius(r)}
                className={`flex-none text-xs font-semibold px-3 py-1.5 rounded-xl transition-all ${
                  radiusKm === r ? 'pill-active' : 'pill'
                }`}
              >
                {r} km
              </button>
            ))}
          </div>

          {/* Filtro por tipo */}
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
      {loading && (
        <div className="grid grid-cols-2 gap-3">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="aspect-[3/4] rounded-2xl animate-pulse" style={{ background: 'rgba(212,191,160,0.35)' }} />
          ))}
        </div>
      )}

      {/* Resultados */}
      {!loading && position && !noKey && (
        <>
          {placesError ? (
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
          ) : (
            <>
              <p className="text-xs text-ink-400 dark:text-ink-500 mb-3">
                {places.length} local{places.length !== 1 ? 'is' : ''} encontrado{places.length !== 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-2 gap-3">
                {places.map(p => (
                  <GooglePlaceCard key={p.id} place={p} />
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* Estado inicial sem localização */}
      {!loading && !position && !geoError && (
        <div className="py-14 text-center">
          <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center mx-auto mb-4">
            <IcPin className="w-8 h-8 text-ink-600 dark:text-sand-300" />
          </div>
          <p className="font-semibold text-ink-700 dark:text-sand-200">Precisamos da sua localização</p>
          <p className="text-sm text-ink-500 dark:text-ink-400 mt-1 mb-5">Para mostrar restaurantes, bares e atrações perto de você.</p>
          <button onClick={request} className="btn-primary max-w-xs mx-auto">
            <IcMap className="w-4 h-4" />
            Permitir localização
          </button>
        </div>
      )}

      <div className="h-6" />
    </PageShell>
  )
}
