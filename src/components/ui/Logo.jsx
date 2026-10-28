// Marca OndeVou — ícone amarelo com pin preto + "OndeVou"

// O miolo usa .pin-dot (muda por tema); no ícone ele é amarelo para parecer recortado
export function PinMark({ className = 'w-4 h-4', dotClassName = 'pin-dot' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2C7.58 2 4 5.52 4 9.86c0 5.6 6.63 11.43 7.3 12a1.06 1.06 0 001.4 0C13.37 21.29 20 15.46 20 9.86 20 5.52 16.42 2 12 2z"
      />
      <circle cx="12" cy="10" r="3" className={dotClassName} />
    </svg>
  )
}

// Mesmo desenho do ícone do app (public/icons) — igual em todos os temas
export function AppIcon({ className = 'w-7 h-7' }) {
  return (
    <span className={`inline-flex flex-none items-center justify-center rounded-[28%] bg-brand-400 ${className}`}>
      <PinMark className="w-[62%] h-[62%] text-ink-950" dotClassName="fill-brand-400" />
    </span>
  )
}

export default function Logo({ className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2 leading-none tracking-tight ${className}`}>
      <AppIcon className="w-7 h-7" />
      <span className="text-ink-900 dark:text-sand-50">
        <span className="font-semibold">Onde</span>
        <span className="font-black">Vou</span>
      </span>
    </span>
  )
}
