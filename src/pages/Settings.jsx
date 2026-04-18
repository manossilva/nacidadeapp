import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PageShell from '../components/layout/PageShell'
import { useTheme } from '../hooks/useTheme'
import { useCity } from '../hooks/useCity'
import CityModal from '../components/ui/CityModal'
import { supabase } from '../lib/supabase'
import {
  IcSun, IcMoon, IcCircle, IcPin, IcUser, IcKey, IcLogout, IcInfo, IcChevronRight
} from '../components/ui/Icons'

function Row({ icon, label, children }) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-white/10 last:border-0">
      <div className="flex items-center gap-3">
        <span className="text-ink-500 dark:text-ink-400">{icon}</span>
        <span className="text-sm font-medium text-ink-700 dark:text-sand-200">{label}</span>
      </div>
      {children}
    </div>
  )
}

const THEMES = [
  { id: 'light', label: 'Claro',  Icon: IcSun },
  { id: 'dark',  label: 'Escuro', Icon: IcMoon },
  { id: 'black', label: 'Preto',  Icon: IcCircle },
]

export default function Settings() {
  const navigate = useNavigate()
  const [theme, , setTheme] = useTheme()
  const { city, changeCity } = useCity()
  const [showCityModal, setShowCityModal] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data?.user ?? null))
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <PageShell>
      <div className="pt-5 pb-4">
        <h1 className="text-2xl font-bold text-ink-800 dark:text-sand-100">Configurações</h1>
      </div>

      {/* Tema */}
      <section className="glass rounded-2xl px-4 mb-4">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-ink-400 pt-3 pb-3">Aparência</p>
        <div className="grid grid-cols-3 gap-2 pb-4">
          {THEMES.map(({ id, label, Icon }) => {
            const active = theme === id
            return (
              <button
                key={id}
                onClick={() => setTheme(id)}
                className={`flex flex-col items-center gap-2 py-3 rounded-2xl border transition-all ${
                  active
                    ? 'bg-ink-800 dark:bg-white border-transparent text-white dark:text-ink-900'
                    : 'glass border-white/30 text-ink-600 dark:text-sand-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-semibold">{label}</span>
              </button>
            )
          })}
        </div>
      </section>

      {/* Localização */}
      <section className="glass rounded-2xl px-4 mb-4">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-ink-400 pt-3 pb-2">Localização</p>
        <Row icon={<IcPin className="w-4 h-4" />} label="Cidade atual">
          <button
            onClick={() => setShowCityModal(true)}
            className="flex items-center gap-1 text-sm font-semibold text-ink-600 dark:text-sand-300"
          >
            {city || 'Definir'} <IcChevronRight className="w-3.5 h-3.5 text-ink-400" />
          </button>
        </Row>
      </section>

      {/* Conta */}
      <section className="glass rounded-2xl px-4 mb-4">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-ink-400 pt-3 pb-2">Conta</p>
        {user ? (
          <>
            <Row icon={<IcUser className="w-4 h-4" />} label="E-mail">
              <span className="text-sm text-ink-500 dark:text-sand-400 truncate max-w-[140px]">{user.email}</span>
            </Row>
            <Row icon={<IcLogout className="w-4 h-4" />} label="Sair">
              <button onClick={handleLogout} className="text-sm font-semibold text-red-500">Sair</button>
            </Row>
          </>
        ) : (
          <Row icon={<IcKey className="w-4 h-4" />} label="Entrar na conta">
            <button onClick={() => navigate('/login')} className="text-sm font-semibold text-ink-700 dark:text-sand-200 flex items-center gap-1">
              Entrar <IcChevronRight className="w-3.5 h-3.5" />
            </button>
          </Row>
        )}
      </section>

      {/* Sobre */}
      <section className="glass rounded-2xl px-4 mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-ink-400 pt-3 pb-2">Sobre</p>
        <Row icon={<IcInfo className="w-4 h-4" />} label="Na Cidade App">
          <span className="text-sm text-ink-400">v0.2.0</span>
        </Row>
      </section>

      {showCityModal && (
        <CityModal current={city} onSave={changeCity} onClose={() => setShowCityModal(false)} />
      )}
    </PageShell>
  )
}
