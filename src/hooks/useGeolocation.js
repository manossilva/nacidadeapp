import { useState, useCallback } from 'react'
import { getCurrentPosition } from '../lib/geolocation'

/**
 * Hook para solicitar e manter a posição do usuário.
 * @returns {{ position, loading, error, request }}
 */
export function useGeolocation() {
  const [position, setPosition] = useState(null) // { lat, lng }
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const request = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const pos = await getCurrentPosition()
      setPosition(pos)
      return pos
    } catch (err) {
      setError(err.message || 'Não foi possível obter sua localização.')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { position, loading, error, request }
}
