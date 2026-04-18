import { useState, useEffect } from 'react'

async function reverseGeocode(lat, lng) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&accept-language=pt`,
      { headers: { 'Accept-Language': 'pt-BR' } }
    )
    const data = await res.json()
    return (
      data.address?.city ||
      data.address?.town ||
      data.address?.municipality ||
      data.address?.county ||
      null
    )
  } catch {
    return null
  }
}

export function useCity() {
  const [city, setCity] = useState(() => localStorage.getItem('city_name') || null)
  const [detecting, setDetecting] = useState(false)

  useEffect(() => {
    if (city) return
    if (!navigator.geolocation) return
    setDetecting(true)
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const detected = await reverseGeocode(coords.latitude, coords.longitude)
        if (detected) {
          setCity(detected)
          localStorage.setItem('city_name', detected)
        }
        setDetecting(false)
      },
      () => setDetecting(false),
      { timeout: 8000, maximumAge: 600000 }
    )
  }, [])

  function changeCity(name) {
    if (!name.trim()) return
    const trimmed = name.trim()
    setCity(trimmed)
    localStorage.setItem('city_name', trimmed)
  }

  return { city, detecting, changeCity }
}
