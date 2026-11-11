import {
  IcUtensils, IcBeer, IcMasks, IcCamera, IcLeaf, IcChurch,
  IcCoffee, IcIceCream, IcBurger, IcCake, IcApple, IcTray,
  IcFilm, IcLibrary, IcLandmark, IcBookStack, IcBookOpen,
  IcDumbbell, IcPaw, IcLotus, IcStones, IcScissors,
  IcLatinCross, IcBible, IcSparkles, IcDrum,
} from '../components/ui/Icons'

/**
 * As 6 sessões fixas da Home (exibidas em maiúsculo) e os subgrupos de cada uma.
 *
 * `types` vai direto no includedTypes do Google Places — só tipos da Table A
 * (um tipo inválido derruba a busca inteira). Subgrupo que o Google não tem
 * como tipo (sebo, centro espírita, terreiro…) usa `queries`: busca por texto.
 * Um subgrupo pode ter os dois; os resultados se somam.
 */
export const HOME_CATEGORIES = [
  {
    id: 'gastronomia', label: 'Gastronomia', icon: IcUtensils,
    types: ['restaurant', 'brazilian_restaurant', 'seafood_restaurant', 'pizza_restaurant', 'steak_house', 'barbecue_restaurant', 'japanese_restaurant', 'hamburger_restaurant', 'cafe', 'coffee_shop', 'bakery', 'ice_cream_shop'],
    subgroups: [
      { id: 'padarias',     label: 'Padarias e cafeterias',     icon: IcCoffee,   types: ['bakery', 'cafe', 'coffee_shop'] },
      { id: 'sorveterias',  label: 'Sorveterias e açaiterias',  icon: IcIceCream, types: ['ice_cream_shop'], queries: ['açaiteria'] },
      { id: 'restaurantes', label: 'Restaurantes e lanchonetes', icon: IcBurger,  types: ['restaurant', 'brazilian_restaurant', 'fast_food_restaurant', 'hamburger_restaurant', 'sandwich_shop', 'pizza_restaurant', 'steak_house', 'seafood_restaurant', 'barbecue_restaurant', 'japanese_restaurant'] },
      { id: 'confeitarias', label: 'Confeitarias e docerias',   icon: IcCake,     queries: ['confeitaria doceria'] },
      { id: 'saudaveis',    label: 'Saudáveis e naturais',      icon: IcApple,    types: ['vegan_restaurant', 'vegetarian_restaurant'], queries: ['comida saudável natural'] },
      { id: 'praca',        label: 'Praça de alimentação',      icon: IcTray,     queries: ['praça de alimentação'] },
    ],
  },
  {
    // Sem subgrupos: os cartões dos bares levam a tarja de cover artístico
    id: 'bares', label: 'Bares', icon: IcBeer,
    types: ['bar', 'night_club'],
    subgroups: [],
  },
  {
    id: 'cultura', label: 'Cultura', icon: IcMasks,
    types: ['museum', 'art_gallery', 'performing_arts_theater', 'cultural_center', 'movie_theater', 'library', 'book_store', 'event_venue'],
    subgroups: [
      { id: 'cinemas',     label: 'Cinemas e memoriais', icon: IcFilm,      types: ['movie_theater'], queries: ['memorial'] },
      { id: 'bibliotecas', label: 'Bibliotecas',         icon: IcLibrary,   types: ['library'] },
      { id: 'museus',      label: 'Museus',              icon: IcLandmark,  types: ['museum'] },
      { id: 'sebos',       label: 'Sebos',               icon: IcBookStack, queries: ['sebo livros usados'] },
      { id: 'livrarias',   label: 'Livrarias',           icon: IcBookOpen,  types: ['book_store'] },
    ],
  },
  {
    id: 'turismo', label: 'Turismo', icon: IcCamera,
    types: ['tourist_attraction', 'historical_landmark', 'visitor_center', 'aquarium', 'amusement_park', 'zoo', 'marina', 'park'],
    subgroups: [],
  },
  {
    id: 'bem-estar', label: 'Bem-estar', icon: IcLeaf,
    types: ['spa', 'gym', 'fitness_center', 'beauty_salon', 'hair_care', 'physiotherapist', 'pet_store'],
    subgroups: [
      { id: 'academias', label: 'Academias e treino',   icon: IcDumbbell, types: ['gym', 'fitness_center'] },
      { id: 'pet',       label: 'Pet shops',            icon: IcPaw,      types: ['pet_store'] },
      { id: 'terapias',  label: 'Terapias e meditação', icon: IcLotus,    queries: ['terapias holísticas meditação yoga'] },
      { id: 'massagem',  label: 'Massagem e spas',      icon: IcStones,   types: ['spa'], queries: ['massagem'] },
      { id: 'beleza',    label: 'Beleza e estética',    icon: IcScissors, types: ['beauty_salon', 'hair_care', 'hair_salon', 'barber_shop'] },
    ],
  },
  {
    id: 'religiao', label: 'Religião', icon: IcChurch,
    types: ['church', 'hindu_temple', 'mosque', 'synagogue'],
    subgroups: [
      { id: 'catolica',   label: 'Católica',        icon: IcLatinCross, queries: ['igreja católica paróquia'] },
      { id: 'evangelica', label: 'Evangélica',      icon: IcBible,      queries: ['igreja evangélica'] },
      { id: 'espirita',   label: 'Espírita',        icon: IcSparkles,   queries: ['centro espírita'] },
      { id: 'africana',   label: 'Matriz africana', icon: IcDrum,       queries: ['terreiro de candomblé umbanda'] },
    ],
  },
]
