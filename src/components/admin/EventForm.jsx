import { useState } from 'react'
import { supabase } from '../../lib/supabase'

const CATEGORIES = ['show', 'festival', 'gastronômico', 'cultural', 'esportivo', 'outro']
const PLAN_TIERS = ['free', 'basic', 'pro', 'destaque']

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

export default function EventForm({ initial = {}, onSaved, onCancel }) {
  const isEdit = !!initial.id
  const [form, setForm] = useState({
    name: '', category: 'show', description: '', short_description: '',
    custom_location: '', latitude: '', longitude: '',
    starts_at: '', ends_at: '',
    ticket_url: '', price_info: '',
    organizer_name: '', organizer_whatsapp: '',
    plan_tier: 'free', is_published: false, is_featured: false,
    ...initial,
    starts_at: initial.starts_at ? initial.starts_at.slice(0, 16) : '',
    ends_at: initial.ends_at ? initial.ends_at.slice(0, 16) : '',
  })
  const [coverFile, setCoverFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    let cover_image_url = form.cover_image_url ?? null

    if (coverFile) {
      const ext = coverFile.name.split('.').pop()
      const path = `events/${slugify(form.name)}-${Date.now()}.${ext}`
      const { error: uploadErr } = await supabase.storage.from('images').upload(path, coverFile, { upsert: true })
      if (uploadErr) { setError('Erro ao enviar imagem: ' + uploadErr.message); setLoading(false); return }
      const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(path)
      cover_image_url = publicUrl
    }

    const payload = {
      name: form.name,
      slug: `${slugify(form.name)}-${Date.now()}`,
      category: form.category,
      description: form.description,
      short_description: form.short_description,
      custom_location: form.custom_location,
      latitude: form.latitude ? parseFloat(form.latitude) : null,
      longitude: form.longitude ? parseFloat(form.longitude) : null,
      starts_at: form.starts_at ? new Date(form.starts_at).toISOString() : null,
      ends_at: form.ends_at ? new Date(form.ends_at).toISOString() : null,
      ticket_url: form.ticket_url,
      price_info: form.price_info,
      organizer_name: form.organizer_name,
      organizer_whatsapp: form.organizer_whatsapp,
      plan_tier: form.plan_tier,
      is_published: form.is_published,
      is_featured: form.is_featured,
      cover_image_url,
    }

    let err
    if (isEdit) {
      ;({ error: err } = await supabase.from('events').update(payload).eq('id', initial.id))
    } else {
      ;({ error: err } = await supabase.from('events').insert(payload))
    }

    if (err) setError(err.message)
    else onSaved?.()
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg border border-red-200">{error}</div>}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
        <input required value={form.name} onChange={e => set('name', e.target.value)} className="input" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
        <select value={form.category} onChange={e => set('category', e.target.value)} className="input">
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição curta</label>
        <input maxLength={140} value={form.short_description} onChange={e => set('short_description', e.target.value)} className="input" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição completa</label>
        <textarea rows={4} value={form.description} onChange={e => set('description', e.target.value)} className="input" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Início *</label>
          <input required type="datetime-local" value={form.starts_at} onChange={e => set('starts_at', e.target.value)} className="input" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Término</label>
          <input type="datetime-local" value={form.ends_at} onChange={e => set('ends_at', e.target.value)} className="input" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Local / Endereço</label>
        <input value={form.custom_location} onChange={e => set('custom_location', e.target.value)} className="input" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
          <input type="number" step="any" value={form.latitude} onChange={e => set('latitude', e.target.value)} className="input" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
          <input type="number" step="any" value={form.longitude} onChange={e => set('longitude', e.target.value)} className="input" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Preço (ex: Gratuito, R$ 30)</label>
        <input value={form.price_info} onChange={e => set('price_info', e.target.value)} className="input" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Link de ingresso</label>
        <input type="url" value={form.ticket_url} onChange={e => set('ticket_url', e.target.value)} className="input" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Organizador</label>
          <input value={form.organizer_name} onChange={e => set('organizer_name', e.target.value)} className="input" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp organizador</label>
          <input value={form.organizer_whatsapp} onChange={e => set('organizer_whatsapp', e.target.value)} className="input" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Plano</label>
        <select value={form.plan_tier} onChange={e => set('plan_tier', e.target.value)} className="input">
          {PLAN_TIERS.map(p => <option key={p}>{p}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Foto de capa</label>
        <input type="file" accept="image/*" onChange={e => setCoverFile(e.target.files[0])} className="text-sm" />
        {form.cover_image_url && !coverFile && (
          <img src={form.cover_image_url} alt="capa atual" className="mt-2 h-20 rounded-lg object-cover" />
        )}
      </div>

      <div className="flex gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.is_published} onChange={e => set('is_published', e.target.checked)} />
          Publicado
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.is_featured} onChange={e => set('is_featured', e.target.checked)} />
          Destaque
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="btn-primary flex-1">
          {loading ? 'Salvando...' : isEdit ? 'Salvar alterações' : 'Criar evento'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-secondary flex-1">
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}
