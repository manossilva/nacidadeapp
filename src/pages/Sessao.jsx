import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useParams, useLocation as useRouterLocation } from 'react-router-dom'
import PageShell from '../components/layout/PageShell'
import PlaceListItem from '../components/cards/PlaceListItem'
import Segmented from '../components/ui/Segmented'
import { IcChevronLeft, IcPin, IcSearch } from '../components/ui/Icons'
import { useEvents } from '../hooks/usePlaces'
import { useLocation } from '../hooks/useLocation'
import { useGooglePlaces } from '../hooks/useGooglePlaces'
import { HOME_CATEGORIES } from '../lib/categories'
import { hasCoverToday } from '../lib/cover'

const RADIUS_SHORTCUTS = [1, 5, 10].map(km => ({ id: km, label: `${km} km` }))
const MAX_RADIUS_KM = 100

const normalize = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

// Distância da busca: atalhos de 1, 5 e 10 km ou arrastar até 100 km.
// A consulta só é refeita ao soltar a barra, não a cada passo do arraste.
function RadiusPanel({ value, onChange, cityName }) {
  const [draft, setDraft] = useState(value)
  const latest = useRef(value)
  const timer = useRef(null)
  useEffect(() => { setDraft(value); latest.current = value }, [value])
  useEffect(() => () => clearTimeout(timer.current), [])

  const commit = () => {
    clearTimeout(timer.current)
    if (latest.current !== value) onChange(latest.current)
  }
  // Pelo teclado cada tecla solta é um passo: espera parar para buscar uma vez só
  const commitSoon = () => {
    clearTimeout(timer.current)
    timer.current = setTimeout(commit, 400)
  }

  return (
    <div className="reveal-body pt-3 pb-1">
      <div className="flex items-center gap-3">
        <Segmented options={RADIUS_SHORTCUTS} value={value} onChange={onChange} ariaLabel="Atalhos de distância" />
        <p className="ml-auto text-sm font-extrabold tabular-nums text-ink-900 dark:text-sand-50">
          <span className="text-xs font-semibold text-ink-400">até</span> {draft} km
        </p>
      </div>
      <input
        type="range"
        min={1}
        max={MAX_RADIUS_KM}
        step={1}
        value={draft}
        onChange={e => { latest.current = Number(e.target.value); setDraft(latest.current) }}
        onPointerUp={commit}
        onTouchEnd={commit}
        onKeyUp={commitSoon}
        onBlur={commit}
        aria-label="Distância da busca em quilômetros"
        className="range mt-2"
        style={{ '--ratio': (draft - 1) / (MAX_RADIUS_KM - 1) }}
      />
      {cityName && (
        <p className="text-[11px] text-ink-400">Aparecem só lugares de {cityName}.</p>
      )}
    </div>
  )
}

// Uma fileira só: o símbolo de localização (abre a barra de distância) e os
// símbolos dos subgrupos. O subgrupo escolhido se estica e mostra o nome.
function FilterBar({ category, subId, onSub, radiusKm, onRadius, cityName, canSearch }) {
  const [open, setOpen] = useState(false)
  const iconSize = 'w-[1.125rem] h-[1.125rem] flex-none'

  function pick(e, id) {
    onSub(subId === id ? null : id)
    const chip = e.currentTarget
    // Espera o nome começar a abrir para centralizar o símbolo na fileira
    setTimeout(() => chip.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' }), 120)
  }

  return (
    <div className="pb-2.5">
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none -mx-4 px-4 py-0.5">
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          disabled={!canSearch}
          aria-expanded={open}
          aria-controls="distancia"
          aria-label={`Distância: até ${radiusKm} km. Toque para mudar`}
          className="chip tap disabled:opacity-40"
        >
          <IcPin className={iconSize} />
          <span className="ml-1.5 text-xs font-bold whitespace-nowrap tabular-nums">{radiusKm} km</span>
        </button>

        {category.subgroups.length > 0 && <span aria-hidden="true" className="flex-none w-px h-5 bg-ink-900/10 dark:bg-white/10" />}

        {category.subgroups.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={e => pick(e, id)}
            aria-pressed={subId === id}
            aria-label={label}
            title={label}
            className="chip tap"
          >
            <Icon className={iconSize} />
            <span className="chip-label"><span>{label}</span></span>
          </button>
        ))}
      </div>

      <div id="distancia" className={`reveal ${open ? 'is-open' : ''}`} inert={open ? undefined : ''}>
        <div>
          <RadiusPanel value={radiusKm} onChange={onRadius} cityName={cityName} />
        </div>
      </div>
    </div>
  )
}

