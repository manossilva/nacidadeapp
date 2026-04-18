import { useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useState } from 'react'
import { IcShare, IcPin, IcStar, IcMap } from '../components/ui/Icons'
import { MOCK_PLACES, MOCK_EVENTS } from '../lib/mockData'
import { USE_MOCK } from '../lib/config'

async function fetchItem(type, slug) {
  const table = type === 'place' ? 'places' : 'events'
  const { data } = await supabase.from(table).select('*').eq('slug', slug).single()
  return data
}

export default function ShareCard() {
  const { type, slug } = useParams()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const cardRef = useRef(null)

  useEffect(() => {
    if (USE_MOCK) {
      const list = type === 'place' ? MOCK_PLACES : MOCK_EVENTS
      setItem(list.find(i => i.slug === slug) ?? list[0])
      setLoading(false)
      return
    }
    fetchItem(type, slug).then(d => { setItem(d); setLoading(false) })
  }, [type, slug])

  async function handleShare() {
    const shareData = {
      title: item?.name ?? 'Na Cidade',
      text: item?.short_description ?? '',
      url: window.location.href,
    }
    if (navigator.share) {
      try { await navigator.share(shareData) } catch {}
    } else {
      await navigator.clipboard.writeText(window.location.href)
      alert('Link copiado!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-ink-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!item) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-ink-500">Conteúdo não encontrado.</p>
        <Link to="/" className="btn-primary max-w-xs">Voltar ao início</Link>
      </div>
    )
  }

  const isEvent = type === 'event'
  const dateStr = isEvent && item.starts_at
    ? new Date(item.starts_at).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })
    : null

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">

      {/* Card estilo Strava */}
      <div
        ref={cardRef}
        className="w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl"
        style={{ background: 'linear-gradient(145deg, #1f2e1a 0%, #2e4226 60%, #3d5733 100%)' }}
      >
        {/* Imagem de capa */}
        {item.cover_image_url ? (
          <div className="relative" style={{ aspectRatio: '4/3' }}>
            <img src={item.cover_image_url} alt={item.name} className="w-full h-full object-cover opacity-70" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 30%, rgba(15,22,10,0.85) 100%)' }} />
          </div>
        ) : (
          <div className="flex items-center justify-center" style={{ aspectRatio: '4/3', background: 'rgba(255,255,255,0.05)' }}>
            {isEvent ? <IcStar className="w-16 h-16 text-white/20" /> : <IcPin className="w-16 h-16 text-white/20" />}
          </div>
        )}

        {/* Conteúdo */}
        <div className="px-5 pt-4 pb-6">
          {/* Badge tipo */}
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-3"
            style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(245,240,232,0.8)' }}>
            {isEvent ? <IcStar className="w-3 h-3" /> : <IcPin className="w-3 h-3" />}
            {isEvent ? 'Evento' : 'Local'}
          </span>

          <h1 className="text-2xl font-bold text-white leading-tight mb-2">{item.name}</h1>

          {item.short_description && (
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(245,240,232,0.7)' }}>
              {item.short_description}
            </p>
          )}

          {/* Detalhes */}
          <div className="space-y-1.5 mb-5">
            {item.neighborhood && (
              <div className="flex items-center gap-2 text-sm" style={{ color: 'rgba(245,240,232,0.65)' }}>
                <IcPin className="w-3.5 h-3.5" />
                <span>{item.neighborhood}</span>
              </div>
            )}
            {dateStr && (
              <div className="flex items-center gap-2 text-sm" style={{ color: 'rgba(245,240,232,0.65)' }}>
                <IcStar className="w-3.5 h-3.5" />
                <span>{dateStr}</span>
              </div>
            )}
            {item.price_range && (
              <div className="flex items-center gap-2 text-sm" style={{ color: 'rgba(245,240,232,0.65)' }}>
                <IcMap className="w-3.5 h-3.5" />
                <span>{item.price_range}</span>
              </div>
            )}
          </div>

          {/* Rodapé */}
          <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.12)' }}>
            <span className="text-xs font-bold tracking-wider" style={{ color: 'rgba(245,240,232,0.45)' }}>
              NA CIDADE APP
            </span>
            <div className="flex -space-x-1">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-5 h-5 rounded-full border border-white/20"
                  style={{ background: `hsl(${100 + i * 30} 40% 40%)` }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Botões de ação */}
      <div className="w-full max-w-sm mt-5 space-y-3">
        <button
          onClick={handleShare}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <IcShare className="w-4 h-4" />
          Compartilhar
        </button>
        <Link
          to={isEvent ? `/evento/${item.slug}` : `/local/${item.slug}`}
          className="btn-secondary flex items-center justify-center"
        >
          Ver detalhes completos
        </Link>
      </div>
    </div>
  )
}
