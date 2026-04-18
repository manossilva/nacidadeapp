import { useState, useEffect, useRef } from 'react'

const SUGGESTIONS = [
  'Aracaju', 'Salvador', 'Maceió', 'Recife', 'Fortaleza',
  'Natal', 'João Pessoa', 'Teresina', 'São Luís', 'Macapá',
]

export default function CityModal({ current, onSave, onClose }) {
  const [value, setValue] = useState(current || '')
  const inputRef = useRef(null)

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100)
  }, [])

  function handleSave() {
    if (value.trim()) {
      onSave(value.trim())
      onClose()
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Bottom sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl p-6 pb-10 glass"
        style={{ background: 'rgba(245,240,232,0.96)' }}
      >
        <div className="dark:hidden" />
        {/* Handle */}
        <div className="w-10 h-1 rounded-full bg-ink-200 mx-auto mb-6" />

        <h2 className="font-bold text-lg text-ink-800 mb-4">Em qual cidade você está?</h2>

        <div className="relative mb-4">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
            placeholder="Digite a cidade..."
            className="input"
          />
        </div>

        {/* Sugestões */}
        <div className="flex flex-wrap gap-2 mb-6">
          {SUGGESTIONS.map(s => (
            <button
              key={s}
              onClick={() => setValue(s)}
              className={`pill transition-all ${value === s ? 'pill-active' : ''}`}
            >
              {s}
            </button>
          ))}
        </div>

        <button
          onClick={handleSave}
          disabled={!value.trim()}
          className="btn-primary disabled:opacity-40"
        >
          Confirmar
        </button>
      </div>
    </>
  )
}
