import { useState, useEffect } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function VerifyEmail() {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const email = location.state?.email ?? ''
  const isConfirmed = searchParams.get('confirmed') === 'true'

  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)
  const [resendError, setResendError] = useState(null)
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    if (cooldown <= 0) return
    const t = setTimeout(() => setCooldown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  async function handleResend() {
    if (!email || cooldown > 0) return
    setResending(true)
    setResendError(null)
    setResent(false)

    const { error } = await supabase.auth.resend({ type: 'signup', email })

    if (error) {
      setResendError('Não foi possível reenviar. Tente novamente em breve.')
    } else {
      setResent(true)
      setCooldown(60)
    }
    setResending(false)
  }

  if (isConfirmed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl glass mb-6">
            <span className="text-3xl">✅</span>
          </div>
          <h1 className="text-2xl font-bold text-ink-800 mb-2">E-mail confirmado!</h1>
          <p className="text-ink-500 mb-8">Sua conta está ativa. Agora você pode entrar.</p>
          <Link to="/login" className="btn-primary">
            Ir para o login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl glass mb-4">
            <span className="text-3xl">📬</span>
          </div>
          <h1 className="text-2xl font-bold text-ink-800 mb-2">Verifique seu e-mail</h1>
          <p className="text-ink-500 text-sm leading-relaxed">
            Enviamos um link de confirmação para{' '}
            {email ? (
              <strong className="text-ink-700">{email}</strong>
            ) : 'o seu e-mail'}.
            {' '}Clique nele para ativar sua conta.
          </p>
        </div>

        <div className="glass rounded-3xl p-6 space-y-4">

          <div className="flex items-start gap-3 bg-sand-100/60 rounded-xl px-4 py-3">
            <span className="text-lg mt-0.5">💡</span>
            <p className="text-sm text-ink-600">
              Não encontrou o e-mail? Verifique a pasta de <strong>spam</strong> ou clique abaixo para reenviar.
            </p>
          </div>

          {resent && (
            <div className="bg-green-50/80 text-green-700 text-sm px-3 py-2.5 rounded-xl border border-green-200">
              E-mail reenviado! Verifique sua caixa de entrada.
            </div>
          )}

          {resendError && (
            <div className="bg-red-50/80 text-red-700 text-sm px-3 py-2.5 rounded-xl border border-red-200">
              {resendError}
            </div>
          )}

          <button
            type="button"
            onClick={handleResend}
            disabled={resending || cooldown > 0 || !email}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resending ? (
              <>
                <span className="w-4 h-4 border-2 border-ink-400 border-t-transparent rounded-full animate-spin" />
                Reenviando...
              </>
            ) : cooldown > 0 ? (
              `Reenviar em ${cooldown}s`
            ) : (
              'Reenviar e-mail de confirmação'
            )}
          </button>

          <Link to="/login" className="btn-ghost w-full justify-center text-ink-500">
            Voltar para o login
          </Link>

        </div>

      </div>
    </div>
  )
}
