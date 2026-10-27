import { IcUtensils, IcBeer, IcMasks, IcCamera, IcLeaf, IcChurch } from '../components/ui/Icons'

/**
 * As 6 sessões fixas da Home (exibidas em maiúsculo). `types` vai direto no
 * includedTypes do Google Places — só tipos da Table A (um tipo inválido
 * derruba a busca inteira).
 */
export const HOME_CATEGORIES = [
  {
    id: 'gastronomia', label: 'Gastronomia', icon: IcUtensils,
    types: ['restaurant', 'brazilian_restaurant', 'seafood_restaurant', 'pizza_restaurant', 'steak_house', 'barbecue_restaurant', 'japanese_restaurant', 'hamburger_restaurant', 'cafe', 'coffee_shop', 'bakery', 'ice_cream_shop'],
  },
  {
    id: 'bares', label: 'Bares', icon: IcBeer,
    types: ['bar', 'night_club'],
  },
  {
    id: 'cultura', label: 'Cultura', icon: IcMasks,
    types: ['museum', 'art_gallery', 'performing_arts_theater', 'cultural_center', 'movie_theater', 'library', 'event_venue'],
  },
  {
    id: 'turismo', label: 'Turismo', icon: IcCamera,
    types: ['tourist_attraction', 'historical_landmark', 'visitor_center', 'aquarium', 'amusement_park', 'zoo', 'marina', 'park'],
  },
  {
    id: 'bem-estar', label: 'Bem-Estar', icon: IcLeaf,
    types: ['spa', 'gym', 'fitness_center', 'beauty_salon', 'hair_care', 'physiotherapist'],
  },
  {
    id: 'religiao', label: 'Religião', icon: IcChurch,
    types: ['church', 'hindu_temple', 'mosque', 'synagogue'],
  },
]
