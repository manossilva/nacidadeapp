import { useEffect } from 'react'
import { Link, Navigate, useNavigate, useParams, useLocation as useRouterLocation } from 'react-router-dom'
import PageShell from '../components/layout/PageShell'
import PlaceListItem from '../components/cards/PlaceListItem'
import { IcChevronLeft, IcPin, IcSearch } from '../components/ui/Icons'
import { useEvents } from '../hooks/usePlaces'
import { useLocation } from '../hooks/useLocation'
import { useGooglePlaces } from '../hooks/useGooglePlaces'
import { HOME_CATEGORIES } from '../lib/categories'

// Tela interna de uma sessão: sessões menores em cima, todos os locais dela embaixo
function SessaoHeader({ category, cityName, onBack, routerState }) {
  return (
    <header className="sticky top-0 z-40 header-bg screen-enter">
      <div className="max-w-2xl mx-auto px-4">
        <div className="h-14 flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-9 h-9 flex-none flex items-center justify-center rounded-xl glass ic active:scale-90 transition-transform"
            aria-label="Voltar para o início"
          >
            <IcChevronLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h1 className="font-extrabold text-base uppercase tracking-wide leading-tight text-ink-800 dark:text-sand-100">
              {category.label}
            </h1>
            <p className="text-[11px] text-ink-400 dark:text-ink-500 truncate">
              {cityName ? `em ${cityName}` : 'perto de você'}
            </p>
          </div>
        </div>

        {/* Sessões menores — trocar não empilha histórico, o voltar continua indo para o início */}
        <nav aria-label="Sessões" className="grid grid-cols-6 gap-1 pb-3">
          {HOME_CATEGORIES.map(({ id, label, icon: Icon }) => {
            const active = id === category.id
            return (
              <Link
                key={id}
                to={`/sessao/${id}`}
                replace
                state={routerState}
                aria-current={active ? 'page' : undefined}
                className="flex flex-col items-center gap-1 active:scale-95 transition-transform"
              >
                <span className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  active ? 'bubble-current' : 'bubble'
                }`}>
                  <Icon className="w-[1.125rem] h-[1.125rem]" />
                </span>
                <span className={`text-[8px] font-bold uppercase whitespace-nowrap ${
                  active ? 'text-ink-900 dark:text-brand-400 black:text-white' : 'text-ink-400 dark:text-ink-500'
                }`}>
                  {label}
                </span>
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}

export default function Sessao() {
  const { id } = useParams()
  const category = HOME_CATEGORIES.find(c => c.id === id)
  const navigate = useNavigate()
  const routerLocation = useRouterLocation()

  const { position, cityName, radiusKm, loading: geoLoading, requestGPS } = useLocation()
  const { places, loading: placesLoading, error } = useGooglePlaces({
    lat: category ? position?.lat : null,
    lng: category ? position?.lng : null,
    radiusKm,
    type: category?.types,
  })

  // Eventos da semana para a bolinha piscando nos locais
  const { events: weekEvents } = useEvents({ period: 'week', limit: 50 })

  useEffect(() => { window.scrollTo(0, 0) }, [id])

  if (!category) return <Navigate to="/" replace />

  // Veio da Home: volta no histórico. Link direto: vai para a Home sem empilhar
  function goBack() {
    if (routerLocation.state?.fromHome) navigate(-1)
    else navigate('/', { replace: true })
  }

  function hasEventThisWeek(placeName) {
    if (!weekEvents.length || !placeName) return false
    const name = placeName.toLowerCase()
    return weekEvents.some(e =>
      e.custom_location?.toLowerCase().includes(name) ||
      e.name?.toLowerCase().includes(name)
    )
  }

  const loading = placesLoading || (geoLoading && !position)

  return (
    <PageShell
      header={
        <SessaoHeader
          category={category}
          cityName={cityName}
          onBack={goBack}
          routerState={routerLocation.state}
        />
      }
    >
      <div className="pt-4 screen-enter">
        {/* Prompt de localização */}
        {!position && !geoLoading && (
          <div className="glass rounded-2xl p-4 mb-4 flex items-center gap-3">
            <IcPin className="w-5 h-5 ic flex-none" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-ink-700 dark:text-sand-200">Ative a localização</p>
              <p className="text-xs text-ink-400 mt-0.5">Para ver os lugares de {category.label.toLowerCase()} perto de você</p>
            </div>
            <button onClick={requestGPS} className="text-xs font-bold text-ink-700 dark:text-sand-200 whitespace-nowrap">
              Ativar →
            </button>
          </div>
        )}

        {/* Skeleton */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-20 rounded-2xl animate-pulse"
                style={{ background: 'rgba(212,191,160,0.35)' }} />
            ))}
          </div>
        )}

        {/* Lista de todos os locais da sessão */}
        {!loading && position && (
          error ? (
            <p className="py-10 text-center text-sm text-ink-500 dark:text-ink-400">
              Não foi possível carregar os lugares agora. Tente de novo em instantes.
            </p>
          ) : places.length === 0 ? (
            <div className="py-10 text-center">
              <IcSearch className="w-8 h-8 text-ink-300 dark:text-ink-600 mx-auto mb-2" />
              <p className="text-sm text-ink-500 dark:text-ink-400">
                Nenhum lugar de {category.label.toLowerCase()} nesse raio.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-ink-400 dark:text-ink-500">
                {places.length} {places.length === 1 ? 'lugar' : 'lugares'} · abertos primeiro
              </p>
              {places.map(p => (
                <PlaceListItem
                  key={p.id}
                  place={p}
                  hasEvent={hasEventThisWeek(p.displayName?.text)}
                />
              ))}
            </div>
          )
        )}

        <div className="h-6" />
      </div>
    </PageShell>
  )
}
