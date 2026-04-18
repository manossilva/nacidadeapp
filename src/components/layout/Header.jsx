import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../../hooks/useTheme'
import { useCity } from '../../hooks/useCity'
import CityModal from '../ui/CityModal'

export default function Header() {
  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith('/admin')
  const [dark, toggleTheme] = useTheme()
  const { city, detecting, changeCity } = useCity()
  const [showCityModal, setShowCityModal] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-40 header-bg">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex flex-col leading-none">
            <span className="font-bold text-base tracking-tight text-ink-800 dark:text-sand-100">
              Aju Guide
            </span>
            {!isAdmin && (
              <button
                onClick={() => setShowCityModal(true)}
                className="flex items-center gap-1 mt-0.5"
              >
                <svg className="w-3 h-3 text-ink-400 dark:text-sand-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="text-[11px] font-medium text-ink-500 dark:text-sand-400">
                  {detecting ? 'Detectando...' : (city || 'Definir cidade')}
                </span>
                <svg className="w-2.5 h-2.5 text-ink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            )}
          </Link>

          <div className="flex items-center gap-2">
            {/* Toggle tema */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 flex items-center justify-center rounded-xl glass active:scale-90 transition-transform"
              aria-label={dark ? 'Modo claro' : 'Modo escuro'}
            >
              {dark ? (
                <svg className="w-4 h-4 text-sand-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 100 14A7 7 0 0012 5z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-ink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {isAdmin && (
              <span className="badge text-xs px-2.5 py-1 bg-ink-800/10 text-ink-700 dark:bg-sand-100/10 dark:text-sand-200">
                Admin
              </span>
            )}
          </div>
        </div>
      </header>

      {showCityModal && (
        <CityModal
          current={city}
          onSave={changeCity}
          onClose={() => setShowCityModal(false)}
        />
      )}
    </>
  )
}
