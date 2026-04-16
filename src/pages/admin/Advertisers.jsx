import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import AdminShell from '../../components/admin/AdminShell'

const PLANS = ['basic', 'pro', 'destaque']
const PLAN_PRICES = { basic: 97, pro: 247, destaque: 497 }
const STATUS_LABELS = { paid: 'Pago', pending: 'Pendente', overdue: 'Em atraso' }
const STATUS_COLORS = {
  paid: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  overdue: 'bg-red-100 text-red-700',
}

export default function AdminAdvertisers() {
  const [advertisers, setAdvertisers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ business_name: '', contact_name: '', whatsapp: '', email: '', plan: 'basic', monthly_fee: 97, payment_status: 'pending', notes: '' })
  const [saving, setSaving] = useState(false)

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('advertisers').select('*').order('created_at', { ascending: false })
    setAdvertisers(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const mrr = advertisers.filter(a => a.payment_status === 'paid').reduce((s, a) => s + (a.monthly_fee || 0), 0)

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    await supabase.from('advertisers').insert({ ...form, monthly_fee: parseFloat(form.monthly_fee) })
    setShowForm(false)
    setForm({ business_name: '', contact_name: '', whatsapp: '', email: '', plan: 'basic', monthly_fee: 97, payment_status: 'pending', notes: '' })
    load()
    setSaving(false)
  }

  async function updateStatus(id, status) {
    await supabase.from('advertisers').update({ payment_status: status }).eq('id', id)
    load()
  }

  async function handleDelete(id) {
    if (!confirm('Remover este anunciante?')) return
    await supabase.from('advertisers').delete().eq('id', id)
    load()
  }

  return (
    <AdminShell
      title="Anunciantes"
      action={
        <button onClick={() => setShowForm(v => !v)} className="btn-primary px-4 py-2 text-sm w-auto">
          + Novo anunciante
        </button>
      }
    >
      {/* MRR */}
      <div className="bg-brand-900 text-white rounded-2xl px-4 py-3 mb-5 flex items-center justify-between">
        <span className="text-sm font-medium">Receita mensal (MRR)</span>
        <span className="text-xl font-bold">R$ {mrr.toLocaleString('pt-BR')}</span>
      </div>

      {/* Formulário novo anunciante */}
      {showForm && (
        <form onSubmit={handleSave} className="bg-white rounded-2xl border border-gray-100 p-4 mb-4 space-y-3">
          <h3 className="font-semibold text-gray-800">Novo anunciante</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Empresa *</label>
              <input required value={form.business_name} onChange={e => setForm(f => ({...f, business_name: e.target.value}))} className="input" />
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Contato</label>
              <input value={form.contact_name} onChange={e => setForm(f => ({...f, contact_name: e.target.value}))} className="input" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-600 mb-1 block">WhatsApp</label>
              <input value={form.whatsapp} onChange={e => setForm(f => ({...f, whatsapp: e.target.value}))} className="input" />
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Email</label>
              <input type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} className="input" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Plano</label>
              <select value={form.plan} onChange={e => setForm(f => ({...f, plan: e.target.value, monthly_fee: PLAN_PRICES[e.target.value] ?? f.monthly_fee}))} className="input">
                {PLANS.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Valor/mês (R$)</label>
              <input type="number" value={form.monthly_fee} onChange={e => setForm(f => ({...f, monthly_fee: e.target.value}))} className="input" />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-600 mb-1 block">Observações</label>
            <input value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))} className="input" />
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="btn-primary flex-1 text-sm">{saving ? 'Salvando...' : 'Salvar'}</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1 text-sm">Cancelar</button>
          </div>
        </form>
      )}

      {/* Lista */}
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : advertisers.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">Nenhum anunciante ainda. Vá vender!</p>
      ) : (
        <div className="space-y-2">
          {advertisers.map(a => (
            <div key={a.id} className="bg-white rounded-xl border border-gray-100 px-4 py-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{a.business_name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {a.plan?.toUpperCase()} · R$ {a.monthly_fee ?? '—'}/mês
                    {a.contact_name && ` · ${a.contact_name}`}
                  </p>
                  {a.notes && <p className="text-xs text-gray-400 italic mt-0.5">{a.notes}</p>}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`badge text-[10px] px-2 py-1 ${STATUS_COLORS[a.payment_status] ?? 'bg-gray-100'}`}>
                    {STATUS_LABELS[a.payment_status] ?? a.payment_status}
                  </span>
                  <div className="flex gap-2 mt-1">
                    {a.payment_status !== 'paid' && (
                      <button onClick={() => updateStatus(a.id, 'paid')} className="text-[10px] text-green-600 font-medium">✓ Pago</button>
                    )}
                    {a.payment_status === 'paid' && (
                      <button onClick={() => updateStatus(a.id, 'pending')} className="text-[10px] text-yellow-600 font-medium">Pendente</button>
                    )}
                    <button onClick={() => handleDelete(a.id)} className="text-[10px] text-red-500 font-medium">Del</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  )
}
