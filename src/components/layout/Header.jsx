import { Link, useLocation } from 'react-router-dom'

export default function Header() {
  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith('/admin')

  return (
    <header
      className="sticky top-0 z-40"
      style={{
        background: 'rgba(237,232,223,0.75)',
        backdropFilter: 'blur(20px) saturate(1.5)',
        WebkitBackdropFilter: 'blur(20px) saturate(1.5)',
        borderBottom: '1px solid rgba(255,255,255,0.5)',
      }}
    >
      <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span
            className="font-bold text-xl tracking-tight"
            style={{ color: '#1f2e1a' }}
          >
            Aju Guide
          </span>
        </Link>

        {isAdmin ? (
          <span className="badge text-xs px-2.5 py-1" style={{ background: 'rgba(46,66,38,0.12)', color: '#2e4226' }}>
            Admin
          </span>
        ) : (
          <Link
            to="/lugares"
            className="text-sm font-medium"
            style={{ color: '#3d5733' }}
          >
            Explorar
          </Link>
        )}
      </div>
    </header>
  )
}
