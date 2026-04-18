import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ReCAPTCHA from 'react-google-recaptcha'
import { supabase } from '../../lib/supabase'

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY

export default function Register() {
  const navigate = useNavigate()
  const recaptchaRef = useRef(null)

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [captchaToken, setCaptchaToken] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  function validatePassword(pw) {
    if (pw.length < 6) return 'A senha deve ter pelo menos 6 caracteres.'
    return null
  }

  async function handleRegister(e) {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.')
      return
    }

    const pwError = validatePassword(password)
    if (pwError) { setError(pwError); return }

    if (RECAPTCHA_SITE_KEY && RECAPTCHA_SITE_KEY !== 'your_recaptcha_site_key_here' && !captchaToken) {
      setError('Confirme que você não é um robô.')
      return
    }

    setLoading(true)

    const { error: err } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/verificar-email?confirmed=true`,
      },
    })

    if (err) {
      if (err.message.includes('already registered') || err.message.includes('User already registered')) {
        setError('Este e-mail já está cadastrado. Tente fazer login.')
      } else {
        setError(err.message)
      }
      recaptchaRef.current?.reset()
      setCaptchaToken(null)
      setLoading(false)
      return
    }

    navigate('/verificar-email', { state: { email } })
  }

  const EyeIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  )

  const EyeOffIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  )

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl glass mb-4">
            <span className="text-2xl">🌊</span>
          </div>
          <h1 className="text-2xl font-bold text-ink-800">Criar conta</h1>
          <p className="text-sm text-ink-400 mt-1">É grátis, leva 30 segundos</p>
        </div>

        <form onSubmit={handleRegister} className="glass rounded-3xl p-6 space-y-4">

          {error && (
            <div className="bg-red-50/80 text-red-700 text-sm px-3 py-2.5 rounded-xl border border-red-200">
              {error}
            </div>
          )}

          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">Nome completo</label>
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              required
              autoComplete="name"
              className="input"
              placeholder="Seu nome"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="input"
              placeholder="seu@email.com"
            />
          </div>

          {/* Senha */}
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">Senha</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="input pr-10"
                placeholder="Mínimo 6 caracteres"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700 transition-colors"
                aria-label={showPassword ? 'Ocultar senha' : 'Ver senha'}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          {/* Confirmar senha */}
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">Confirmar senha</label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="input pr-10"
                placeholder="Repita a senha"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700 transition-colors"
                aria-label={showConfirm ? 'Ocultar confirmação' : 'Ver confirmação'}
              >
                {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          {/* reCAPTCHA */}
          {RECAPTCHA_SITE_KEY && RECAPTCHA_SITE_KEY !== 'your_recaptcha_site_key_here' && (
            <div className="flex justify-center pt-1">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={RECAPTCHA_SITE_KEY}
                onChange={token => setCaptchaToken(token)}
                onExpired={() => setCaptchaToken(null)}
                theme="light"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-sand-100 border-t-transparent rounded-full animate-spin" />
                Criando conta...
              </>
            ) : 'Criar conta'}
          </button>

          <p className="text-xs text-ink-400 text-center pt-1">
            Ao criar uma conta você concorda com nossos termos de uso.
          </p>

        </form>

        {/* Rodapé */}
        <p className="text-center text-sm text-ink-500 mt-6">
          Já tem conta?{' '}
          <Link to="/login" className="font-semibold text-ink-700 hover:text-ink-900 underline underline-offset-2">
            Entrar
          </Link>
        </p>

      </div>
    </div>
  )
}
