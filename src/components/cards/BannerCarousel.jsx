import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { IcSparkle, IcLandmark } from '../ui/Icons'

// Banner dinâmico: troca sozinho, aceita arrastar para o lado e se ajusta à
// altura que sobrar na Home (o texto se adapta via container query no CSS)
const VARIANTS = {
  private: {
    overlay: 'linear-gradient(to top, rgba(28,12,6,0.92) 0%, rgba(28,12,6,0.45) 55%, rgba(28,12,6,0.1) 100%)',
    fallback: 'linear-gradient(135deg, #9e2f0e, #e35220)',
    tagClass: 'bg-rust-500 text-white',
    TagIcon: IcSparkle,
  },
  prefeitura: {
    overlay: 'linear-gradient(to top, rgba(9,22,14,0.92) 0%, rgba(9,22,14,0.45) 55%, rgba(9,22,14,0.1) 100%)',
    fallback: 'linear-gradient(135deg, #1f2e1a, #527044)',
    tagClass: 'bg-white/90 text-ink-800',
    TagIcon: IcLandmark,
  },
}

function Slide({ item, variant, active }) {
  const [imgErr, setImgErr] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)
  const { overlay, fallback, tagClass, TagIcon } = VARIANTS[variant]

  return (
    <>
      <div className="absolute inset-0" style={{ background: fallback }} />
      {item.image && !imgErr && (
        <img
          src={item.image}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            imgLoaded ? 'opacity-100' : 'opacity-0'
          } ${active ? 'banner-kenburns' : ''}`}
          ref={el => { if (el?.complete && el.naturalWidth) setImgLoaded(true) }}
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgErr(true)}
        />
      )}
      <div className="absolute inset-0" style={{ background: overlay }} />

      <span className={`absolute top-3 left-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${tagClass}`}>
        <TagIcon className="w-3 h-3" />
        {item.tag}
      </span>

      <div className="absolute inset-x-0 bottom-0 p-4 pr-14">
        <h2 className="banner-title font-extrabold leading-tight text-white line-clamp-2">{item.title}</h2>
        {item.subtitle && (
          <p className="banner-sub text-xs mt-1 line-clamp-1" style={{ color: 'rgba(245,240,232,0.8)' }}>{item.subtitle}</p>
        )}
        {item.meta && (
          <p className="text-[11px] font-semibold mt-1.5 line-clamp-1" style={{ color: 'rgba(245,240,232,0.95)' }}>{item.meta}</p>
        )}
      </div>

      <span
        className="absolute bottom-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-sm text-white"
        style={{ background: 'rgba(255,255,255,0.16)', border: '1px solid rgba(255,255,255,0.28)', backdropFilter: 'blur(6px)' }}
      >
        →
      </span>
    </>
  )
}

export default function BannerCarousel({ items, variant = 'private', interval = 5000, label, className = '' }) {
  const [index, setIndex] = useState(0)
  const touchX = useRef(null)
  const swiped = useRef(false)
  const count = items.length
  const current = count ? index % count : 0

  // Avança sozinho; trocar na mão reinicia a contagem
  useEffect(() => {
    if (count < 2) return
    const t = setTimeout(() => setIndex(i => (i + 1) % count), interval)
    return () => clearTimeout(t)
  }, [index, count, interval])

  if (!count) return null

  function onTouchStart(e) {
    touchX.current = e.touches[0].clientX
    swiped.current = false
  }

  function onTouchEnd(e) {
    if (touchX.current == null || count < 2) return
    const dx = e.changedTouches[0].clientX - touchX.current
    touchX.current = null
    if (Math.abs(dx) < 40) return
    swiped.current = true
    setIndex(i => (i + (dx < 0 ? 1 : count - 1)) % count)
  }

  return (
    <section
      aria-roledescription="carrossel"
      aria-label={label}
      className={`banner relative rounded-3xl overflow-hidden ${className}`}
      style={{ boxShadow: '0 6px 24px rgba(0,0,0,0.12)' }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onClickCapture={e => { if (swiped.current) { e.preventDefault(); swiped.current = false } }}
    >
      {items.map((item, i) => (
        <Link
          key={item.id}
          to={item.to}
          aria-hidden={i !== current}
          tabIndex={i === current ? 0 : -1}
          className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          <Slide item={item} variant={variant} active={i === current} />
        </Link>
      ))}

      {count > 1 && (
        <div className="absolute top-4 right-4 flex gap-1.5">
          {items.map((item, i) => (
            <button
              key={item.id}
              onClick={() => setIndex(i)}
              aria-label={`Mostrar banner ${i + 1} de ${count}`}
              className={`h-1.5 rounded-full transition-all ${i === current ? 'w-5 bg-white' : 'w-1.5 bg-white/50'}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
