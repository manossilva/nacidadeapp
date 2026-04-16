import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import AdminShell from '../../components/admin/AdminShell'
import EventForm from '../../components/admin/EventForm'

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

export default function AdminEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
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
      .from('events')
      .select('id, name, category, starts_at, price_info, plan_tier, is_published, is_featured, view_count')
      .order('starts_at', { ascending: false })
    setEvents(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleDelete(id) {
    if (!confirm('Deletar este evento?')) return
    await supabase.from('events').delete().eq('id', id)
    load()
  }

  async function togglePublish(event) {
    await supabase.from('events').update({ is_published: !event.is_published }).eq('id', event.id)
    load()
  }

  if (editing !== null) {
    return (
      <AdminShell title={editing.id ? 'Editar evento' : 'Novo evento'}>
        <EventForm
          initial={editing}
          onSaved={() => { setEditing(null); load() }}
          onCancel={() => setEditing(null)}
        />
      </AdminShell>
    )
  }

  return (
    <AdminShell
      title="Eventos"
      action={
        <button onClick={() => setEditing({})} className="btn-primary px-4 py-2 text-sm w-auto">
          + Novo evento
        </button>
      }
    >
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">Nenhum evento ainda.</p>
      ) : (
        <div className="space-y-2">
          {events.map(event => (
            <div key={event.id} className="bg-white rounded-xl border border-gray-100 px-4 py-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-gray-900 text-sm">{event.name}</span>
                    <span className={`badge text-[10px] px-1.5 ${event.plan_tier === 'free' ? 'bg-gray-100 text-gray-500' : 'bg-brand-100 text-brand-800'}`}>
                      {event.plan_tier.toUpperCase()}
                    </span>
                    {!event.is_published && (
                      <span className="badge bg-yellow-100 text-yellow-700 text-[10px] px-1.5">rascunho</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {event.category} · {formatDate(event.starts_at)} · 👁 {event.view_count}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => togglePublish(event)} className="text-xs text-gray-500 hover:text-brand-700 font-medium">
                    {event.is_published ? 'Despublicar' : 'Publicar'}
                  </button>
                  <button onClick={() => setEditing(event)} className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                    Editar
                  </button>
                  <button onClick={() => handleDelete(event.id)} className="text-xs text-red-500 hover:text-red-700 font-medium">
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
