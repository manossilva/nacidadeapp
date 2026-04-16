import { Link, useLocation } from 'react-router-dom'

export default function Header() {
  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith('/admin')

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-100">
      <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-brand-900 font-bold text-xl tracking-tight">Aju Guide</span>
        </Link>

        {isAdmin ? (
          <span className="badge bg-brand-100 text-brand-900">Admin</span>
        ) : (
          <Link
            to="/explorar"
            className="text-sm font-medium text-brand-900 hover:text-brand-700"
          >
            Explorar
          </Link>
        )}
      </div>
    </header>
  )
}
