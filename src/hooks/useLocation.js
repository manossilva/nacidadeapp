import { useState, useEffect, useCallback } from 'react'
import { getCurrentPosition } from '../lib/geolocation'
import { reverseGeocode } from '../lib/geocoding'

const KEY = 'aju_loc_v1'

function loadSaved() {
  try { return JSON.parse(localStorage.getItem(KEY)) ?? {} } catch { return {} }
}

/**
 * Unified location hook — persists to localStorage so state is shared across
 * all pages without a global store. Each component gets its own React state
 * but it's initialised from (and written to) the same localStorage key.
 */
export function useLocation() {
  const saved = loadSaved()
  const [position, setPosition] = useState(saved.position ?? null)
  const [cityName, setCityName] = useState(saved.cityName ?? null)
  const [radiusKm, setRadiusKm] = useState(saved.radiusKm ?? 5)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ position, cityName, radiusKm }))
    } catch {}
  }, [position, cityName, radiusKm])

  const requestGPS = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const pos = await getCurrentPosition()
      setPosition(pos)
      const name = await reverseGeocode(pos.lat, pos.lng).catch(() => null)
      if (name) setCityName(name)
      return pos
    } catch (err) {
      setError(err.message || 'Não foi possível obter sua localização.')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const setManualLocation = useCallback(({ name, lat, lng }) => {
    setPosition({ lat, lng })
    setCityName(name)
    setError(null)
  }, [])

  const setRadius = useCallback((km) => {
    setRadiusKm(km)
  }, [])

  return {
    position,
    cityName,
    radiusKm,
    loading,
    error,
    requestGPS,
    setManualLocation,
    setRadius,
  }
}
