import { Link } from 'react-router-dom'
import { formatDistance } from '../../lib/geolocation'

export default function PlaceCard({ place, distance }) {
  const { slug, name, category, short_description, cover_image_url, neighborhood, price_range, plan_tier, is_featured } = place

  return (
    <Link to={`/local/${slug}`} className="card block active:scale-[0.98] transition-transform">
      <div className="relative aspect-[4/3] bg-sand-200 overflow-hidden">
        {cover_image_url ? (
          <img
            src={cover_image_url}
            alt={name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: '#d4bfa0' }}>
            <span className="text-sand-600 text-xs font-medium uppercase tracking-wider">Sem foto</span>
          </div>
        )}
        {is_featured && (
          <span className="absolute top-2 left-2 badge text-[10px] px-2 py-1" style={{ background: 'rgba(30,42,22,0.82)', color: '#f5f0e8', backdropFilter: 'blur(6px)' }}>
            Destaque
          </span>
        )}
        {price_range && (
          <span className="absolute bottom-2 right-2 badge text-[10px] px-2 py-1" style={{ background: 'rgba(255,252,247,0.75)', color: '#3d5733', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.6)' }}>
            {price_range}
          </span>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-sm leading-tight" style={{ color: '#1f2e1a' }}>{name}</h3>
        <div className="flex items-center gap-1.5 mt-1 text-xs" style={{ color: '#728c68' }}>
          {neighborhood && <span>{neighborhood}</span>}
          {distance != null && <><span>·</span><span>{formatDistance(distance)}</span></>}
        </div>
        {short_description && (
          <p className="text-xs mt-1.5 line-clamp-2" style={{ color: '#52703d' }}>{short_description}</p>
        )}
      </div>
    </Link>
  )
}
