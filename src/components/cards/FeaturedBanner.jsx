import { Link } from 'react-router-dom'
import { timeFromNow } from '../../lib/time'

export default function FeaturedBanner({ item, type = 'event', compact = false }) {
  if (!item) return null
  const to = type === 'event' ? `/evento/${item.slug}` : `/local/${item.slug}`

  // Faixa baixa — cabe na primeira dobra da Home junto com as sessões
  if (compact) {
    return (
      <Link
        to={to}
        className="relative flex items-center h-20 rounded-2xl overflow-hidden active:scale-[0.98] transition-transform"
        style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.10)' }}
      >
        {item.cover_image_url ? (
          <img src={item.cover_image_url} alt={item.name} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #2e4226, #52703d)' }} />
        )}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, rgba(15,22,10,0.88) 0%, rgba(15,22,10,0.6) 60%, rgba(15,22,10,0.25) 100%)' }}
        />

        <div className="relative flex-1 min-w-0 pl-4 pr-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-rust-300">
            Destaque{item.starts_at && ` · ${timeFromNow(item.starts_at)}`}
          </p>
          <h2 className="font-bold text-base leading-tight text-white line-clamp-1 mt-1">{item.name}</h2>
          {item.short_description && (
            <p className="text-xs line-clamp-1 mt-0.5" style={{ color: 'rgba(245,240,232,0.75)' }}>{item.short_description}</p>
          )}
        </div>

        <span
          className="relative mr-3 w-8 h-8 flex-none rounded-full flex items-center justify-center text-sm text-white"
          style={{ background: 'rgba(255,255,255,0.16)', border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(6px)' }}
        >
          →
        </span>
      </Link>
    )
  }

  return (
    <Link
      to={to}
      className="relative block rounded-2xl overflow-hidden active:scale-[0.98] transition-transform"
      style={{ aspectRatio: '16/9', boxShadow: '0 6px 28px rgba(0,0,0,0.12)' }}
    >
      {item.cover_image_url ? (
        <img src={item.cover_image_url} alt={item.name} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full" style={{ background: 'linear-gradient(135deg, #2e4226, #52703d)' }} />
      )}

      {/* Gradiente suave */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to top, rgba(15,22,10,0.75) 0%, rgba(15,22,10,0.1) 55%, transparent 100%)' }}
      />

      {/* Conteúdo */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <div
          className="inline-block text-[10px] font-semibold uppercase tracking-widest mb-2 px-2.5 py-1 rounded-full"
          style={{ background: 'rgba(255,252,247,0.15)', color: 'rgba(245,240,232,0.9)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.2)' }}
        >
          {type === 'event' ? 'Evento em destaque' : 'Local em destaque'}
        </div>
        <h2 className="font-bold text-xl leading-tight text-white">{item.name}</h2>
        {item.short_description && (
          <p className="text-sm mt-1 line-clamp-2" style={{ color: 'rgba(245,240,232,0.8)' }}>{item.short_description}</p>
        )}
        {item.starts_at && (
          <p className="text-xs mt-2 font-medium" style={{ color: 'rgba(245,240,232,0.65)' }}>
            {timeFromNow(item.starts_at)}
          </p>
        )}
      </div>
    </Link>
  )
}
