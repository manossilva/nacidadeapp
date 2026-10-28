import { useEffect, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import PageShell from '../components/layout/PageShell'
import BannerCarousel from '../components/cards/BannerCarousel'
import { useEvents } from '../hooks/usePlaces'
import { useLocation } from '../hooks/useLocation'
import { HOME_CATEGORIES } from '../lib/categories'
import { splitBannerEvents } from '../lib/banners'

// O GPS atualiza uma vez por abertura do app — voltar pelo "Início" não pede de novo
let autoLocated = false

function SessionGrid() {
  return (
    <nav aria-label="Sessões" className="grid grid-cols-3 gap-x-3 gap-y-[clamp(0.5rem,1.6dvh,1rem)]">
      {HOME_CATEGORIES.map(({ id, label, icon: Icon }) => (
        <Link
          key={id}
          to={`/sessao/${id}`}
          state={{ fromHome: true }}
          className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform"
        >
          <span className="w-[clamp(3.25rem,8.5dvh,4.75rem)] aspect-square rounded-full bubble flex items-center justify-center">
            <Icon className="w-[42%] h-[42%]" />
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-700 dark:text-ink-200 black:text-white">
            {label}
          </span>
        </Link>
      ))}
    </nav>
  )
}

export default function Home() {
  const { cityName, loading: geoLoading, requestGPS } = useLocation()

  // Atualiza sozinho a cidade com base em onde a pessoa está
  useEffect(() => {
    if (autoLocated) return
    autoLocated = true
    const perm = navigator.permissions?.query({ name: 'geolocation' }) ?? Promise.resolve(null)
    perm.then(s => { if (s?.state !== 'denied') requestGPS() }).catch(() => requestGPS())
  }, [requestGPS])

  // A cidade só anima quando muda com a tela aberta, não a cada visita
  const initialCity = useRef(cityName)
  const cityChanged = cityName !== initialCity.current

  // Agenda da semana → banner de evento privado e banner de eventos públicos
  const { events } = useEvents({ period: 'week', limit: 30 })
  const { privados, publicos } = useMemo(() => splitBannerEvents(events), [events])

  // Título sempre em uma linha: a fonte encolhe para nomes de cidade longos
  const titleChars = (cityName ? `O que rola em ${cityName} hoje?` : 'O que rola por aqui hoje?').length
  const titleSize = `clamp(1rem, calc((min(100vw, 42rem) - 2rem) / ${(titleChars * 0.56).toFixed(1)}), 1.75rem)`

  return (
    <PageShell fit>
      <div className="flex-1 min-h-0 flex flex-col gap-[clamp(0.625rem,1.8dvh,1rem)] pt-[clamp(0.75rem,2dvh,1.25rem)] pb-3">
        {/* Título — a cidade vem da localização e troca sozinha */}
        <h1
          className="flex items-center gap-[0.25em] whitespace-nowrap font-bold tracking-tight leading-tight text-ink-800 dark:text-sand-100"
          style={{ fontSize: titleSize }}
        >
          <span className="flex-none">{cityName ? 'O que rola em' : 'O que rola'}</span>
          {cityName ? (
            <span
              key={cityName}
              className={`min-w-0 truncate accent-text ${cityChanged ? 'city-swap' : ''}`}
            >
              {cityName}
            </span>
          ) : (
            <button
              onClick={requestGPS}
              className={`accent-text ${geoLoading ? 'animate-pulse' : ''}`}
              aria-label="Usar minha localização"
            >
              por aqui
            </button>
          )}
          <span className="flex-none">hoje?</span>
        </h1>

        <BannerCarousel items={privados} variant="privado" className="flex-1 min-h-[7rem]" />

        <SessionGrid />

        <BannerCarousel items={publicos} variant="publico" interval={6500} className="flex-1 min-h-[7rem]" />
      </div>
    </PageShell>
  )
}
