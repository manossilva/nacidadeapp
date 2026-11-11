import { useEffect, useState } from 'react'
import { useNavigate, useParams, useLocation as useRouterLocation } from 'react-router-dom'
import PageShell from '../components/layout/PageShell'
import Avatar from '../components/ui/Avatar'
import EventPost from '../components/cards/EventPost'
import { IcChevronLeft, IcPin, IcPhone, IcChat, IcMap, IcGlobe, IcClock, IcStar } from '../components/ui/Icons'
import { getPlace } from '../lib/googlePlaces'
import { findExampleStore, storeFromPlace } from '../lib/stores'
import { EXAMPLE_EVENTS } from '../lib/examples'

// Perfil da loja no formato do Instagram: avatar, números, bio, botões de
// contato, horário e grade de fotos. Serve para lojas de exemplo e para
// qualquer negócio do Google (o perfil padrão de todo lojista).
function Stat({ value, label }) {
  return (
    <div className="flex-1 text-center">
      <p className="text-base font-extrabold leading-tight text-ink-900 dark:text-sand-50">{value}</p>
      <p className="text-[11px] text-ink-500 dark:text-ink-400">{label}</p>
    </div>
  )
}

function ActionButton({ icon: Icon, label, href, primary = false, disabled = false }) {
  const className = `flex-1 min-w-0 h-9 px-2 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold active:scale-95 transition-transform ${
    primary ? 'bg-brand-400 text-ink-900' : 'glass text-ink-800 dark:text-sand-100'
  }`
  const content = <><Icon className="w-4 h-4 flex-none" /><span className="truncate">{label}</span></>
  // Perfis de exemplo têm contatos fictícios: o botão aparece, mas não disca nem abre nada
  if (disabled || !href) return <button type="button" aria-disabled="true" className={className}>{content}</button>
  return <a href={href} target="_blank" rel="noopener noreferrer" className={className}>{content}</a>
}