// Tela interna de uma sessão: sessões menores em cima, filtros e os locais embaixo
function SessaoHeader({ category, cityName, onBack, routerState, children }) {
  return (
    <header className="sticky top-0 z-40 header-bg screen-enter">
      <div className="max-w-2xl mx-auto px-4">
        <div className="h-14 flex items-center gap-3">
          <button
            onClick={onBack}
            className="tap w-9 h-9 flex-none flex items-center justify-center rounded-xl glass ic"
            aria-label="Voltar para o início"
          >
            <IcChevronLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h1 key={category.id} className="swap-in font-extrabold text-base uppercase tracking-wide leading-tight text-ink-800 dark:text-sand-100">
              {category.label}
            </h1>
            <p className="text-[11px] text-ink-400 dark:text-ink-500 truncate">
              {cityName ? `em ${cityName}` : 'perto de você'}
            </p>
          </div>
        </div>

        {/* Sessões menores — trocar não empilha histórico, o voltar continua indo para o início */}
        <nav aria-label="Sessões" className="grid grid-cols-6 gap-1 pb-2.5">
          {HOME_CATEGORIES.map(({ id, label, icon: Icon }) => {
            const active = id === category.id
            return (
              <Link
                key={id}
                to={`/sessao/${id}`}
                replace
                state={routerState}
                aria-current={active ? 'page' : undefined}
                className="tap flex flex-col items-center gap-1"
              >
                <span className={`w-10 h-10 rounded-full flex items-center justify-center ${active ? 'bubble-current' : 'bubble'}`}>
                  <Icon className="w-[1.125rem] h-[1.125rem]" />
                </span>
                <span className={`text-[8px] font-bold uppercase whitespace-nowrap transition-colors ${
                  active ? 'text-ink-900 dark:text-brand-400 black:text-white' : 'text-ink-400 dark:text-ink-500'
                }`}>
                  {label}
                </span>
              </Link>
            )
          })}
        </nav>

        {children}
      </div>
    </header>
  )
}

export default function Sessao() {
  const { id } = useParams()
  const category = HOME_CATEGORIES.find(c => c.id === id)
  const navigate = useNavigate()
  const routerLocation = useRouterLocation()

  // O subgrupo vale só para a sessão em que foi escolhido
  const [picked, setPicked] = useState({ session: id, sub: null })
  const sub = picked.session === id ? category?.subgroups.find(s => s.id === picked.sub) ?? null : null

  const { position, cityName, radiusKm, setRadius, loading: geoLoading, requestGPS } = useLocation()
  const { places: found, loading: placesLoading, error } = useGooglePlaces({
    lat: category ? position?.lat : null,
    lng: category ? position?.lng : null,
    radiusKm,
    type: sub ? sub.types ?? null : category?.types,
    queries: sub?.queries ?? null,
  })

  // Distância maior que a cidade não traz lugares de fora: fica só quem tem a cidade no endereço
  const places = useMemo(() => {
    if (!cityName) return found
    const city = normalize(cityName)
    return found.filter(p => !p.formattedAddress || normalize(p.formattedAddress).includes(city))
  }, [found, cityName])

  // Eventos da semana: bolinha piscando nos locais e a tarja de cover dos bares
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
        >
          <FilterBar
            category={category}
            subId={sub?.id ?? null}
            onSub={subId => setPicked({ session: id, sub: subId })}
            radiusKm={radiusKm}
            onRadius={setRadius}
            cityName={cityName}
            canSearch={Boolean(position)}
          />
        </SessaoHeader>
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
            <button onClick={requestGPS} className="tap text-xs font-bold text-ink-700 dark:text-sand-200 whitespace-nowrap">
              Ativar →
            </button>
          </div>
        )}

        {/* Skeleton */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-20 rounded-2xl animate-pulse bg-sand-300/60 dark:bg-ink-800" />
            ))}
          </div>
        )}

        {/* Lista dos locais — a chave refaz a entrada em cascata a cada filtro */}
        {!loading && position && (
          error ? (
            <p className="py-10 text-center text-sm text-ink-500 dark:text-ink-400">
              Não foi possível carregar os lugares agora. Tente de novo em instantes.
            </p>
          ) : places.length === 0 ? (
            <div className="rise py-10 text-center">
              <IcSearch className="w-8 h-8 text-ink-300 dark:text-ink-600 mx-auto mb-2" />
              <p className="text-sm text-ink-500 dark:text-ink-400">
                Nenhum lugar encontrado em até {radiusKm} km{cityName ? ` em ${cityName}` : ''}.
              </p>
              {radiusKm < MAX_RADIUS_KM && (
                <p className="text-xs text-ink-400 mt-1">Toque na distância, lá em cima, para aumentar a busca.</p>
              )}
            </div>
          ) : (
            <div key={`${id}:${sub?.id}:${radiusKm}`} className="space-y-3">
              <p className="rise text-[11px] font-semibold uppercase tracking-widest text-ink-400 dark:text-ink-500">
                {sub && <span className="text-ink-700 dark:text-sand-200">{sub.label} · </span>}
                {places.length} {places.length === 1 ? 'lugar' : 'lugares'}{!sub && ' · abertos primeiro'}
              </p>
              {places.map((p, i) => (
                <PlaceListItem
                  key={p.id}
                  place={p}
                  index={i + 1}
                  hasEvent={hasEventThisWeek(p.displayName?.text)}
                  cover={category.id === 'bares' ? hasCoverToday(p.id, weekEvents) : undefined}
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
