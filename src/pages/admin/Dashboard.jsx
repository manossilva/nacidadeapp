import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import AdminShell from '../../components/admin/AdminShell'

const INTERACTIONS = ['view', 'whatsapp_click', 'share', 'maps_click']
const LABELS = { view: 'Views', whatsapp_click: 'WA Clicks', share: 'Compartilhamentos', maps_click: 'Como chegar' }
const ICONS = { view: '👁', whatsapp_click: '💬', share: '🤝', maps_click: '🗺️' }

export default function AdminDashboard() {
  const [stats, setStats] = useState({})
  const [counts, setCounts] = useState({ places: 0, events: 0, advertisers: 0, revenue: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const todayStart = new Date()
      todayStart.setHours(0, 0, 0, 0)

      // Counts por tipo de interação hoje
      const { data: interactions } = await supabase
        .from('interactions')
        .select('interaction_type')
        .gte('created_at', todayStart.toISOString())

      const grouped = {}
      for (const t of INTERACTIONS) {
        grouped[t] = interactions?.filter(i => i.interaction_type === t).length ?? 0
      }
      setStats(grouped)

      // Contagens gerais
      const [places, events, advertisers] = await Promise.all([
        supabase.from('places').select('id', { count: 'exact', head: true }).eq('is_published', true),
        supabase.from('events').select('id', { count: 'exact', head: true }).eq('is_published', true).gte('starts_at', new Date().toISOString()),
        supabase.from('advertisers').select('monthly_fee').eq('payment_status', 'paid'),
      ])

      const mrr = advertisers.data?.reduce((sum, a) => sum + (a.monthly_fee || 0), 0) ?? 0

      setCounts({
        places: places.count ?? 0,
        events: events.count ?? 0,
        advertisers: advertisers.data?.length ?? 0,
        revenue: mrr,
      })
      setLoading(false)
    }
    load()
  }, [])

  return (
    <AdminShell title="Dashboard">
      {/* Stats de hoje */}
      <section>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Hoje</h2>
        <div className="grid grid-cols-2 gap-3">
          {INTERACTIONS.map(type => (
            <div key={type} className="bg-white rounded-2xl border border-gray-100 p-4">
              <p className="text-2xl">{ICONS[type]}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{loading ? '—' : stats[type] ?? 0}</p>
              <p className="text-xs text-gray-500 mt-0.5">{LABELS[type]}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Resumo geral */}
      <section className="mt-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Resumo</h2>
        <div className="space-y-2">
          {[
            { label: 'Locais publicados', value: counts.places, to: '/admin/locais' },
            { label: 'Eventos ativos', value: counts.events, to: '/admin/eventos' },
            { label: 'Anunciantes pagantes', value: counts.advertisers, to: '/admin/anunciantes' },
            { label: 'Receita mensal (MRR)', value: `R$ ${counts.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}`, to: '/admin/anunciantes' },
          ].map(item => (
            <Link
              key={item.label}
              to={item.to}
              className="flex items-center justify-between bg-white rounded-xl border border-gray-100 px-4 py-3 hover:border-brand-300 transition-colors"
            >
              <span className="text-sm text-gray-700">{item.label}</span>
              <span className="text-sm font-semibold text-brand-900">{loading ? '—' : item.value}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Ações rápidas */}
      <section className="mt-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Ações rápidas</h2>
        <div className="grid grid-cols-2 gap-3">
          <Link to="/admin/locais?new=1" className="btn-primary text-center text-sm py-3">
            + Novo local
          </Link>
          <Link to="/admin/eventos?new=1" className="btn-secondary text-center text-sm py-3">
            + Novo evento
          </Link>
        </div>
      </section>
    </AdminShell>
  )
}
