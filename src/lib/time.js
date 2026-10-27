/**
 * Retorna tempo relativo até uma data futura.
 * "Em andamento" / "Em 3 dias" / "Em 2h 30min" / "Em 45min"
 */
export function timeFromNow(isoString) {
  const diff = new Date(isoString) - Date.now()
  if (diff < 0) return 'Em andamento'
  const h = Math.floor(diff / 3_600_000)
  const m = Math.floor((diff % 3_600_000) / 60_000)
  if (h > 24) {
    const days = Math.floor(h / 24)
    return `Em ${days} dia${days > 1 ? 's' : ''}`
  }
  if (h > 0) return `Em ${h}h${m > 0 ? ` ${m}min` : ''}`
  return `Em ${m}min`
}

/**
 * Retorna tempo relativo desde uma data passada.
 * "agora" / "5min atrás" / "2h atrás" / "3d atrás"
 */
export function timeAgo(isoString) {
  const diff = Date.now() - new Date(isoString)
  const m = Math.floor(diff / 60_000)
  if (m < 1) return 'agora'
  if (m < 60) return `${m}min atrás`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h atrás`
  return `${Math.floor(h / 24)}d atrás`
}

/**
 * Data de hoje no formato curto do header.
 * "Terça, 27 out"
 */
export function todayLabel(date = new Date()) {
  const weekday = date.toLocaleDateString('pt-BR', { weekday: 'long' }).replace('-feira', '')
  const month = date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')
  return `${weekday.charAt(0).toUpperCase()}${weekday.slice(1)}, ${date.getDate()} ${month}`
}

/**
 * Quando um evento acontece, para banners.
 * "Hoje · 22h" / "Amanhã · 19h30" / "Sex, 31 out · 22h"
 */
export function eventWhen(isoString) {
  const d = new Date(isoString)
  const now = new Date()
  const dayDiff = Math.round(
    (new Date(d.getFullYear(), d.getMonth(), d.getDate()) - new Date(now.getFullYear(), now.getMonth(), now.getDate())) / 86_400_000
  )
  const hour = `${d.getHours()}h${d.getMinutes() ? String(d.getMinutes()).padStart(2, '0') : ''}`
  if (dayDiff === 0) return `Hoje · ${hour}`
  if (dayDiff === 1) return `Amanhã · ${hour}`
  const weekday = d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')
  const month = d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')
  return `${weekday.charAt(0).toUpperCase()}${weekday.slice(1)}, ${d.getDate()} ${month} · ${hour}`
}
