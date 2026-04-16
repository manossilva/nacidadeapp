import { Link } from 'react-router-dom'

function timeFromNow(isoString) {
  const diff = new Date(isoString) - Date.now()
  if (diff < 0) return 'Em andamento agora'
  const h = Math.floor(diff / 3_600_000)
  const m = Math.floor((diff % 3_600_000) / 60_000)
  if (h > 0) return `Começa em ${h}h${m > 0 ? ` ${m}min` : ''}`
  return `Começa em ${m}min`
}

export default function FeaturedBanner({ item, type = 'event' }) {
  if (!item) return null
  const to = type === 'event' ? `/evento/${item.slug}` : `/local/${item.slug}`

  return (
    <Link
      to={to}
      className="relative block rounded-3xl overflow-hidden active:scale-[0.98] transition-transform"
      style={{ aspectRatio: '16/9', boxShadow: '0 8px 40px rgba(0,0,0,0.14)' }}
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
