import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import AdminShell from '../../components/admin/AdminShell'
import PlaceForm from '../../components/admin/PlaceForm'

export default function AdminPlaces() {
  const [places, setPlaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null) // null | {} (novo) | { ...place }
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    if (searchParams.get('new') === '1') {
      setEditing({})
      setSearchParams({})
    }
  }, [])

  async function load() {
    setLoading(true)
    const { data } = await supabase
      .from('places')
      .select('id, name, category, neighborhood, plan_tier, is_published, is_featured, view_count, whatsapp_click_count')
      .order('created_at', { ascending: false })
    setPlaces(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleDelete(id) {
    if (!confirm('Deletar este local? Ação irreversível.')) return
    await supabase.from('places').delete().eq('id', id)
    load()
  }

  async function togglePublish(place) {
    await supabase.from('places').update({ is_published: !place.is_published }).eq('id', place.id)
    load()
  }

  if (editing !== null) {
    return (
      <AdminShell title={editing.id ? 'Editar local' : 'Novo local'}>
        <PlaceForm
          initial={editing}
          onSaved={() => { setEditing(null); load() }}
          onCancel={() => setEditing(null)}
        />
      </AdminShell>
    )
  }

  return (
    <AdminShell
      title="Locais"
      action={
        <button onClick={() => setEditing({})} className="btn-primary px-4 py-2 text-sm w-auto">
          + Novo local
        </button>
      }
    >
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : places.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">Nenhum local ainda. Crie o primeiro!</p>
      ) : (
        <div className="space-y-2">
          {places.map(place => (
            <div key={place.id} className="bg-white rounded-xl border border-gray-100 px-4 py-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-gray-900 text-sm">{place.name}</span>
                    <span className={`badge text-[10px] px-1.5 ${place.plan_tier === 'free' ? 'bg-gray-100 text-gray-500' : 'bg-brand-100 text-brand-800'}`}>
                      {place.plan_tier.toUpperCase()}
                    </span>
                    {!place.is_published && (
                      <span className="badge bg-yellow-100 text-yellow-700 text-[10px] px-1.5">rascunho</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {place.category} · {place.neighborhood || '—'} · 👁 {place.view_count} · 💬 {place.whatsapp_click_count}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => togglePublish(place)}
                    className="text-xs text-gray-500 hover:text-brand-700 font-medium"
                  >
                    {place.is_published ? 'Despublicar' : 'Publicar'}
                  </button>
                  <button
                    onClick={() => setEditing(place)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(place.id)}
                    className="text-xs text-red-500 hover:text-red-700 font-medium"
                  >
                    Del
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  )
}
