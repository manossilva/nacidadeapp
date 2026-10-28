import { useState, useEffect } from 'react'
import { PinMark } from './Logo'

// Abertura: "Onde Vou?" → o pin cai no "?" e responde → "OndeVou"
// Aparece uma vez por sessão (abrir o site ou o app de novo mostra outra vez)
const KEY = 'ov_splash_v1'

function shouldShow() {
  if (window.location.pathname.startsWith('/admin')) return false
  try { return !sessionStorage.getItem(KEY) } catch { return true }
}

function Letters({ text, start }) {
  return text.split('').map((ch, i) => (
    <span key={i} className="splash-letter" style={{ animationDelay: `${start + i * 60}ms` }}>
      {ch}
    </span>
  ))
}

export default function Splash() {
  const [visible, setVisible] = useState(shouldShow)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    if (!visible) return
    try { sessionStorage.setItem(KEY, '1') } catch {}
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const leave = setTimeout(() => setLeaving(true), reduce ? 600 : 2300)
    const hide  = setTimeout(() => setVisible(false), reduce ? 1000 : 2700)
    return () => { clearTimeout(leave); clearTimeout(hide) }
  }, [visible])

  if (!visible) return null

  return (
    <div className={`splash ${leaving ? 'is-leaving' : ''}`} aria-hidden="true">
      <div className="splash-word">
        <span className="text-ink-800 dark:text-sand-50">
          <Letters text="Onde" start={0} />
        </span>
        <span className="splash-vou text-ink-900 dark:text-brand-400 black:text-white">
          <Letters text="Vou" start={320} />
        </span>
        <span className="splash-mark text-ink-800 dark:text-brand-400">
          <span className="splash-question">?</span>
          <span className="splash-ping" />
          <span className="splash-ping splash-ping-2" />
          <span className="splash-pin"><PinMark className="w-full h-full" /></span>
        </span>
      </div>
      <p className="splash-tagline text-ink-500 dark:text-ink-300">o que rola perto de você</p>
    </div>
  )
}
