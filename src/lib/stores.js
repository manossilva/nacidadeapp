import { EXAMPLE_STORES } from './examples'
import { getPhotoUrl, typeLabel } from './googlePlaces'

/**
 * Perfil de loja — um formato só para as duas origens:
 *  - perfis do Google (todo negócio ativo no Google já entra como loja padrão)
 *  - lojas de exemplo (enquanto o banco não tem as cadastradas)
 */
export const MAX_SPONSORED_PER_DAY = 5

// Lojas que pagam pelo banner da Home: no máximo 5 por dia. Com mais anunciantes
// do que vagas, o grupo roda a cada dia para todos aparecerem.
export function sponsoredStoresToday(stores = EXAMPLE_STORES, max = MAX_SPONSORED_PER_DAY) {
  if (stores.length <= max) return stores
  const day = Math.floor(Date.now() / 86_400_000)
  const start = (day * max) % stores.length
  return Array.from({ length: max }, (_, i) => stores[(start + i) % stores.length])
}

export function findExampleStore(id) {
  return EXAMPLE_STORES.find(s => s.id === id) ?? null
}

// O Google não entrega logo: a primeira foto vira o avatar e as seguintes, a grade
export function storeFromPlace(place) {
  const photos = (place.photos ?? []).slice(0, 3).map(p => getPhotoUrl(p.name, 1080))
  return {
    id: place.id,
    name: place.displayName?.text ?? 'Local',
    categoryLabel: typeLabel(place.primaryType),
    logo: photos[0] ?? null,
    photos: photos.length > 1 ? photos.slice(1, 3) : photos,
    hours: place.currentOpeningHours?.weekdayDescriptions ?? place.regularOpeningHours?.weekdayDescriptions ?? null,
    openNow: place.currentOpeningHours?.openNow,
    phone: place.nationalPhoneNumber ?? null,
    website: place.websiteUri ?? null,
    address: place.shortFormattedAddress ?? place.formattedAddress ?? null,
    mapsUrl: place.googleMapsUri ?? null,
    rating: place.rating ?? null,
    ratingCount: place.userRatingCount ?? null,
  }
}
