import { useState } from 'react'
import { Link } from 'react-router-dom'
import Avatar from '../ui/Avatar'
import { IcShare, IcMegaphone, IcCalendar, IcPin } from '../ui/Icons'
import { eventWhen } from '../../lib/time'
import { isPublicEvent } from '../../lib/events'

// Post da agenda no formato do Instagram: cabeçalho com avatar, mídia 4:5
// (aviso sem foto vira um quadrado de texto 1:1) e legenda embaixo
export default function EventPost({ event, inProfile = false }) {
  const [imgErr, setImgErr] = useState(false)
  const isPublic = isPublicEvent(event)
  const organizer = event.organizer_name ?? (isPublic ? 'Órgão público' : 'Organizador')
  const when = eventWhen(event.starts_at)
  const hasPhoto = event.cover_image_url && !imgErr

  // Eventos de lojas abrem o perfil da loja; os do banco abrem o detalhe do evento
  const profile = event.store_id && !inProfile ? `/loja/${event.store_id}` : null
  const to = profile ?? (event.slug ? `/evento/${event.slug}` : null)
  const Wrap = to ? Link : 'div'

  async function share() {
    const data = { title: event.name, text: `${event.name} — ${when}`, url: window.location.href }
    try {
      if (navigator.share) await navigator.share(data)
      else await navigator.clipboard?.writeText(`${data.text} ${data.url}`)
    } catch {}
  }

  return (
    <article className="card max-w-[470px] mx-auto">
      <header className="flex items-center gap-2.5 px-3 py-2.5">
        <Avatar name={organizer} className="w-9 h-9" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold leading-tight truncate text-ink-900 dark:text-sand-50">{organizer}</p>
          {event.custom_location && (
            <p className="text-[11px] leading-tight truncate text-ink-400 dark:text-ink-400 mt-0.5">{event.custom_location}</p>
          )}
        </div>
        {event.example && <span className="chip-example">Exemplo</span>}
      </header>

      <Wrap {...(to ? { to } : {})} className="relative block">
        {hasPhoto ? (
          <div className="aspect-[4/5] bg-ink-200 dark:bg-ink-800">
            <img
              src={event.cover_image_url}
              alt={event.name}
              loading="lazy"
              className="w-full h-full object-cover"
              onError={() => setImgErr(true)}
            />
          </div>
        ) : (
          <div className="aspect-square bg-ink-900 flex flex-col justify-end p-6 pt-16">
            <IcMegaphone className="w-10 h-10 text-brand-400 mb-auto" />
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-400">
              {event.kind === 'aviso' || isPublic ? 'Aviso público' : 'Evento'}
            </p>
            <p className="text-2xl font-extrabold leading-tight text-white mt-2">{event.name}</p>
          </div>
        )}
        <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-brand-400 text-ink-900 px-2.5 py-1 text-[11px] font-bold">
          <IcCalendar className="w-3 h-3" />
          {when}
        </span>
      </Wrap>

      <div className="px-3 pt-2.5 pb-3.5">
        <div className="flex items-center gap-2">
          <button
            onClick={share}
            className="w-9 h-9 -ml-1.5 flex items-center justify-center rounded-full ic active:scale-90 transition-transform"
            aria-label="Compartilhar"
          >
            <IcShare className="w-5 h-5" />
          </button>
          {profile && (
            <Link to={profile} className="text-xs font-bold text-ink-700 dark:text-sand-200">
              Ver perfil
            </Link>
          )}
          {event.price_info && (
            <span className="ml-auto rounded-full bg-brand-400/50 dark:bg-brand-400/15 text-ink-800 dark:text-brand-300 px-2.5 py-1 text-[11px] font-semibold">
              {event.price_info}
            </span>
          )}
        </div>

        <p className="text-sm leading-snug mt-1 text-ink-700 dark:text-sand-200">
          <span className="font-bold text-ink-900 dark:text-sand-50">{event.name}</span>
          {event.short_description && ` — ${event.short_description}`}
        </p>
        {event.custom_location && (
          <p className="flex items-center gap-1 text-[11px] text-ink-400 mt-1.5">
            <IcPin className="w-3 h-3 flex-none" />
            <span className="truncate">{event.custom_location}</span>
          </p>
        )}
      </div>
    </article>
  )
}
