import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { whatsappLink, googleMapsRouteLink, shareWhatsappLink } from '../lib/whatsapp'
import { trackInteraction } from '../lib/analytics'
import PageShell from '../components/layout/PageShell'

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('pt-BR', {
    weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
  })
}

function formatHours(hours) {
  if (!hours) return null
  const days = { mon: 'Seg', tue: 'Ter', wed: 'Qua', thu: 'Qui', fri: 'Sex', sat: 'Sáb', sun: 'Dom' }
  return Object.entries(hours)
    .map(([k, v]) => `${days[k] ?? k}: ${v}`)
    .join(' • ')
}

export default function Detail({ type }) {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(false)

  const table = type === 'place' ? 'places' : 'events'

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from(table)
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single()
      setItem(data)
      setLoading(false)
      if (data) {
        trackInteraction({ placeId: type === 'place' ? data.id : null, eventId: type === 'event' ? data.id : null, type: 'view' })
      }
    }
    load()
  }, [slug, table, type])

  if (loading) return <LoadingDetail />
  if (!item) return <NotFound />

  const hasWhatsapp = item.whatsapp || item.organizer_whatsapp
  const whatsappNumber = item.whatsapp || item.organizer_whatsapp
  const hasCoords = item.latitude && item.longitude

  function handleWhatsapp() {
    trackInteraction({ placeId: type === 'place' ? item.id : null, eventId: type === 'event' ? item.id : null, type: 'whatsapp_click' })
    window.open(whatsappLink(whatsappNumber), '_blank')
  }

  function handleMaps() {
    trackInteraction({ placeId: type === 'place' ? item.id : null, eventId: type === 'event' ? item.id : null, type: 'maps_click' })
    window.open(googleMapsRouteLink(item.latitude, item.longitude, item.name), '_blank')
  }

  function handleShare() {
    trackInteraction({ placeId: type === 'place' ? item.id : null, eventId: type === 'event' ? item.id : null, type: 'share' })
    const link = shareWhatsappLink(item.name, item.slug, type === 'place' ? 'local' : 'evento')
    window.open(link, '_blank')
  }

  const description = item.description || item.short_description

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Imagem hero */}
      <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden">
        {item.cover_image_url ? (
          <img src={item.cover_image_url} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            {type === 'event' ? '🎉' : '📍'}
          </div>
        )}
        {/* Botão voltar */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 bg-white/90 backdrop-blur rounded-full w-9 h-9 flex items-center justify-center shadow active:scale-95"
        >
          ←
        </button>
        {/* Botão compartilhar */}
        <button
          onClick={handleShare}
          className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-full w-9 h-9 flex items-center justify-center shadow active:scale-95 text-sm"
        >
          ↗
        </button>
      </div>

      {/* Conteúdo */}
      <div className="max-w-lg mx-auto w-full px-4 pb-8">
        <div className="pt-4">
          <h1 className="text-2xl font-bold text-gray-900">{item.name}</h1>
          <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-500">
            {item.category && <span className="capitalize">{item.category}</span>}
            {item.price_range && <><span>·</span><span>{item.price_range}</span></>}
            {item.neighborhood && <><span>·</span><span>{item.neighborhood}</span></>}
          </div>
        </div>

        {/* Info de evento */}
        {type === 'event' && item.starts_at && (
          <div className="mt-3 bg-brand-50 rounded-xl px-4 py-3 text-sm text-brand-900">
            <span className="font-medium">🗓 {formatDate(item.starts_at)}</span>
            {item.price_info && <p className="mt-0.5 text-brand-700">{item.price_info}</p>}
          </div>
        )}

        {/* Endereço */}
        {(item.address || item.custom_location) && (
          <p className="mt-3 text-sm text-gray-600 flex items-start gap-1.5">
            <span className="mt-0.5">📍</span>
            <span>{item.address || item.custom_location}</span>
          </p>
        )}

        {/* Horário de funcionamento (lugares) */}
        {type === 'place' && item.opening_hours && (
          <p className="mt-2 text-xs text-gray-500">
            🕐 {formatHours(item.opening_hours)}
          </p>
        )}

        {/* Descrição */}
        {description && (
          <div className="mt-4">
            <p className={`text-sm text-gray-700 leading-relaxed ${!expanded ? 'line-clamp-4' : ''}`}>
              {description}
            </p>
            {description.length > 200 && (
              <button
                onClick={() => setExpanded(v => !v)}
                className="text-brand-700 text-sm font-medium mt-1"
              >
                {expanded ? 'Ver menos ▲' : 'Ver mais ▼'}
              </button>
            )}
          </div>
        )}

        {/* Tags */}
        {item.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {item.tags.map(tag => (
              <span key={tag} className="badge bg-gray-100 text-gray-600 px-2 py-1 text-xs">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* CTAs */}
        <div className="mt-6 space-y-3">
          {hasWhatsapp && (
            <button onClick={handleWhatsapp} className="btn-primary">
              <span>💬</span> Chamar no WhatsApp
            </button>
          )}
          {type === 'event' && item.ticket_url && (
            <a href={item.ticket_url} target="_blank" rel="noopener noreferrer" className="btn-primary">
              <span>🎟</span> Comprar ingresso
            </a>
          )}
          {hasCoords && (
            <button onClick={handleMaps} className="btn-secondary">
              <span>🗺️</span> Como chegar
            </button>
          )}
          <button onClick={handleShare} className="btn-secondary">
            <span>🤝</span> Compartilhar no WhatsApp
          </button>
        </div>

        {/* Instagram */}
        {item.instagram && (
          <a
            href={`https://instagram.com/${item.instagram.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
          >
            <span>📸</span> @{item.instagram.replace('@', '')}
          </a>
        )}
      </div>
    </div>
  )
}

function LoadingDetail() {
  return (
    <div className="min-h-screen bg-white">
      <div className="aspect-[4/3] bg-gray-200 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-7 bg-gray-200 rounded w-2/3 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
        <div className="h-20 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  )
}

function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <p className="text-4xl mb-3">🔍</p>
      <h2 className="text-lg font-semibold text-gray-800">Não encontrado</h2>
      <p className="text-sm text-gray-500 mt-1">Esse lugar ou evento não existe mais.</p>
      <button onClick={() => navigate('/')} className="mt-4 btn-primary max-w-xs">
        Voltar para o início
      </button>
    </div>
  )
}
