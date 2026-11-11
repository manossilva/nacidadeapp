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

async function post(path, body) {
  const res = await fetch(`${BASE}/${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey(),
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

const circle = (lat, lng, radiusMeters) => ({
  center: { latitude: lat, longitude: lng },
  radius: Math.min(radiusMeters, MAX_RADIUS_METERS),
})

export function searchNearby({ lat, lng, radiusMeters = 5000, type = null, maxResults = 20 }) {
  const body = {
    locationRestriction: { circle: circle(lat, lng, radiusMeters) },
    maxResultCount: Math.min(maxResults, 20),
    languageCode: 'pt-BR',
  }
  if (type) body.includedTypes = Array.isArray(type) ? type : [type]
  return post('places:searchNearby', body)
}

// Busca por texto — para os subgrupos que o Google não tem como tipo de lugar
// (sebo, centro espírita, terreiro…). Aqui o círculo é só preferência: quem
// chama descarta o que vier de fora do raio.
export function searchText({ query, lat, lng, radiusMeters = 5000, maxResults = 20 }) {
  return post('places:searchText', {
    textQuery: query,
    locationBias: { circle: circle(lat, lng, radiusMeters) },
    pageSize: Math.min(maxResults, 20),
    languageCode: 'pt-BR',
    regionCode: 'BR',
  })
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
    coffee_shop: 'Cafeteria', ice_cream_shop: 'Sorveteria', acai_shop: 'Açaiteria',
    fast_food_restaurant: 'Lanchonete', hamburger_restaurant: 'Hamburgueria',
    sandwich_shop: 'Lanchonete', pizza_restaurant: 'Pizzaria', steak_house: 'Churrascaria',
    barbecue_restaurant: 'Churrascaria', seafood_restaurant: 'Frutos do mar',
    brazilian_restaurant: 'Restaurante', japanese_restaurant: 'Restaurante japonês',
    vegan_restaurant: 'Restaurante vegano', vegetarian_restaurant: 'Restaurante vegetariano',
    confectionery: 'Confeitaria', dessert_shop: 'Doceria', candy_store: 'Doceria',
    food_court: 'Praça de alimentação', juice_shop: 'Casa de sucos', pub: 'Bar',
    library: 'Biblioteca', book_store: 'Livraria', performing_arts_theater: 'Teatro',
    fitness_center: 'Academia', spa: 'Spa', hair_care: 'Salão', hair_salon: 'Salão',
    barber_shop: 'Barbearia', pet_store: 'Pet shop', physiotherapist: 'Fisioterapia',
    massage: 'Massagem', yoga_studio: 'Estúdio de yoga', wellness_center: 'Bem-estar',
    place_of_worship: 'Templo', marina: 'Marina',
  }
  if (map[type]) return map[type]
  // Tipo sem tradução: mostra o nome do Google com a primeira letra maiúscula
  const raw = type?.replace(/_/g, ' ')
  return raw ? raw.charAt(0).toUpperCase() + raw.slice(1) : 'Local'
}
