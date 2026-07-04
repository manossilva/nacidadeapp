const NOMINATIM = 'https://nominatim.openstreetmap.org'
const HEADERS = { 'Accept-Language': 'pt-BR', 'User-Agent': 'AjuTurismo/1.0' }

export async function geocodePlace(query) {
  const url = `${NOMINATIM}/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`
  const res = await fetch(url, { headers: HEADERS })
  if (!res.ok) throw new Error('geocode failed')
  const data = await res.json()
  return data
    .map(item => ({
      shortName:
        item.address?.city ||
        item.address?.town ||
        item.address?.municipality ||
        item.address?.county ||
        item.name,
      name: item.display_name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
    }))
    .filter(r => r.shortName)
}

export async function reverseGeocode(lat, lng) {
  const url = `${NOMINATIM}/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`
  const res = await fetch(url, { headers: HEADERS })
  if (!res.ok) return null
  const data = await res.json()
  return (
    data.address?.city ||
    data.address?.town ||
    data.address?.municipality ||
    data.address?.county ||
    null
  )
}
