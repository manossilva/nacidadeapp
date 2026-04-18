import { useState, useEffect, useCallback } from 'react'
import { searchNearby } from '../lib/googlePlaces'
import { haversineDistance } from '../lib/geolocation'

export function useGooglePlaces({ lat, lng, radiusKm = 5, type = null }) {
  const [places, setPlaces]   = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)
  const [noKey, setNoKey]     = useState(false)

  const load = useCallback(async () => {
    if (!lat || !lng) return
    setLoading(true)
    setError(null)
    setNoKey(false)

    try {
      const results = await searchNearby({ lat, lng, radiusMeters: radiusKm * 1000, type })
      const withDist = results
        .map(p => ({
          ...p,
          _distance: haversineDistance(lat, lng, p.location.latitude, p.location.longitude),
        }))
        .sort((a, b) => a._distance - b._distance)
      setPlaces(withDist)
    } catch (e) {
      if (e.message === 'no_key') setNoKey(true)
      else setError(e.message)
    }

    setLoading(false)
  }, [lat, lng, radiusKm, type])

  useEffect(() => { load() }, [load])

  return { places, loading, error, noKey, refetch: load }
}
