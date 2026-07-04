import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageShell from '../components/layout/PageShell'
import GooglePlaceCard from '../components/cards/GooglePlaceCard'
import { useLocation } from '../hooks/useLocation'
import { useGooglePlaces } from '../hooks/useGooglePlaces'
import { IcRoute, IcSearch, IcPin, IcMap } from '../components/ui/Icons'

const SECTIONS = [
  { id: 'tourist_attraction', label: 'Atrações',    emoji: '🏛️' },
  { id: 'restaurant',         label: 'Restaurantes', emoji: '🍽️' },
  { id: 'museum',             label: 'Museus',       emoji: '🎭' },
  { id: 'lodging',            label: 'Hospedagem',   emoji: '🏨' },
  { id: 'park',               label: 'Parques',      emoji: '🌿' },
]

const TIPS = [
  { icon: '🌡️', title: 'Clima', desc: 'Verifique a previsão do tempo antes de sair. Leve protetor solar em destinos litorâneos.' },
  { icon: '🚌', title: 'Transporte', desc: 'Uber e apps de táxi costumam estar disponíveis na maioria das cidades brasileiras.' },
  { icon: '💧', title: 'Hidratação', desc: 'Mantenha-se hidratado, especialmente em cidades de clima quente e ensolarado.' },
  { icon: '📱', title: 'Conectividade', desc: 'Baixe mapas offline antes de viajar para áreas com cobertura de rede irregular.' },
  { icon: '💳', title: 'Pagamento', desc: 'Leve espécie para feiras e estabelecimentos menores. Cartão aceito nos principais pontos.' },
  { icon: '🏥', title: 'Saúde', desc: 'Anote o endereço da UPA ou hospital mais próximo assim que chegar em uma nova cidade.' },
]

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="aspect-[3/4] rounded-2xl animate-pulse"
          style={{ background: 'rgba(212,191,160,0.35)' }} />
      ))}
    </div>
  )
}

