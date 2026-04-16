import { Link } from 'react-router-dom'
import { formatDistance } from '../../lib/geolocation'

function formatDate(isoString) {
  if (!isoString) return ''
  const d = new Date(isoString)
  return d.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

export default function EventCard({ event, distance }) {
  const { slug, name, short_description, cover_image_url, starts_at, price_info, is_featured, plan_tier } = event

  return (
    <Link to={`/evento/${slug}`} className="card block active:scale-[0.98] transition-transform">
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
        {cover_image_url ? (
          <img
            src={cover_image_url}
            alt={name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">🎉</div>
        )}
        {is_featured && (
          <span className="absolute top-2 left-2 badge bg-brand-900 text-white text-[10px] px-2 py-1">
            Destaque
          </span>
        )}
        {price_info && (
          <span className="absolute bottom-2 right-2 badge bg-black/70 text-white text-[10px] px-2 py-1">
            {price_info}
          </span>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-gray-900 text-sm leading-tight">{name}</h3>
        <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500">
          {starts_at && <span>{formatDate(starts_at)}</span>}
          {distance != null && <><span>·</span><span>{formatDistance(distance)}</span></>}
        </div>
        {short_description && (
          <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">{short_description}</p>
        )}
      </div>
    </Link>
  )
}
