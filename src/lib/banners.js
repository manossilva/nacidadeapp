import { eventWhen } from './time'

/**
 * Banners dinâmicos da Home, alimentados pela agenda (tabela events):
 *  - privado: eventos em destaque (is_featured) de organizadores comuns
 *  - público: eventos de órgãos públicos (prefeitura, governo, secretaria…)
 * Enquanto não houver eventos de um tipo na semana, entram os templates de
 * exemplo abaixo — troque pelo conteúdo real antes de divulgar.
 */
export const PRIVATE_BANNER_EXAMPLES = [
  {
    id: 'exemplo-privado-1',
    title: 'Forró do Cacique — Sexta de Fogo',
    subtitle: 'Forró pé de serra ao vivo, camarote beira-mar e siri mole.',
    meta: 'Sexta · 22h · Cacique Chá, Atalaia',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=900&q=80',
    to: '/eventos',
  },
  {
    id: 'exemplo-privado-2',
    title: 'Sunset Sessions',
    subtitle: 'DJ ao pôr do sol com drinks e petiscos na beira do rio.',
    meta: 'Sábado · 16h · Orla Pôr do Sol',
    image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=900&q=80',
    to: '/eventos',
  },
]

export const PUBLIC_BANNER_EXAMPLES = [
  {
    id: 'exemplo-prefeitura-1',
    title: 'Feira de Artesanato da Orla',
    subtitle: 'Artesanato local, comidas típicas e música ao vivo. Entrada gratuita.',
    meta: 'Sáb e dom · 16h às 22h · Orla de Atalaia',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80',
    to: '/agenda-publica',
  },
  {
    id: 'exemplo-prefeitura-2',
    title: 'Cinema na Praça',
    subtitle: 'Sessões gratuitas ao ar livre para toda a família.',
    meta: 'Quinta · 19h · Praça Fausto Cardoso',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=900&q=80',
    to: '/agenda-publica',
  },
]

const isPublic = e => /prefeitura|governo|secretaria|municipal/i.test(e.organizer_name ?? '')

function eventToBanner(e) {
  return {
    id: e.id,
    title: e.name,
    subtitle: e.short_description,
    meta: [eventWhen(e.starts_at), e.custom_location].filter(Boolean).join(' · '),
    image: e.cover_image_url,
    to: `/evento/${e.slug}`,
  }
}

export function splitBannerEvents(events) {
  const publicos = events.filter(isPublic)
  const privados = events.filter(e => e.is_featured && !isPublic(e))
  return {
    privados: privados.length ? privados.map(eventToBanner) : PRIVATE_BANNER_EXAMPLES,
    publicos: publicos.length ? publicos.map(eventToBanner) : PUBLIC_BANNER_EXAMPLES,
  }
}
