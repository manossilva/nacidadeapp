import { eventWhen } from './time'
import { isPublicEvent } from './events'
import { sponsoredStoresToday } from './stores'
import { EXAMPLE_EVENTS } from './examples'

/**
 * Banners dinâmicos da Home:
 *  - privado: lojas cadastradas que pagam pelo anúncio (até 5 por dia, para
 *    todos por enquanto) — o toque leva ao perfil da loja
 *  - público: eventos de órgãos públicos — o toque leva à agenda pública da
 *    cidade, na aba "Onde estou"
 * Enquanto o banco não tem dados reais, entram os exemplos de lib/examples.js.
 */
export const PUBLIC_AGENDA_PATH = '/onde-estou#agenda-publica'

function storeToBanner(store) {
  return {
    id: store.id,
    title: store.adTitle ?? store.name,
    subtitle: store.adText ?? store.bio,
    meta: [store.name, store.categoryLabel].filter(Boolean).join(' · '),
    image: store.photos?.[0] ?? null,
    to: `/loja/${store.id}`,
  }
}

function eventToBanner(e) {
  return {
    id: e.id,
    title: e.name,
    subtitle: e.short_description,
    meta: [eventWhen(e.starts_at), e.custom_location].filter(Boolean).join(' · '),
    image: e.cover_image_url,
    to: PUBLIC_AGENDA_PATH,
  }
}

export function sponsoredBanners(stores) {
  return sponsoredStoresToday(stores).map(storeToBanner)
}

// Só eventos com foto viram banner; avisos de texto ficam na agenda pública
export function publicBanners(events) {
  const real = events.filter(e => isPublicEvent(e) && e.cover_image_url)
  const list = real.length ? real : EXAMPLE_EVENTS.filter(e => isPublicEvent(e) && e.cover_image_url)
  return list.map(eventToBanner)
}
