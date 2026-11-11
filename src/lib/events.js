// Regras da agenda: o que é evento público e em qual período cada evento cai

export const PERIODS = [
  { id: 'hoje',    label: 'Hoje' },
  { id: 'amanha',  label: 'Amanhã' },
  { id: 'semana',  label: 'Esta semana' },
  { id: 'proxima', label: 'Próxima semana' },
]

// Público = marcado como tal ou organizado por órgão público
export function isPublicEvent(e) {
  return Boolean(e.is_public) || /prefeitura|governo|secretaria|municipal/i.test(e.organizer_name ?? '')
}

function startOfDay(offset = 0) {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + offset)
  return d
}

// Semana de segunda a domingo; "esta semana" conta de hoje até domingo
export function inPeriod(e, period) {
  const when = new Date(e.starts_at)
  const daysToMonday = 7 - ((new Date().getDay() + 6) % 7)
  const ranges = {
    hoje:    [startOfDay(0), startOfDay(1)],
    amanha:  [startOfDay(1), startOfDay(2)],
    semana:  [startOfDay(0), startOfDay(daysToMonday)],
    proxima: [startOfDay(daysToMonday), startOfDay(daysToMonday + 7)],
  }
  const [from, to] = ranges[period] ?? ranges.semana
  return when >= from && when < to
}
