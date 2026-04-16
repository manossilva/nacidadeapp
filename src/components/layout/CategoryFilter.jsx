import { useNavigate, useParams } from 'react-router-dom'

export const CATEGORIES = [
  { slug: 'gastronomia', label: 'Gastronomia', emoji: '🍽️' },
  { slug: 'praia',       label: 'Praia',        emoji: '🏖️' },
  { slug: 'cultura',     label: 'Cultura',      emoji: '🎭' },
  { slug: 'festa',       label: 'Festa',        emoji: '🎉' },
  { slug: 'passeio',     label: 'Passeio',      emoji: '⛵' },
  { slug: 'hospedagem',  label: 'Hospedagem',   emoji: '🏨' },
]

export default function CategoryFilter({ selected, onChange }) {
  const navigate = useNavigate()

  function handleClick(slug) {
    if (onChange) {
      onChange(selected === slug ? null : slug)
    } else {
      navigate(selected === slug ? '/explorar' : `/explorar/${slug}`)
    }
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {CATEGORIES.map(({ slug, label, emoji }) => {
        const active = selected === slug
        return (
          <button
            key={slug}
            onClick={() => handleClick(slug)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium border transition-colors ${
              active
                ? 'bg-brand-900 text-white border-brand-900'
                : 'bg-white text-gray-700 border-gray-200 hover:border-brand-400'
            }`}
          >
            <span>{emoji}</span>
            <span>{label}</span>
          </button>
        )
      })}
    </div>
  )
}
