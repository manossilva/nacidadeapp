import { useLayoutEffect, useRef, useState } from 'react'

// Controle segmentado no estilo do iOS: a pílula amarela desliza até a opção
// escolhida em vez de trocar de lugar de uma vez. `value` fora das opções
// (ex.: raio escolhido no arraste) deixa o controle sem pílula.
export default function Segmented({ options, value, onChange, ariaLabel, className = '' }) {
  const root = useRef(null)
  const items = useRef({})
  const [thumb, setThumb] = useState(null)
  const [ready, setReady] = useState(false)

  useLayoutEffect(() => {
    const measure = () => {
      const el = items.current[value]
      setThumb(el ? { x: el.offsetLeft, width: el.offsetWidth } : null)
    }
    measure()
    // Fonte carregando ou tela girando mudam as larguras
    const observer = new ResizeObserver(measure)
    observer.observe(root.current)
    return () => observer.disconnect()
  }, [value, options])

  // A pílula aparece já no lugar; só passa a deslizar da segunda posição em diante
  useLayoutEffect(() => {
    const frame = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <div ref={root} role="group" aria-label={ariaLabel} className={`segmented ${ready ? 'is-ready' : ''} ${className}`}>
      <span
        className="segmented-thumb"
        style={thumb ? { width: thumb.width, transform: `translateX(${thumb.x}px)` } : { opacity: 0 }}
      />
      {options.map(o => (
        <button
          key={o.id}
          ref={el => { items.current[o.id] = el }}
          type="button"
          onClick={() => onChange(o.id)}
          aria-pressed={value === o.id}
          className="segmented-item"
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
