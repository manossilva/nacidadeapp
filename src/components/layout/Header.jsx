import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../../hooks/useTheme'

export default function Header() {
  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith('/admin')
  const [dark, toggleTheme] = useTheme()

  return (
    <header className="sticky top-0 z-40 header-bg">
      <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-bold text-xl tracking-tight text-ink-800 dark:text-sand-100">
            Aju Guide
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {/* Toggle claro/escuro */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center rounded-xl glass active:scale-90 transition-transform"
            aria-label={dark ? 'Modo claro' : 'Modo escuro'}
          >
            {dark ? (
              <svg className="w-4.5 h-4.5 text-sand-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 100 14A7 7 0 0012 5z" />
              </svg>
            ) : (
              <svg className="w-4.5 h-4.5 text-ink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {isAdmin ? (
            <span className="badge text-xs px-2.5 py-1 bg-ink-800/10 text-ink-700 dark:bg-sand-100/10 dark:text-sand-200">
              Admin
            </span>
          ) : (
            <Link to="/lugares" className="text-sm font-medium text-ink-600 dark:text-sand-300">
              Explorar
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
