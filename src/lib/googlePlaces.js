const BASE = 'https://places.googleapis.com/v1'

const FIELD_MASK = [
  'places.id',
  'places.displayName',
  'places.formattedAddress',
  'places.shortFormattedAddress',
  'places.location',
  'places.rating',
  'places.userRatingCount',
  'places.priceLevel',
  'places.primaryType',
  'places.types',
  'places.photos',
  'places.currentOpeningHours',
  'places.businessStatus',
  'places.nationalPhoneNumber',
  'places.websiteUri',
  'places.googleMapsUri',
].join(',')

// A API do Google só aceita raio de até 50 km
export const MAX_RADIUS_METERS = 50_000

function apiKey() {
  const key = import.meta.env.VITE_GOOGLE_MAPS_KEY
  if (!key || key === 'sua_google_maps_api_key_aqui') {
    throw new Error('no_key')
  }
  return key
}

export async function searchNearby({ lat, lng, radiusMeters = 5000, type = null, maxResults = 20 }) {
  const key = apiKey()

  const body = {
    locationRestriction: {
      circle: {
        center: { latitude: lat, longitude: lng },
        radius: Math.min(radiusMeters, MAX_RADIUS_METERS),
      },
    },
    maxResultCount: Math.min(maxResults, 20),
    languageCode: 'pt-BR',
  }

  if (type) body.includedTypes = Array.isArray(type) ? type : [type]

  const res = await fetch(`${BASE}/places:searchNearby`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': key,
      'X-Goog-FieldMask': FIELD_MASK,
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message ?? `Places API ${res.status}`)
  }

  const data = await res.json()
  return data.places ?? []
}

// Um local pelo id — para abrir o perfil da loja por link direto
export async function getPlace(id) {
  const res = await fetch(`${BASE}/places/${encodeURIComponent(id)}?languageCode=pt-BR`, {
    headers: {
      'X-Goog-Api-Key': apiKey(),
      'X-Goog-FieldMask': FIELD_MASK.replaceAll('places.', ''),
    },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message ?? `Places API ${res.status}`)
  }
  return res.json()
}

export function getPhotoUrl(photoName, maxWidth = 400) {
  const key = import.meta.env.VITE_GOOGLE_MAPS_KEY
  return `${BASE}/${photoName}/media?key=${key}&maxWidthPx=${maxWidth}&skipHttpRedirect=false`
}

export function priceLabel(level) {
  return { PRICE_LEVEL_FREE: 'Grátis', PRICE_LEVEL_INEXPENSIVE: '$', PRICE_LEVEL_MODERATE: '$$', PRICE_LEVEL_EXPENSIVE: '$$$', PRICE_LEVEL_VERY_EXPENSIVE: '$$$$' }[level] ?? null
}

export function typeLabel(type) {
  const map = {
    restaurant: 'Restaurante', bar: 'Bar', cafe: 'Café', bakery: 'Padaria',
    lodging: 'Hotel', tourist_attraction: 'Atração', museum: 'Museu',
    park: 'Parque', supermarket: 'Mercado', pharmacy: 'Farmácia',
    gym: 'Academia', beauty_salon: 'Salão', night_club: 'Balada',
    shopping_mall: 'Shopping', store: 'Loja', gas_station: 'Posto',
    hospital: 'Hospital', bank: 'Banco', church: 'Igreja',
    hindu_temple: 'Templo', mosque: 'Mesquita', synagogue: 'Sinagoga',
    event_venue: 'Espaço de eventos', banquet_hall: 'Salão de festas',
    historical_landmark: 'Ponto histórico', cultural_center: 'Centro cultural',
    art_gallery: 'Galeria', aquarium: 'Aquário', visitor_center: 'Centro de visitantes',
    movie_theater: 'Cinema', amusement_center: 'Diversão', amusement_park: 'Parque de diversões',
    bowling_alley: 'Boliche', zoo: 'Zoológico',
  }
  return map[type] ?? type?.replace(/_/g, ' ') ?? 'Local'
}
