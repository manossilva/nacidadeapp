import { Link } from 'react-router-dom'
import { formatDistance } from '../../lib/geolocation'
import { timeFromNow } from '../../lib/time'

function formatDateShort(isoString) {
  return new Date(isoString).toLocaleDateString('pt-BR', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
  })
}

export default function EventCard({ event, distance, compact }) {
  const { slug, name, short_description, cover_image_url, starts_at, price_info, is_featured } = event

  if (compact) {
    return (
      <Link to={`/evento/${slug}`} className="card flex gap-3 p-3 active:scale-[0.98] transition-transform">
        <div className="w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden bg-sand-200">
          {cover_image_url
            ? <img src={cover_image_url} alt={name} className="w-full h-full object-cover" loading="lazy" />
            : <div className="w-full h-full" style={{ background: '#c4a882' }} />
          }
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-sm leading-tight line-clamp-1" style={{ color: '#1f2e1a' }}>{name}</p>
          <p className="text-xs mt-0.5" style={{ color: '#728c68' }}>{formatDateShort(starts_at)}</p>
          {price_info && <span className="mt-1 inline-block text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: 'rgba(227,82,32,0.1)', color: '#c43d12' }}>{price_info}</span>}
        </div>
      </Link>
    )
  }

  return (
    <Link to={`/evento/${slug}`} className="card block active:scale-[0.98] transition-transform">
      <div className="relative aspect-[4/3] bg-sand-200 overflow-hidden">
        {cover_image_url ? (
          <img src={cover_image_url} alt={name} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full" style={{ background: '#c4a882' }} />
        )}
        {is_featured && (
          <span className="absolute top-2 left-2 badge text-[10px] px-2 py-1" style={{ background: 'rgba(30,42,22,0.82)', color: '#f5f0e8', backdropFilter: 'blur(6px)' }}>
            Em alta
          </span>
        )}
        {price_info && (
          <span className="absolute bottom-2 right-2 badge text-[10px] px-2 py-1" style={{ background: 'rgba(255,252,247,0.75)', color: '#c43d12', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.6)' }}>
            {price_info}
          </span>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-sm leading-tight" style={{ color: '#1f2e1a' }}>{name}</h3>
        <div className="flex items-center gap-1.5 mt-1 text-xs" style={{ color: '#728c68' }}>
          {starts_at && <span>{timeFromNow(starts_at)}</span>}
          {distance != null && <><span>·</span><span>{formatDistance(distance)}</span></>}
        </div>
        {short_description && (
          <p className="text-xs mt-1.5 line-clamp-2" style={{ color: '#52703d' }}>{short_description}</p>
        )}
      </div>
    </Link>
  )
}
