import { useState, useEffect, useCallback, useRef } from 'react'
import { getCurrentPosition, haversineDistance } from '../lib/geolocation'
import { reverseGeocode } from '../lib/geocoding'

const KEY = 'aju_loc_v1'
// Abaixo disso mantém a posição salva — evita refazer buscas por ruído do GPS
const MOVE_THRESHOLD_KM = 0.2

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
  const latest = useRef({ position, cityName })
  latest.current = { position, cityName }

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
      const prev = latest.current
      const moved = !prev.position ||
        haversineDistance(prev.position.lat, prev.position.lng, pos.lat, pos.lng) > MOVE_THRESHOLD_KM
      if (moved) setPosition(pos)
      if (moved || !prev.cityName) {
        const name = await reverseGeocode(pos.lat, pos.lng).catch(() => null)
        if (name) setCityName(name)
      }
      return moved ? pos : prev.position
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
