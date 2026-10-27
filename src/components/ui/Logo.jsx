// Marca OndeVou — "Onde" + "Vou" em destaque + pin

export function PinMark({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M12 2C7.58 2 4 5.52 4 9.86c0 5.6 6.63 11.43 7.3 12a1.06 1.06 0 001.4 0C13.37 21.29 20 15.46 20 9.86 20 5.52 16.42 2 12 2zm0 11a3 3 0 110-6 3 3 0 010 6z"
      />
    </svg>
  )
}

export default function Logo({ className = '' }) {
  return (
    <span className={`inline-flex items-start font-extrabold tracking-tight leading-none ${className}`}>
      <span className="text-ink-800 dark:text-sand-100">Onde</span>
      <span className="text-rust-500 dark:text-rust-400">Vou</span>
      <PinMark className="w-[0.55em] h-[0.55em] -mt-[0.1em] ml-[0.04em] text-rust-500 dark:text-rust-400" />
    </span>
  )
}
