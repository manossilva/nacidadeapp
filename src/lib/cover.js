import { inPeriod } from './events'

/**
 * Cover artístico dos bares. Um bar tem cover hoje quando cadastrou na agenda
 * um evento de hoje marcado com cover (`has_cover`). Sem cadastro — caso de
 * todo bar que vem só do Google — vale "sem cover artístico hoje".
 */
export const BAR_TYPES = ['bar', 'night_club', 'pub', 'wine_bar', 'bar_and_grill']

export function isBar({ category, types } = {}) {
  return category === 'bares' || Boolean(types?.some(t => BAR_TYPES.includes(t)))
}

export function hasCoverToday(storeId, events) {
  return events.some(e => e.has_cover && e.store_id === storeId && inPeriod(e, 'hoje'))
}
