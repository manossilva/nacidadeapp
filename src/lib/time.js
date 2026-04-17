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
