import { Link } from 'react-router-dom'

export default function FeaturedBanner({ item, type = 'event' }) {
  if (!item) return null

  const to = type === 'event' ? `/evento/${item.slug}` : `/local/${item.slug}`

  return (
    <Link
      to={to}
      className="relative block rounded-2xl overflow-hidden aspect-[16/9] bg-gray-200 active:scale-[0.98] transition-transform shadow-md"
    >
      {item.cover_image_url ? (
        <img
          src={item.cover_image_url}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-brand-800 to-brand-600" />
      )}

      {/* Gradiente escuro embaixo */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <span className="text-xs font-semibold uppercase tracking-wider text-brand-300 mb-1 block">
          {type === 'event' ? '🎉 Evento em destaque' : '📍 Local em destaque'}
        </span>
        <h2 className="font-bold text-lg leading-tight">{item.name}</h2>
        {item.short_description && (
          <p className="text-sm text-white/80 mt-0.5 line-clamp-2">{item.short_description}</p>
        )}
        {item.starts_at && (
          <p className="text-xs text-white/70 mt-1">
            {new Date(item.starts_at).toLocaleDateString('pt-BR', {
              weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
            })}
          </p>
        )}
      </div>
    </Link>
  )
}
