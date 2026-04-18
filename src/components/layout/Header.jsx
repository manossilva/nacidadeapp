import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../../hooks/useTheme'
import { useCity } from '../../hooks/useCity'
import CityModal from '../ui/CityModal'
import { IcSun, IcMoon, IcCircle, IcPin } from '../ui/Icons'

const ThemeIcons = { light: IcSun, dark: IcMoon, black: IcCircle }

export default function Header() {
  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith('/admin')
  const [theme, cycleTheme] = useTheme()
  const { city, detecting, changeCity } = useCity()
  const [showCityModal, setShowCityModal] = useState(false)
  const ThemeIcon = ThemeIcons[theme] ?? IcSun

  return (
    <>
      <header className="sticky top-0 z-40 header-bg">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex flex-col leading-none">
            <span className="font-bold text-base tracking-tight text-ink-800 dark:text-sand-100">
              Na Cidade
            </span>
            {!isAdmin && (
              <button
                onClick={() => setShowCityModal(true)}
                className="flex items-center gap-1 mt-0.5"
              >
                <IcPin className="w-3 h-3 text-ink-400 dark:text-sand-400" />
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
            <button
              onClick={cycleTheme}
              className="w-9 h-9 flex items-center justify-center rounded-xl glass active:scale-90 transition-transform"
              aria-label="Alternar tema"
            >
              <ThemeIcon className="w-4 h-4 text-ink-600 dark:text-sand-300" />
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
        <CityModal current={city} onSave={changeCity} onClose={() => setShowCityModal(false)} />
      )}
    </>
  )
}
