import { useState } from 'react'
import PageShell from '../components/layout/PageShell'
import PlaceCard from '../components/cards/PlaceCard'
import CategoryFilter, { CATEGORIES } from '../components/layout/CategoryFilter'
import { usePlaces } from '../hooks/usePlaces'
import { MOCK_PLACES } from '../lib/mockData'

const USE_MOCK = true

export default function Lugares() {
  const [activeCategory, setActiveCategory] = useState(null)

  const { places: supaPlaces, loading } = usePlaces({ category: activeCategory, limit: 40 })
  const places = USE_MOCK
    ? MOCK_PLACES.filter(p => !activeCategory || p.category === activeCategory)
    : supaPlaces

  const count = places.length

  return (
    <PageShell>
      <div className="pt-5 pb-4">
        <h1 className="text-2xl font-bold" style={{ color: '#1f2e1a' }}>Lugares</h1>
        <p className="text-sm mt-0.5" style={{ color: '#728c68' }}>
          {count > 0 ? `${count} lugar${count !== 1 ? 'es' : ''} em Aracaju` : 'Explorando a cidade...'}
        </p>
      </div>

      <CategoryFilter selected={activeCategory} onChange={setActiveCategory} />

      <section className="mt-5">
        {(USE_MOCK ? false : loading) ? (
          <SkeletonGrid />
        ) : places.length === 0 ? (
          <Empty text="Nenhum lugar nessa categoria ainda." />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {places.map(p => <PlaceCard key={p.id} place={p} />)}
          </div>
        )}
      </section>
    </PageShell>
  )
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {[1,2,3,4,5,6].map(i => (
        <div key={i} className="aspect-[4/3] rounded-2xl animate-pulse" style={{ background: 'rgba(212,191,160,0.4)' }} />
      ))}
    </div>
  )
}

function Empty({ text }) {
  return <p className="text-sm py-10 text-center" style={{ color: '#9aad92' }}>{text}</p>
}
