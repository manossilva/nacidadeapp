import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageShell from '../components/layout/PageShell'
import PlaceCard from '../components/cards/PlaceCard'
import EventCard from '../components/cards/EventCard'
import { SkeletonList } from '../components/ui/Skeleton'
import { useGeolocation } from '../hooks/useGeolocation'
import { useNearby } from '../hooks/usePlaces'
import { formatDistance } from '../lib/geolocation'

export default function Nearby() {
  const { position, loading: geoLoading, error: geoError, request } = useGeolocation()
  const { items, loading: nearbyLoading } = useNearby({
    lat: position?.lat,
    lng: position?.lng,
    radius: 5,
    limit: 30
  })

  // Solicita localização ao montar
  useEffect(() => { request() }, [])

  const loading = geoLoading || nearbyLoading

  return (
    <PageShell>
      <div className="pt-4 pb-3">
        <h1 className="text-2xl font-bold text-gray-900">Perto de mim</h1>
        {position && (
          <p className="text-sm text-gray-400 mt-0.5">
            Mostrando até 5 km de distância
          </p>
        )}
      </div>

      {/* Erro de geolocalização */}
      {geoError && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
          <p className="font-medium">Localização bloqueada</p>
          <p className="mt-0.5">{geoError}</p>
          <button onClick={request} className="mt-2 text-amber-700 font-medium underline">
            Tentar novamente
          </button>
        </div>
      )}

      {/* Carregando */}
      {loading && <div className="mt-4"><SkeletonList count={6} /></div>}

      {/* Resultados */}
      {!loading && position && (
        <>
          {items.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-4xl mb-2">🔍</p>
              <p className="text-gray-500 text-sm">Nenhum local encontrado num raio de 5 km.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 mt-2">
              {items.map(item =>
                item._type === 'place' ? (
                  <PlaceCard key={item.id} place={item} distance={item._distance} />
                ) : (
                  <EventCard key={item.id} event={item} distance={item._distance} />
                )
              )}
            </div>
          )}
        </>
      )}

      {/* Estado inicial: sem posição, sem erro, sem loading */}
      {!loading && !position && !geoError && (
        <div className="py-12 text-center">
          <p className="text-4xl mb-3">📍</p>
          <p className="text-gray-700 font-medium">Precisamos da sua localização</p>
          <p className="text-sm text-gray-400 mt-1">Para mostrar o que tem perto de você.</p>
          <button onClick={request} className="btn-primary max-w-xs mx-auto mt-4">
            Permitir localização
          </button>
        </div>
      )}
    </PageShell>
  )
}
