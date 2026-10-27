import { IcChurch, IcConfetti, IcCamera, IcUmbrella, IcBeer } from '../components/ui/Icons'

/**
 * As 5 sessões fixas da Home. `types` vai direto no includedTypes do
 * Google Places — só tipos da Table A (um tipo inválido derruba a busca).
 */
export const HOME_CATEGORIES = [
  { id: 'religiao', label: 'Religião', icon: IcChurch,   types: ['church', 'hindu_temple', 'mosque', 'synagogue'] },
  { id: 'festas',   label: 'Festas',   icon: IcConfetti, types: ['night_club', 'event_venue', 'banquet_hall'] },
  { id: 'turismo',  label: 'Turismo',  icon: IcCamera,   types: ['tourist_attraction', 'museum', 'historical_landmark', 'cultural_center', 'art_gallery', 'aquarium', 'visitor_center'] },
  { id: 'lazer',    label: 'Lazer',    icon: IcUmbrella, types: ['park', 'movie_theater', 'shopping_mall', 'amusement_center', 'amusement_park', 'bowling_alley', 'zoo'] },
  { id: 'bares',    label: 'Bares',    icon: IcBeer,     types: ['bar'] },
]

// Sem sessão selecionada: busca tudo das 5 de uma vez
export const ALL_CATEGORY_TYPES = HOME_CATEGORIES.flatMap(c => c.types)