function Hours({ hours }) {
  const today = (new Date().getDay() + 6) % 7
  return (
    <section className="glass rounded-2xl px-4 py-3 mt-4">
      <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-ink-400 mb-2">
        <IcClock className="w-3.5 h-3.5" /> Horário de atendimento
      </p>
      <ul className="text-sm">
        {hours.map((line, i) => {
          const [day, ...rest] = line.split(': ')
          return (
            <li
              key={i}
              className={`flex justify-between gap-3 py-1 ${
                i === today ? 'font-bold text-ink-900 dark:text-sand-50' : 'text-ink-600 dark:text-ink-300'
              }`}
            >
              <span>{day.charAt(0).toUpperCase() + day.slice(1)}</span>
              <span className="text-right">{rest.join(': ')}</span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function StoreHeader({ title, onBack, example }) {
  return (
    <header className="sticky top-0 z-40 header-bg screen-enter">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-9 h-9 flex-none flex items-center justify-center rounded-xl glass ic active:scale-90 transition-transform"
          aria-label="Voltar"
        >
          <IcChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="flex-1 min-w-0 truncate font-extrabold text-base text-ink-900 dark:text-sand-50">{title}</h1>
        {example && <span className="chip-example">Exemplo</span>}
      </div>
    </header>
  )
}

export default function Loja() {
  const { id } = useParams()
  const navigate = useNavigate()
  const routerLocation = useRouterLocation()
  const example = findExampleStore(id)

  // Vindo da lista, o local já chega pelo estado da rota; por link direto, busca no Google
  const [place, setPlace] = useState(routerLocation.state?.place ?? null)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (example || place) return
    let cancelled = false
    getPlace(id).then(p => { if (!cancelled) setPlace(p) }).catch(() => { if (!cancelled) setError(true) })
    return () => { cancelled = true }
  }, [id, example, place])

  useEffect(() => { window.scrollTo(0, 0) }, [id])

  function goBack() {
    if (routerLocation.key !== 'default') navigate(-1)
    else navigate('/', { replace: true })
  }

  const store = example ?? (place ? storeFromPlace(place) : null)
  const header = <StoreHeader title={store?.name ?? 'Loja'} onBack={goBack} example={store?.example} />

  if (!store) {
    return (
      <PageShell header={header}>
        {error ? (
          <p className="py-16 text-center text-sm text-ink-500 dark:text-ink-400">
            Não foi possível abrir este perfil agora. Tente de novo em instantes.
          </p>
        ) : (
          <div className="pt-6 space-y-4">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-full animate-pulse bg-sand-300/60 dark:bg-ink-800" />
              <div className="flex-1 h-10 rounded-xl animate-pulse bg-sand-300/60 dark:bg-ink-800" />
            </div>
            <div className="h-24 rounded-2xl animate-pulse bg-sand-300/60 dark:bg-ink-800" />
            <div className="aspect-[4/5] rounded-2xl animate-pulse bg-sand-300/60 dark:bg-ink-800" />
          </div>
        )}
      </PageShell>
    )
  }

  const events = EXAMPLE_EVENTS.filter(e => e.store_id === store.id)
  const phoneDigits = store.phone?.replace(/\D/g, '')
  const openLabel = store.openNow === undefined ? null : store.openNow ? 'Aberto' : 'Fechado'

  return (
    <PageShell header={header}>
      <div className="pt-5 screen-enter">
        {/* Avatar + números */}
        <div className="flex items-center gap-4">
          <Avatar name={store.name} src={store.logo} className="w-20 h-20" />
          <div className="flex-1 flex">
            <Stat value={store.photos.length} label={store.photos.length === 1 ? 'foto' : 'fotos'} />
            <Stat value={events.length} label="na agenda" />
            {store.rating ? (
              <Stat
                value={<span className="inline-flex items-center gap-1"><IcStar className="w-3.5 h-3.5 text-brand-500" filled />{store.rating.toFixed(1).replace('.', ',')}</span>}
                label={`${store.ratingCount ?? 0} avaliações`}
              />
            ) : openLabel && (
              <Stat value={openLabel} label="agora" />
            )}
          </div>
        </div>

        {/* Nome, categoria, bio */}
        <div className="mt-3">
          <p className="font-bold text-sm text-ink-900 dark:text-sand-50">{store.name}</p>
          <p className="text-xs text-ink-500 dark:text-ink-400 capitalize">
            {[store.categoryLabel, store.rating ? openLabel : null].filter(Boolean).join(' · ')}
          </p>
          {store.bio && <p className="text-sm text-ink-700 dark:text-sand-200 mt-1.5 leading-snug">{store.bio}</p>}
          {store.address && (
            <p className="flex items-start gap-1.5 text-xs text-ink-500 dark:text-ink-400 mt-1.5">
              <IcPin className="w-3.5 h-3.5 flex-none mt-px" />
              {store.address}
            </p>
          )}
        </div>

        {/* Contato */}
        <div className="flex gap-2 mt-4">
          {store.whatsapp && (
            <ActionButton icon={IcChat} label="WhatsApp" href={`https://wa.me/${store.whatsapp}`} primary disabled={store.example} />
          )}
          {phoneDigits && (
            <ActionButton icon={IcPhone} label="Ligar" href={`tel:${phoneDigits}`} primary={!store.whatsapp} disabled={store.example} />
          )}
          {(store.mapsUrl || store.example) && (
            <ActionButton icon={IcMap} label="Rota" href={store.mapsUrl} disabled={store.example} />
          )}
          {store.website && <ActionButton icon={IcGlobe} label="Site" href={store.website} />}
        </div>
        {store.phone && (
          <p className="text-xs text-ink-500 dark:text-ink-400 mt-2">
            Contato: <span className="font-semibold text-ink-700 dark:text-sand-200">{store.phone}</span>
            {store.example && ' (fictício)'}
          </p>
        )}

        {store.hours?.length > 0 && <Hours hours={store.hours} />}

        {/* Grade de fotos */}
        {store.photos.length > 0 && (
          <div className={`grid gap-1 mt-4 ${store.photos.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {store.photos.map(src => (
              <div key={src} className="aspect-[4/5] rounded-xl overflow-hidden bg-ink-200 dark:bg-ink-800">
                <img src={src} alt={`Foto de ${store.name}`} loading="lazy" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}

        {/* Eventos da loja na agenda */}
        {events.length > 0 && (
          <section className="mt-6">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-ink-400 mb-3">Na agenda</p>
            <div className="space-y-4">
              {events.map(e => <EventPost key={e.id} event={e} inProfile />)}
            </div>
          </section>
        )}

        <div className="h-6" />
      </div>
    </PageShell>
  )
}
