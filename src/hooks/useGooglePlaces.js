import { useState, useEffect, useCallback, useRef } from 'react'
import { searchNearby, searchText } from '../lib/googlePlaces'
import { haversineDistance } from '../lib/geolocation'

// Trocar de subgrupo e voltar não refaz (nem cobra) a mesma busca no Google.
// Guarda a promessa, não o resultado: dois pedidos iguais ao mesmo tempo viram um só.
const CACHE_TTL = 5 * 60 * 1000
const cache = new Map()

function cachedPlaces(params) {
  const { lat, lng, radiusKm, type, queries } = params
  const key = JSON.stringify([lat.toFixed(4), lng.toFixed(4), radiusKm, type, queries])
  const hit = cache.get(key)
  if (hit && Date.now() - hit.at < CACHE_TTL) return hit.promise

  const promise = fetchPlaces(params)
  cache.set(key, { at: Date.now(), promise })
  // Busca que falhou não fica guardada: a próxima tentativa vai de novo ao Google
  promise.catch(() => { if (cache.get(key)?.promise === promise) cache.delete(key) })
  return promise
}

async function fetchPlaces({ lat, lng, radiusKm, type, queries }) {
  const radiusMeters = radiusKm * 1000
  const searches = []
  if (type?.length || !queries?.length) searches.push(searchNearby({ lat, lng, radiusMeters, type }))
  for (const query of queries ?? []) searches.push(searchText({ query, lat, lng, radiusMeters }))

  // Uma busca falhar não derruba as outras; só é erro se nenhuma responder
  const settled = await Promise.allSettled(searches)
  const ok = settled.filter(r => r.status === 'fulfilled')
  if (!ok.length) throw settled[0].reason

  const byId = new Map()
  for (const place of ok.flatMap(r => r.value)) {
    if (!place.location || byId.has(place.id)) continue
    byId.set(place.id, {
      ...place,
      _distance: haversineDistance(lat, lng, place.location.latitude, place.location.longitude),
    })
  }

  return [...byId.values()]
    // A busca por texto pode trazer gente de fora do raio
    .filter(p => p._distance <= radiusKm)
    .sort((a, b) => {
      const aOpen = a.currentOpeningHours?.openNow === true ? 0 : 1
      const bOpen = b.currentOpeningHours?.openNow === true ? 0 : 1
      if (aOpen !== bOpen) return aOpen - bOpen
      return a._distance - b._distance
    })
}

/**
 * Lugares do Google perto de um ponto. `type` são tipos do Google (busca por
 * proximidade); `queries` são buscas por texto. Os resultados se somam.
 */
export function useGooglePlaces({ lat, lng, radiusKm = 5, type = null, queries = null }) {
  const [places, setPlaces]   = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)
  const [noKey, setNoKey]     = useState(false)
  const latest = useRef(0)

  const load = useCallback(async () => {
    if (!lat || !lng) return
    const request = ++latest.current

    setError(null)
    setNoKey(false)
    setLoading(true)
    try {
      const found = await cachedPlaces({ lat, lng, radiusKm, type, queries })
      // Resposta de uma busca antiga não passa por cima da atual
      if (request === latest.current) setPlaces(found)
    } catch (e) {
      if (request !== latest.current) return
      if (e.message === 'no_key') setNoKey(true)
      else setError(e.message)
    }
    if (request === latest.current) setLoading(false)
  }, [lat, lng, radiusKm, type, queries])

  useEffect(() => { load() }, [load])

  return { places, loading, error, noKey, refetch: load }
}
