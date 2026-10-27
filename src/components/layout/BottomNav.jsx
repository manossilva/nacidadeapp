import { Link, useLocation } from 'react-router-dom'

// `match` decide quando o item fica ativo — as sessões abertas pela Home contam como Início
const navItems = [
  { to: '/',              label: 'Início',  icon: HomeIcon,     match: p => p === '/' || p.startsWith('/sessao/') },
  { to: '/onde-estou',    label: 'Locais',  icon: LocationIcon, match: p => p.startsWith('/onde-estou') || p.startsWith('/perto-de-mim') },
  { to: '/eventos',       label: 'Agenda',  icon: CalIcon,      match: p => p.startsWith('/eventos') || p.startsWith('/agenda-publica') || p.startsWith('/evento/') },
  { to: '/turismo',       label: 'Turismo', icon: MapIcon,      match: p => p.startsWith('/turismo') || p.startsWith('/roteiros') },
  { to: '/configuracoes', label: 'Menu',    icon: MenuIcon,     match: p => p.startsWith('/configuracoes') },
]

export default function BottomNav() {
  const { pathname } = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 safe-bottom nav-bg">
      <div className="max-w-2xl mx-auto flex h-16">
        {navItems.map(({ to, label, icon: Icon, match }) => {
          const active = match(pathname)
          return (
            <Link
              key={to}
              to={to}
              aria-current={active ? 'page' : undefined}
              className={`flex-1 flex flex-col items-center justify-center gap-1 text-[10px] font-semibold transition-colors ${
                active ? 'text-ink-800 dark:text-sand-100' : 'text-ink-400 dark:text-ink-500'
              }`}
            >
              {/* Ícones são só contorno: o ativo ganha traço mais forte e uma pílula de fundo */}
              <span className={`h-7 w-12 rounded-full flex items-center justify-center transition-colors ${
                active ? 'bg-ink-800/10 dark:bg-sand-100/15' : ''
              }`}>
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

function MapIcon({ strokeWidth }) {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={strokeWidth} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
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
