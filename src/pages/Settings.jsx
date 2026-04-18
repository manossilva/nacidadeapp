import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageShell from '../components/layout/PageShell'
import { useTheme } from '../hooks/useTheme'
import { useCity } from '../hooks/useCity'
import CityModal from '../components/ui/CityModal'
import { supabase } from '../lib/supabase'

function Row({ icon, label, children }) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-white/20 last:border-0">
      <div className="flex items-center gap-3">
        <span className="text-lg">{icon}</span>
        <span className="text-sm font-medium text-ink-700 dark:text-sand-200">{label}</span>
      </div>
      {children}
    </div>
  )
}

function Toggle({ on, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`relative w-11 h-6 rounded-full transition-colors ${on ? 'bg-ink-700' : 'bg-ink-200 dark:bg-ink-600'}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${on ? 'translate-x-5' : ''}`}
      />
    </button>
  )
}

export default function Settings() {
  const navigate = useNavigate()
  const [dark, toggleTheme] = useTheme()
  const { city, changeCity } = useCity()
  const [showCityModal, setShowCityModal] = useState(false)
  const [user, setUser] = useState(null)

  useState(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data?.user ?? null))
  })

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <PageShell hideNav={false}>
      <div className="pt-5 pb-4">
        <h1 className="text-2xl font-bold text-ink-800 dark:text-sand-100">Configurações</h1>
      </div>

      {/* Aparência */}
      <section className="glass rounded-2xl px-4 mb-4">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-ink-400 pt-3 pb-2">Aparência</p>
        <Row icon="🌙" label="Modo escuro">
          <Toggle on={dark} onToggle={toggleTheme} />
        </Row>
      </section>

      {/* Localização */}
      <section className="glass rounded-2xl px-4 mb-4">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-ink-400 pt-3 pb-2">Localização</p>
        <Row icon="📍" label="Cidade atual">
          <button
            onClick={() => setShowCityModal(true)}
            className="text-sm font-semibold text-ink-600 dark:text-sand-300 flex items-center gap-1"
          >
            {city || 'Detectar'} <span className="text-ink-400">›</span>
          </button>
        </Row>
      </section>

      {/* Conta */}
      <section className="glass rounded-2xl px-4 mb-4">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-ink-400 pt-3 pb-2">Conta</p>
        {user ? (
          <>
            <Row icon="👤" label="E-mail">
              <span className="text-sm text-ink-500 dark:text-sand-400 truncate max-w-[140px]">{user.email}</span>
            </Row>
            <Row icon="🚪" label="Sair">
              <button onClick={handleLogout} className="text-sm font-semibold text-red-600">
                Sair
              </button>
            </Row>
          </>
        ) : (
          <Row icon="🔑" label="Entrar na conta">
            <button
              onClick={() => navigate('/login')}
              className="text-sm font-semibold text-ink-700 dark:text-sand-200"
            >
              Entrar →
            </button>
          </Row>
        )}
      </section>

      {/* Sobre */}
      <section className="glass rounded-2xl px-4 mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-ink-400 pt-3 pb-2">Sobre</p>
        <Row icon="🌊" label="Aju Guide">
          <span className="text-sm text-ink-400">v0.2.0</span>
        </Row>
      </section>

      {showCityModal && (
        <CityModal
          current={city}
          onSave={changeCity}
          onClose={() => setShowCityModal(false)}
        />
      )}
    </PageShell>
  )
}
