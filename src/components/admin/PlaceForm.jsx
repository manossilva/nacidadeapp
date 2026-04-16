import { useState } from 'react'
import { supabase } from '../../lib/supabase'

const CATEGORIES = ['gastronomia', 'praia', 'cultura', 'festa', 'passeio', 'hospedagem']
const PLAN_TIERS = ['free', 'basic', 'pro', 'destaque']

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

export default function PlaceForm({ initial = {}, onSaved, onCancel }) {
  const isEdit = !!initial.id
  const [form, setForm] = useState({
    name: '', category: 'gastronomia', description: '', short_description: '',
    address: '', neighborhood: '', latitude: '', longitude: '',
    whatsapp: '', instagram: '', website: '', price_range: '$',
    plan_tier: 'free', is_published: false, is_featured: false,
    tags: '', ...initial,
    tags: Array.isArray(initial.tags) ? initial.tags.join(', ') : (initial.tags ?? ''),
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

    // Upload de imagem
    if (coverFile) {
      const ext = coverFile.name.split('.').pop()
      const path = `places/${slugify(form.name)}-${Date.now()}.${ext}`
      const { error: uploadErr } = await supabase.storage.from('images').upload(path, coverFile, { upsert: true })
      if (uploadErr) { setError('Erro ao enviar imagem: ' + uploadErr.message); setLoading(false); return }
      const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(path)
      cover_image_url = publicUrl
    }

    const payload = {
      name: form.name,
      slug: slugify(form.name),
      category: form.category,
      description: form.description,
      short_description: form.short_description,
      address: form.address,
      neighborhood: form.neighborhood,
      latitude: form.latitude ? parseFloat(form.latitude) : null,
      longitude: form.longitude ? parseFloat(form.longitude) : null,
      whatsapp: form.whatsapp,
      instagram: form.instagram,
      website: form.website,
      price_range: form.price_range,
      plan_tier: form.plan_tier,
      is_published: form.is_published,
      is_featured: form.is_featured,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      cover_image_url,
    }

    let err
    if (isEdit) {
      ({ error: err } = await supabase.from('places').update(payload).eq('id', initial.id))
    } else {
      ({ error: err } = await supabase.from('places').insert(payload))
    }

    if (err) setError(err.message)
    else onSaved?.()
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg border border-red-200">{error}</div>}

      <Field label="Nome *">
        <input required value={form.name} onChange={e => set('name', e.target.value)} className="input" />
      </Field>

      <Field label="Categoria *">
        <select value={form.category} onChange={e => set('category', e.target.value)} className="input">
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </Field>

      <Field label="Descrição curta (máx. 140 chars)">
        <input maxLength={140} value={form.short_description} onChange={e => set('short_description', e.target.value)} className="input" />
      </Field>

      <Field label="Descrição completa">
        <textarea rows={4} value={form.description} onChange={e => set('description', e.target.value)} className="input" />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Bairro">
          <input value={form.neighborhood} onChange={e => set('neighborhood', e.target.value)} className="input" />
        </Field>
        <Field label="Faixa de preço">
          <select value={form.price_range} onChange={e => set('price_range', e.target.value)} className="input">
            {['$', '$$', '$$$'].map(p => <option key={p}>{p}</option>)}
          </select>
        </Field>
      </div>

      <Field label="Endereço">
        <input value={form.address} onChange={e => set('address', e.target.value)} className="input" />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Latitude">
          <input type="number" step="any" value={form.latitude} onChange={e => set('latitude', e.target.value)} className="input" placeholder="-10.9167" />
        </Field>
        <Field label="Longitude">
          <input type="number" step="any" value={form.longitude} onChange={e => set('longitude', e.target.value)} className="input" placeholder="-37.0500" />
        </Field>
      </div>

      <Field label="WhatsApp (ex: +5579999999999)">
        <input value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)} className="input" />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Instagram">
          <input value={form.instagram} onChange={e => set('instagram', e.target.value)} className="input" placeholder="@nome" />
        </Field>
        <Field label="Site">
          <input value={form.website} onChange={e => set('website', e.target.value)} className="input" />
        </Field>
      </div>

      <Field label="Tags (separadas por vírgula)">
        <input value={form.tags} onChange={e => set('tags', e.target.value)} className="input" placeholder="família, vista do mar, ao vivo" />
      </Field>

      <Field label="Plano">
        <select value={form.plan_tier} onChange={e => set('plan_tier', e.target.value)} className="input">
          {PLAN_TIERS.map(p => <option key={p}>{p}</option>)}
        </select>
      </Field>

      <Field label="Foto de capa">
        <input type="file" accept="image/*" onChange={e => setCoverFile(e.target.files[0])} className="text-sm" />
        {form.cover_image_url && !coverFile && (
          <img src={form.cover_image_url} alt="capa atual" className="mt-2 h-20 rounded-lg object-cover" />
        )}
      </Field>

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
          {loading ? 'Salvando...' : isEdit ? 'Salvar alterações' : 'Criar local'}
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

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
    </div>
  )
}
