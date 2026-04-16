import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { haversineDistance } from '../lib/geolocation'

/**
 * Busca locais publicados com filtros opcionais.
 * @param {{ category?: string, featured?: boolean, limit?: number }} options
 */
export function usePlaces({ category, featured, limit = 20 } = {}) {
  const [places, setPlaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function fetch() {
      setLoading(true)
      let query = supabase
        .from('places')
        .select('id, name, slug, category, short_description, cover_image_url, neighborhood, whatsapp, latitude, longitude, price_range, plan_tier, is_featured, tags')
        .eq('is_published', true)
        .order('is_featured', { ascending: false })
        .order('plan_tier', { ascending: false })
        .limit(limit)

      if (category) query = query.eq('category', category)
      if (featured) query = query.eq('is_featured', true)

      const { data, error: err } = await query
      if (cancelled) return
      if (err) setError(err.message)
      else setPlaces(data ?? [])
      setLoading(false)
    }
    fetch()
    return () => { cancelled = true }
  }, [category, featured, limit])

  return { places, loading, error }
}

/**
 * Busca eventos publicados, com filtro por período.
 * @param {{ category?: string, period?: 'today'|'tomorrow'|'week', featured?: boolean, limit?: number }} options
 */
export function useEvents({ category, period, featured, limit = 20 } = {}) {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function fetch() {
      setLoading(true)
      const now = new Date()
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
      const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).toISOString()

      let query = supabase
        .from('events')
        .select('id, name, slug, category, short_description, cover_image_url, starts_at, ends_at, price_info, custom_location, latitude, longitude, plan_tier, is_featured, ticket_url')
        .eq('is_published', true)
        .gte('starts_at', todayStart)
        .order('is_featured', { ascending: false })
        .order('starts_at', { ascending: true })
        .limit(limit)

      if (category) query = query.eq('category', category)
      if (featured) query = query.eq('is_featured', true)
      if (period === 'today') query = query.lte('starts_at', todayEnd)
      if (period === 'tomorrow') {
        const tomorrowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString()
        const tomorrowEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 23, 59, 59).toISOString()
        query = query.gte('starts_at', tomorrowStart).lte('starts_at', tomorrowEnd)
      }
      if (period === 'week') {
        const weekEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7).toISOString()
        query = query.lte('starts_at', weekEnd)
      }

      const { data, error: err } = await query
      if (cancelled) return
      if (err) setError(err.message)
      else setEvents(data ?? [])
      setLoading(false)
    }
    fetch()
    return () => { cancelled = true }
  }, [category, period, featured, limit])

  return { events, loading, error }
}

/**
 * Busca locais e eventos ordenados por distância a partir de uma coordenada.
 */
export function useNearby({ lat, lng, radius = 5, limit = 30 } = {}) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!lat || !lng) return
    let cancelled = false
    async function fetch() {
      setLoading(true)
      const [{ data: places }, { data: events }] = await Promise.all([
        supabase
          .from('places')
          .select('id, name, slug, category, short_description, cover_image_url, neighborhood, whatsapp, latitude, longitude, price_range, plan_tier')
          .eq('is_published', true)
          .not('latitude', 'is', null),
        supabase
          .from('events')
          .select('id, name, slug, category, short_description, cover_image_url, starts_at, price_info, latitude, longitude, plan_tier')
          .eq('is_published', true)
          .not('latitude', 'is', null)
          .gte('starts_at', new Date().toISOString()),
      ])
      if (cancelled) return

      const withDistance = [
        ...(places ?? []).map(p => ({ ...p, _type: 'place', _distance: haversineDistance(lat, lng, p.latitude, p.longitude) })),
        ...(events ?? []).map(e => ({ ...e, _type: 'event', _distance: haversineDistance(lat, lng, e.latitude, e.longitude) })),
      ]
        .filter(i => i._distance <= radius)
        .sort((a, b) => a._distance - b._distance)
        .slice(0, limit)

      setItems(withDistance)
      setLoading(false)
    }
    fetch()
    return () => { cancelled = true }
  }, [lat, lng, radius, limit])

  return { items, loading, error }
}
