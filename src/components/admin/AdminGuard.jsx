import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export function AdminGuard({ children }) {
  const [status, setStatus] = useState('loading') // 'loading' | 'authed' | 'unauthed'

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setStatus(session ? 'authed' : 'unauthed')
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setStatus(session ? 'authed' : 'unauthed')
    })
    return () => subscription.unsubscribe()
  }, [])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-brand-900 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (status === 'unauthed') return <Navigate to="/admin/login" replace />

  return children
}
