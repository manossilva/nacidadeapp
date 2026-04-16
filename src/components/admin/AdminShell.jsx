import { Link, NavLink, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

const navItems = [
  { to: '/admin', label: 'Dashboard', exact: true },
  { to: '/admin/locais', label: 'Locais' },
  { to: '/admin/eventos', label: 'Eventos' },
  { to: '/admin/anunciantes', label: 'Anunciantes' },
]

export default function AdminShell({ title, children, action }) {
  const navigate = useNavigate()

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-bold text-brand-900">Aju Guide Admin</span>
          <button onClick={handleLogout} className="text-xs text-gray-500 hover:text-gray-700">
            Sair
          </button>
        </div>
        {/* Nav */}
        <nav className="flex gap-1 overflow-x-auto px-4 pb-2 max-w-2xl mx-auto">
          {navItems.map(({ to, label, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) =>
                `flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-brand-900 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
          {action}
        </div>
        {children}
      </main>
    </div>
  )
}
