import { useState } from 'react'
import PageShell from '../components/layout/PageShell'
import PlaceCard from '../components/cards/PlaceCard'
import Empty from '../components/ui/Empty'
import { usePlaces } from '../hooks/usePlaces'
import { useCity } from '../hooks/useCity'
import { IcMap, IcPin, IcStar, IcGlobe } from '../components/ui/Icons'
import { USE_MOCK, MOCK_PLACES } from '../lib/mockData'
import { USE_MOCK as USE_MOCK_FLAG } from '../lib/config'

const CATS = [
  { id: 'todos',      label: 'Tudo',      Icon: IcStar },
  { id: 'praia',      label: 'Praias',    Icon: IcGlobe },
  { id: 'cultura',    label: 'Cultura',   Icon: IcMap },
  { id: 'passeio',    label: 'Passeios',  Icon: IcPin },
  { id: 'hospedagem', label: 'Hotéis',    Icon: IcStar },
]

export default function Tourism() {
  const [cat, setCat] = useState('todos')
  const { city } = useCity()

  const { places: supaPlaces, loading } = usePlaces({
    category: cat === 'todos' ? undefined : cat,
    limit: 30,
    enabled: !USE_MOCK_FLAG,
  })

  const mockFiltered = USE_MOCK_FLAG
    ? (cat === 'todos' ? MOCK_PLACES : MOCK_PLACES.filter(p => p.category === cat))
    : supaPlaces

  const places = USE_MOCK_FLAG ? mockFiltered : supaPlaces

  return (
    <PageShell>
      <div className="pt-5 pb-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-ink-400 mb-1">Turismo</p>
        <h1 className="text-2xl font-bold text-ink-800 dark:text-sand-100">
          {city ? `O melhor de ${city}` : 'Descubra a cidade'}
        </h1>
        <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">Praias, cultura, passeios e mais</p>
      </div>

      {/* Filtro de categoria */}
      <div className="flex gap-2 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-none mb-4">
        {CATS.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setCat(id)}
            className={`flex-none flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all active:scale-95 ${
              cat === id ? 'pill-active' : 'pill'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Grid de lugares */}
      {loading ? (
        <div className="grid grid-cols-2 gap-3">
          {[1,2,3,4].map(i => (
            <div key={i} className="aspect-[4/3] rounded-2xl animate-pulse" style={{ background: 'rgba(212,191,160,0.35)' }} />
          ))}
        </div>
      ) : places.length === 0 ? (
        <Empty text="Nenhum local encontrado nessa categoria." py="py-10" />
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {places.map(p => <PlaceCard key={p.id} place={p} />)}
        </div>
      )}

      {/* Roteiros */}
      <div className="mt-8 mb-2">
        <h2 className="font-bold text-base text-ink-800 dark:text-sand-100 mb-3">Roteiros sugeridos</h2>
        <a href="/roteiros" className="block glass rounded-2xl p-4 active:scale-[0.98] transition-transform mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-ink-800/10 dark:bg-white/10 flex items-center justify-center">
              <IcMap className="w-5 h-5 text-ink-700 dark:text-sand-200" />
            </div>
            <div>
              <p className="font-semibold text-sm text-ink-800 dark:text-sand-100">Ver roteiros de turismo</p>
              <p className="text-xs text-ink-500 dark:text-ink-400 mt-0.5">Itinerários prontos para explorar</p>
            </div>
          </div>
        </a>
      </div>

      <div className="h-6" />
    </PageShell>
  )
}
