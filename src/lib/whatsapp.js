/**
 * Gera link de abertura do WhatsApp com mensagem pré-preenchida.
 * @param {string} phone - Número no formato internacional, ex: "+5579999999999"
 * @param {string} message - Mensagem opcional
 */
export function whatsappLink(phone, message = '') {
  const clean = phone.replace(/\D/g, '')
  const encoded = encodeURIComponent(message)
  return `https://wa.me/${clean}${encoded ? `?text=${encoded}` : ''}`
}

/**
 * Gera link de compartilhamento de uma página via WhatsApp.
 * @param {string} title - Título do local/evento
 * @param {string} slug - Slug para montar a URL
 * @param {string} type - 'local' ou 'evento'
 */
export function shareWhatsappLink(title, slug, type = 'local') {
  const url = `${window.location.origin}/${type === 'local' ? 'local' : 'evento'}/${slug}`
  const text = `Olha que incrível! *${title}* em Aracaju 👉 ${url}`
  return `https://wa.me/?text=${encodeURIComponent(text)}`
}

/**
 * Gera URL do Google Maps para rota até o destino.
 * @param {number} lat
 * @param {number} lng
 * @param {string} label - Nome do local
 */
export function googleMapsRouteLink(lat, lng, label = '') {
  const dest = `${lat},${lng}`
  const q = label ? encodeURIComponent(label) : dest
  return `https://www.google.com/maps/dir/?api=1&destination=${dest}&destination_place_id=&travelmode=driving`
}
