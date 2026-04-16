import { Link } from 'react-router-dom'
import PageShell from '../components/layout/PageShell'
import CategoryFilter from '../components/layout/CategoryFilter'
import FeaturedBanner from '../components/cards/FeaturedBanner'
import PlaceCard from '../components/cards/PlaceCard'
import EventCard from '../components/cards/EventCard'
import { SkeletonBanner, SkeletonList } from '../components/ui/Skeleton'
import { usePlaces, useEvents } from '../hooks/usePlaces'

function todayLabel() {
  return new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
}

export default function Home() {
  const { events: featuredEvents, loading: loadingFE } = useEvents({ featured: true, period: 'week', limit: 1 })
  const { events, loading: loadingEvents } = useEvents({ period: 'today', limit: 8 })
  const { places, loading: loadingPlaces } = usePlaces({ limit: 8 })

  const featuredItem = featuredEvents[0] ?? null

  return (
    <PageShell>
      {/* Cabeçalho da home */}
      <div className="pt-4 pb-3">
        <h1 className="text-2xl font-bold text-gray-900">Hoje em Aju</h1>
        <p className="text-sm text-gray-500 capitalize">{todayLabel()}</p>
      </div>

      {/* Banner destaque */}
      {loadingFE ? (
        <SkeletonBanner />
      ) : featuredItem ? (
        <FeaturedBanner item={featuredItem} type="event" />
      ) : null}

      {/* Botão perto de mim */}
      <Link
        to="/perto-de-mim"
        className="mt-3 flex items-center gap-2 bg-brand-50 border border-brand-200 text-brand-900 rounded-xl px-4 py-3 text-sm font-medium active:scale-95 transition-transform"
      >
        <span>📍</span>
        <span>Mostrar perto de mim</span>
        <span className="ml-auto text-brand-400">→</span>
      </Link>

      {/* Categorias */}
      <section className="mt-5">
        <CategoryFilter />
      </section>

      {/* Eventos de hoje */}
      <section className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-gray-900">Eventos de hoje</h2>
          <Link to="/explorar" className="text-sm text-brand-700 font-medium">Ver todos</Link>
        </div>
        {loadingEvents ? (
          <SkeletonList count={4} />
        ) : events.length === 0 ? (
          <p className="text-sm text-gray-400 py-4 text-center">Nenhum evento hoje. Volte amanhã!</p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {events.map(event => <EventCard key={event.id} event={event} />)}
          </div>
        )}
      </section>

      {/* Bares e restaurantes */}
      <section className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-gray-900">Bares e restaurantes</h2>
          <Link to="/explorar/gastronomia" className="text-sm text-brand-700 font-medium">Ver todos</Link>
        </div>
        {loadingPlaces ? (
          <SkeletonList count={4} />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {places.map(place => <PlaceCard key={place.id} place={place} />)}
          </div>
        )}
      </section>

      {/* Rodapé de identidade */}
      <footer className="mt-10 pb-4 text-center text-xs text-gray-400">
        Feito com cuidado em Aracaju 🦀
      </footer>
    </PageShell>
  )
}
