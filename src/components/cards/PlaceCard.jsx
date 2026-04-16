import { Link } from 'react-router-dom'
import { formatDistance } from '../../lib/geolocation'

const PRICE_LABELS = { '$': 'Barato', '$$': 'Médio', '$$$': 'Caro' }

export default function PlaceCard({ place, distance }) {
  const { slug, name, category, short_description, cover_image_url, neighborhood, price_range, plan_tier, is_featured } = place

  return (
    <Link to={`/local/${slug}`} className="card block active:scale-[0.98] transition-transform">
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
        {cover_image_url ? (
          <img
            src={cover_image_url}
            alt={name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">📍</div>
        )}
        {is_featured && (
          <span className="absolute top-2 left-2 badge bg-brand-900 text-white text-[10px] px-2 py-1">
            Destaque
          </span>
        )}
        {plan_tier === 'destaque' && (
          <span className="absolute top-2 right-2 badge bg-yellow-400 text-yellow-900 text-[10px] px-2 py-1">
            ⭐ Top
          </span>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-gray-900 text-sm leading-tight">{name}</h3>
        <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500">
          {neighborhood && <span>{neighborhood}</span>}
          {price_range && <><span>·</span><span>{price_range}</span></>}
          {distance != null && <><span>·</span><span>{formatDistance(distance)}</span></>}
        </div>
        {short_description && (
          <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">{short_description}</p>
        )}
      </div>
    </Link>
  )
}
