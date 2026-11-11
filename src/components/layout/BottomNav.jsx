import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

// `match` decide quando o item fica ativo — sessões e perfis de loja contam como Início
const navItems = [
  { to: '/',              label: 'Início',      icon: HomeIcon,     match: p => p === '/' || p.startsWith('/sessao/') || p.startsWith('/loja/') },
  { to: '/eventos',       label: 'Agenda',      icon: CalIcon,      match: p => p.startsWith('/eventos') || p.startsWith('/evento/') },
  { to: '/onde-estou',    label: 'Onde estou',  icon: LocationIcon, match: p => p.startsWith('/onde-estou') || p.startsWith('/roteiros') },
  { to: '/configuracoes', label: 'Menu',        icon: MenuIcon,     match: p => p.startsWith('/configuracoes') || p.startsWith('/login') },
]

// A barra é remontada a cada tela; guardar o último item ativo aqui deixa a
// pílula sair de onde estava e correr até o novo, em vez de pular
let lastIndex = -1

export default function BottomNav() {
  const { pathname } = useLocation()
  const index = navItems.findIndex(item => item.match(pathname))
  const moved = lastIndex >= 0 && index >= 0 && lastIndex !== index
  const [thumbAt, setThumbAt] = useState(moved ? lastIndex : index)

  useEffect(() => {
    lastIndex = index
    if (thumbAt === index) return
    const frame = requestAnimationFrame(() => setThumbAt(index))
    return () => cancelAnimationFrame(frame)
  }, [index, thumbAt])

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 safe-bottom nav-bg">
      <div className="relative max-w-2xl mx-auto flex h-16">
        <span
          aria-hidden="true"
          className="nav-thumb"
          style={thumbAt >= 0 ? { transform: `translateX(${thumbAt * 100}%)` } : { opacity: 0 }}
        >
          <span />
        </span>
        {navItems.map(({ to, label, icon: Icon, match }, i) => {
          const active = i === index
          return (
            <Link
              key={to}
              to={to}
              aria-current={active ? 'page' : undefined}
              className={`nav-item flex-1 flex flex-col items-center justify-center gap-1 text-[10px] leading-3 font-semibold transition-colors duration-300 ${
                active ? 'is-active' : ''
              } ${active && moved ? 'is-fresh' : ''}`}
            >
              {/* Ícones são só contorno: o ativo ganha traço mais forte e fica sobre a pílula amarela */}
              <span className="nav-pill h-7 w-12 rounded-full flex items-center justify-center">
                <Icon strokeWidth={active ? 2.2 : 1.8} />
              </span>
              <span>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

function HomeIcon({ strokeWidth }) {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={strokeWidth} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  )
}

function LocationIcon({ strokeWidth }) {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={strokeWidth} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function CalIcon({ strokeWidth }) {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={strokeWidth} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  )
}

function MenuIcon({ strokeWidth }) {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={strokeWidth} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}