export default function Tourism() {
  const {
    position, cityName, radiusKm,
    loading: locLoading,
    requestGPS,
  } = useLocation()

  const [section, setSection] = useState('tourist_attraction')

  const { places, loading, error, noKey } = useGooglePlaces({
    lat: position?.lat,
    lng: position?.lng,
    radiusKm,
    type: section,
  })

  return (
    <PageShell>
      {/* Hero */}
      <div
        className="-mx-4 px-6 pt-8 pb-6 mb-6"
        style={{ background: 'linear-gradient(160deg, #1a3a2a 0%, #2e4226 50%, #1a2e1a 100%)' }}
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-sand-400 mb-2">Guia de turismo</p>
        <h1 className="text-2xl font-bold text-sand-50 leading-tight">
          {cityName ? `O melhor de ${cityName}` : 'Explore a cidade'}
        </h1>
        <p className="text-sm mt-2" style={{ color: 'rgba(245,240,232,0.7)' }}>
          {cityName
            ? `Locais imperdíveis num raio de ${radiusKm} km`
            : 'Ative o GPS ou busque uma cidade para descobrir pontos turísticos.'}
        </p>
        <Link
          to="/roteiros"
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-semibold active:scale-[0.97] transition-transform"
          style={{
            background: 'rgba(245,240,232,0.15)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(245,240,232,0.2)',
            color: 'rgba(245,240,232,0.9)',
          }}
        >
          <IcRoute className="w-4 h-4" />
          Ver roteiros prontos
        </Link>
      </div>

      {/* No location — prompt */}
      {!position && (
        <div className="glass rounded-2xl p-5 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-ink-800/10 dark:bg-white/10 flex items-center justify-center flex-none">
              <IcPin className="w-5 h-5 text-ink-600 dark:text-sand-300" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm text-ink-800 dark:text-sand-100 mb-0.5">Sem localização definida</p>
              <p className="text-xs text-ink-500 dark:text-ink-400 leading-relaxed">
                Ative o GPS ou vá em <strong>Perto de mim</strong> e busque uma cidade para ver os pontos turísticos.
              </p>
            </div>
          </div>
          <div className="flex gap-2 mt-4 flex-wrap">
            <button
              onClick={requestGPS}
              disabled={locLoading}
              className="btn-primary flex-1 min-w-[140px]"
            >
              <IcMap className="w-4 h-4" />
              {locLoading ? 'Buscando...' : 'Usar GPS'}
            </button>
            <Link to="/onde-estou" className="btn-secondary flex-1 min-w-[140px] text-center">
              Buscar cidade
            </Link>
          </div>
        </div>
      )}

      {/* API key not set */}
      {noKey && position && (
        <div className="glass rounded-2xl p-4 mb-4">
          <p className="font-semibold text-sm text-ink-700 dark:text-sand-200">Google Maps não configurado</p>
          <p className="text-xs text-ink-500 dark:text-ink-400 mt-1">
            Adicione <code className="bg-ink-100/50 px-1 rounded">VITE_GOOGLE_MAPS_KEY</code> no painel da Vercel para ver pontos turísticos reais.
          </p>
        </div>
      )}

      {/* Section tabs */}
      {position && (
        <>
          <div className="flex gap-2 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-none mb-5">
            {SECTIONS.map(({ id, label, emoji }) => (
              <button
                key={id}
                onClick={() => setSection(id)}
                className={`flex-none flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all active:scale-95 ${
                  section === id ? 'pill-active' : 'pill'
                }`}
              >
                <span>{emoji}</span>
                {label}
              </button>
            ))}
          </div>

          {/* Loading */}
          {loading && <SkeletonGrid />}

          {/* Results */}
          {!loading && !noKey && (
            error ? (
              <div className="glass rounded-2xl p-4 text-center">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            ) : places.length === 0 ? (
              <div className="py-12 text-center">
                <IcSearch className="w-10 h-10 text-ink-300 dark:text-ink-600 mx-auto mb-3" />
                <p className="text-ink-600 dark:text-sand-300 font-medium">Nenhum local encontrado</p>
                <p className="text-sm text-ink-400 mt-1">
                  Tente outra categoria ou aumente o raio em{' '}
                  <Link to="/onde-estou" className="underline">Perto de mim</Link>
                </p>
              </div>
            ) : (
              <>
                <p className="text-xs text-ink-400 dark:text-ink-500 mb-3">
                  {places.length} local{places.length !== 1 ? 'is' : ''} encontrado{places.length !== 1 ? 's' : ''}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {places.map(p => <GooglePlaceCard key={p.id} place={p} />)}
                </div>
              </>
            )
          )}
        </>
      )}

      {/* Dicas genéricas de viagem */}
      <section className="mt-8">
        <h2 className="font-bold text-base text-ink-800 dark:text-sand-100 mb-3">Dicas de viagem</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TIPS.map(tip => (
            <div key={tip.title} className="card p-4">
              <div className="flex items-start gap-3">
                <span className="text-xl flex-none w-8 text-center">{tip.icon}</span>
                <div>
                  <h3 className="font-bold text-sm text-ink-800 dark:text-sand-100">{tip.title}</h3>
                  <p className="text-xs text-ink-500 dark:text-ink-400 mt-0.5 leading-relaxed">{tip.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Roteiros */}
      <div className="mt-8 mb-2">
        <Link
          to="/roteiros"
          className="flex items-center gap-3 glass rounded-2xl p-4 active:scale-[0.98] transition-transform"
        >
          <div className="w-10 h-10 rounded-xl bg-ink-800/10 dark:bg-white/10 flex items-center justify-center flex-none">
            <IcRoute className="w-5 h-5 text-ink-700 dark:text-sand-200" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm text-ink-800 dark:text-sand-100">Roteiros de turismo</p>
            <p className="text-xs text-ink-500 dark:text-ink-400 mt-0.5">Itinerários prontos: 1 dia, praias, cultura</p>
          </div>
          <span className="text-ink-400 dark:text-ink-600">→</span>
        </Link>
      </div>

      <div className="h-6" />
    </PageShell>
  )
}
