import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { whatsappLink, googleMapsRouteLink, shareWhatsappLink } from '../lib/whatsapp'
import { trackInteraction } from '../lib/analytics'
import { MOCK_PLACES, MOCK_EVENTS } from '../lib/mockData'

const USE_MOCK = true

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('pt-BR', {
    weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
  })
}

function formatHours(hours) {
  if (!hours) return null
  const days = { mon: 'Seg', tue: 'Ter', wed: 'Qua', thu: 'Qui', fri: 'Sex', sat: 'Sáb', sun: 'Dom' }
  return Object.entries(hours).map(([k, v]) => `${days[k] ?? k}: ${v}`).join('  ·  ')
}

export default function Detail({ type }) {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (USE_MOCK) {
      const all = type === 'place' ? MOCK_PLACES : MOCK_EVENTS
      const found = all.find(i => i.slug === slug)
      setItem(found ?? null)
      setLoading(false)
      return
    }
    const table = type === 'place' ? 'places' : 'events'
    supabase
      .from(table)
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single()
      .then(({ data }) => {
        setItem(data)
        setLoading(false)
        if (data) {
          trackInteraction({
            placeId: type === 'place' ? data.id : null,
            eventId: type === 'event' ? data.id : null,
            type: 'view',
          })
        }
      })
  }, [slug, type])

  if (loading) return <LoadingDetail />
  if (!item) return <NotFound />

  const whatsappNumber = item.whatsapp || item.organizer_whatsapp
  const hasCoords = item.latitude && item.longitude

  function handleWhatsapp() {
    if (!USE_MOCK) trackInteraction({ placeId: type === 'place' ? item.id : null, eventId: type === 'event' ? item.id : null, type: 'whatsapp_click' })
    window.open(whatsappLink(whatsappNumber), '_blank')
  }
  function handleMaps() {
    if (!USE_MOCK) trackInteraction({ placeId: type === 'place' ? item.id : null, eventId: type === 'event' ? item.id : null, type: 'maps_click' })
    window.open(googleMapsRouteLink(item.latitude, item.longitude, item.name), '_blank')
  }
  function handleShare() {
    if (!USE_MOCK) trackInteraction({ placeId: type === 'place' ? item.id : null, eventId: type === 'event' ? item.id : null, type: 'share' })
    window.open(shareWhatsappLink(item.name, item.slug, type === 'place' ? 'local' : 'evento'), '_blank')
  }

  const description = item.description || item.short_description

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: '#ede8df' }}>
      {/* Hero */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4/3' }}>
        {item.cover_image_url ? (
          <img src={item.cover_image_url} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full" style={{ background: 'linear-gradient(135deg, #8f6e49, #c4a882)' }} />
        )}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(15,22,10,0.5) 0%, transparent 50%)' }} />

        {/* Voltar */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-9 h-9 rounded-full flex items-center justify-center active:scale-95 transition-all"
          style={{ background: 'rgba(237,232,223,0.75)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.5)' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="#1f2e1a" strokeWidth={2.2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Compartilhar */}
        <button
          onClick={handleShare}
          className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center active:scale-95 transition-all"
          style={{ background: 'rgba(237,232,223,0.75)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.5)' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="#1f2e1a" strokeWidth={2.2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </button>
      </div>

      {/* Conteúdo */}
      <div className="max-w-lg mx-auto w-full px-4 pb-12">
        <div className="pt-5">
          <h1 className="text-2xl font-bold leading-tight" style={{ color: '#1f2e1a' }}>{item.name}</h1>
          <div className="flex flex-wrap items-center gap-2 mt-1.5 text-sm" style={{ color: '#728c68' }}>
            {item.category && <span className="capitalize font-medium">{item.category}</span>}
            {item.price_range && <><span>·</span><span>{item.price_range}</span></>}
            {item.neighborhood && <><span>·</span><span>{item.neighborhood}</span></>}
          </div>
        </div>

        {/* Data do evento */}
        {type === 'event' && item.starts_at && (
          <div
            className="mt-4 px-4 py-3 rounded-2xl"
            style={{ background: 'rgba(46,66,38,0.08)', border: '1px solid rgba(46,66,38,0.12)' }}
          >
            <p className="text-sm font-semibold capitalize" style={{ color: '#2e4226' }}>{formatDate(item.starts_at)}</p>
            {item.price_info && <p className="text-xs mt-0.5 font-medium" style={{ color: '#e35220' }}>{item.price_info}</p>}
          </div>
        )}

        {/* Endereço */}
        {(item.address || item.custom_location) && (
          <p className="mt-4 text-sm flex items-start gap-2" style={{ color: '#52703d' }}>
            <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {item.address || item.custom_location}
          </p>
        )}

        {/* Horário */}
        {type === 'place' && item.opening_hours && (
          <p className="mt-2 text-xs" style={{ color: '#9aad92' }}>{formatHours(item.opening_hours)}</p>
        )}

        {/* Descrição */}
        {description && (
          <div className="mt-5">
            <p className={`text-sm leading-relaxed ${!expanded ? 'line-clamp-4' : ''}`} style={{ color: '#2e4226' }}>
              {description}
            </p>
            {description.length > 200 && (
              <button
                onClick={() => setExpanded(v => !v)}
                className="text-sm font-semibold mt-1.5"
                style={{ color: '#3d5733' }}
              >
                {expanded ? 'Ver menos' : 'Ver mais'}
              </button>
            )}
          </div>
        )}

        {/* Tags */}
        {item.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-5">
            {item.tags.map(tag => (
              <span key={tag} className="pill">{tag}</span>
            ))}
          </div>
        )}

        {/* CTAs */}
        <div className="mt-7 space-y-3">
          {whatsappNumber && (
            <button onClick={handleWhatsapp} className="btn-primary">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.549 4.107 1.51 5.843L.036 23.5l5.818-1.527A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.847 0-3.576-.504-5.065-1.385l-.363-.216-3.76.987 1.004-3.668-.237-.378A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              </svg>
              Chamar no WhatsApp
            </button>
          )}
          {type === 'event' && item.ticket_url && (
            <a href={item.ticket_url} target="_blank" rel="noopener noreferrer" className="btn-primary">
              Comprar ingresso
            </a>
          )}
          {hasCoords && (
            <button onClick={handleMaps} className="btn-secondary">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Como chegar
            </button>
          )}
          <button onClick={handleShare} className="btn-secondary">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Mandar pra galera
          </button>
        </div>

        {/* Instagram */}
        {item.instagram && (
          <a
            href={`https://instagram.com/${item.instagram.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center gap-2 text-sm font-medium"
            style={{ color: '#9aad92' }}
          >
            @{item.instagram.replace('@', '')} no Instagram
          </a>
        )}
      </div>
    </div>
  )
}

function LoadingDetail() {
  return (
    <div className="min-h-dvh" style={{ background: '#ede8df' }}>
      <div className="aspect-[4/3] animate-pulse" style={{ background: 'rgba(212,191,160,0.5)' }} />
      <div className="p-4 space-y-3">
        <div className="h-7 rounded-xl animate-pulse w-2/3" style={{ background: 'rgba(212,191,160,0.5)' }} />
        <div className="h-4 rounded-xl animate-pulse w-1/3" style={{ background: 'rgba(212,191,160,0.4)' }} />
      </div>
    </div>
  )
}

function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-4 text-center" style={{ background: '#ede8df' }}>
      <h2 className="text-lg font-semibold" style={{ color: '#1f2e1a' }}>Não encontrado</h2>
      <p className="text-sm mt-1 mb-4" style={{ color: '#9aad92' }}>Esse lugar ou evento sumiu.</p>
      <button onClick={() => navigate('/')} className="btn-primary max-w-xs">Voltar pro início</button>
    </div>
  )
}
