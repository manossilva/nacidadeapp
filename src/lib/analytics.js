import { supabase } from './supabase'

/**
 * Registra uma interação (view, whatsapp_click, share, maps_click).
 * Fire-and-forget — não bloqueia a UI.
 */
export async function trackInteraction({ placeId, eventId, type }) {
  try {
    await supabase.from('interactions').insert({
      place_id: placeId ?? null,
      event_id: eventId ?? null,
      interaction_type: type,
      user_agent: navigator.userAgent,
      referrer: document.referrer || null,
    })
  } catch (_) {
    // silencia erros de analytics para não impactar o usuário
  }
}
