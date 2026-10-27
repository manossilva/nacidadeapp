import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../../hooks/useTheme'
import { IcSun, IcMoon, IcCircle } from '../ui/Icons'
import Logo from '../ui/Logo'
import { todayLabel } from '../../lib/time'

const ThemeIcons = { light: IcSun, dark: IcMoon, black: IcCircle }

export default function Header() {
  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith('/admin')
  const [theme, cycleTheme] = useTheme()
  const ThemeIcon = ThemeIcons[theme] ?? IcSun

  return (
    <header className="sticky top-0 z-40 header-bg">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="text-xl" aria-label="OndeVou — início">
          <Logo />
        </Link>

        <div className="flex items-center gap-2">
          {isAdmin ? (
            <span className="badge text-xs px-2.5 py-1 bg-ink-800/10 text-ink-700 dark:bg-sand-100/10 dark:text-sand-200">
              Admin
            </span>
          ) : (
            <span className="h-9 px-3 flex items-center rounded-xl glass text-xs font-semibold text-ink-700 dark:text-sand-200">
              {todayLabel()}
            </span>
          )}

          <button
            onClick={cycleTheme}
            className="w-9 h-9 flex items-center justify-center rounded-xl glass active:scale-90 transition-transform"
            aria-label="Alternar tema"
          >
            <ThemeIcon className="w-4 h-4 text-ink-600 dark:text-sand-300" />
          </button>
        </div>
      </div>
    </header>
  )
}
