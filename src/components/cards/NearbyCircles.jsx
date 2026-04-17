import { Link } from 'react-router-dom'
import { formatDistance } from '../../lib/geolocation'

function SkeletonCircles({ count }) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex-shrink-0 flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-full animate-pulse" style={{ background: 'rgba(212,191,160,0.4)' }} />
          <div className="h-2.5 w-12 rounded-full animate-pulse" style={{ background: 'rgba(212,191,160,0.4)' }} />
        </div>
      ))}
    </div>
  )
}

export default function NearbyCircles({ items, loading, onRequestLocation, hasLocation }) {
  if (!hasLocation) {
    return (
      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
        <button
          onClick={onRequestLocation}
          className="flex-shrink-0 flex flex-col items-center gap-2"
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,252,247,0.55)', backdropFilter: 'blur(12px)', border: '2px dashed rgba(114,140,104,0.5)' }}
          >
            <svg className="w-6 h-6" fill="none" stroke="#728c68" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <span className="text-[11px] font-medium text-center w-16 leading-tight" style={{ color: '#52703d' }}>
            Ativar local
          </span>
        </button>
        <SkeletonCircles count={4} />
      </div>
    )
  }

  if (loading) return <SkeletonCircles count={5} />

  if (!items || items.length === 0) {
    return <p className="text-sm py-2" style={{ color: '#9aad92' }}>Nenhum lugar num raio de 1,5 km.</p>
  }

  const now = Date.now()

  return (
    <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
      {items.map(item => {
        const to = item._type === 'place' ? `/local/${item.slug}` : `/evento/${item.slug}`
        const initials = item.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
        const isLive = item._type === 'event' && new Date(item.starts_at).getTime() <= now

        return (
          <Link
            key={item.id}
            to={to}
            className="flex-shrink-0 flex flex-col items-center gap-1.5 active:scale-95 transition-transform"
          >
            <div
              className="w-16 h-16 rounded-full overflow-hidden relative"
              style={{ border: '2.5px solid rgba(255,255,255,0.7)', boxShadow: '0 2px 12px rgba(0,0,0,0.1)' }}
            >
              {item.cover_image_url ? (
                <img src={item.cover_image_url} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm font-bold" style={{ background: '#8f6e49', color: '#f5f0e8' }}>
                  {initials}
                </div>
              )}
              {isLive && (
                <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white" style={{ background: '#e35220' }} />
              )}
            </div>
            <div className="text-center w-16">
              <p className="text-[11px] font-medium leading-tight line-clamp-2" style={{ color: '#1f2e1a' }}>{item.name}</p>
              <p className="text-[10px] mt-0.5" style={{ color: '#9aad92' }}>{formatDistance(item._distance)}</p>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
