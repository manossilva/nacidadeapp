import { useNavigate } from 'react-router-dom'

export const CATEGORIES = [
  { slug: 'gastronomia', label: 'Gastronomia' },
  { slug: 'praia',       label: 'Praia' },
  { slug: 'cultura',     label: 'Cultura' },
  { slug: 'festa',       label: 'Festa' },
  { slug: 'passeio',     label: 'Passeio' },
  { slug: 'hospedagem',  label: 'Hospedagem' },
]

export default function CategoryFilter({ selected, onChange }) {
  const navigate = useNavigate()

  function handleClick(slug) {
    if (onChange) {
      onChange(selected === slug ? null : slug)
    } else {
      navigate(selected === slug ? '/lugares' : `/lugares/${slug}`)
    }
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {CATEGORIES.map(({ slug, label }) => (
        <button
          key={slug}
          onClick={() => handleClick(slug)}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all active:scale-95 ${
            selected === slug ? 'pill-active' : 'pill'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
