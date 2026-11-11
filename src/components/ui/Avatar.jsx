import { useState } from 'react'

// Avatar redondo no estilo do Instagram: logo/foto ou iniciais, com anel amarelo
export default function Avatar({ name = '', src = null, className = 'w-10 h-10' }) {
  const [err, setErr] = useState(false)
  const initials = name.split(/\s+/).filter(w => w.length > 2).slice(0, 2).map(w => w[0]).join('').toUpperCase()

  return (
    <span className={`flex-none rounded-full p-[2px] bg-brand-400 ${className}`}>
      <span
        className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-ink-900 text-brand-400 font-extrabold leading-none border-2 border-sand-50 dark:border-ink-900"
        style={{ containerType: 'inline-size' }}
      >
        {src && !err ? (
          <img src={src} alt="" className="w-full h-full object-cover" onError={() => setErr(true)} />
        ) : (
          <span style={{ fontSize: '40cqw' }}>{initials || name[0]?.toUpperCase() || '•'}</span>
        )}
      </span>
    </span>
  )
}
