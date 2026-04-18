import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageShell from '../components/layout/PageShell'
import { useCity } from '../hooks/useCity'
import { IcPin, IcStar, IcMap, IcRoute } from '../components/ui/Icons'

const ROTEIROS = [
  {
    id: 1,
    title: 'Aracaju em 1 dia',
    duration: '1 dia',
    difficulty: 'Fácil',
    stops: [
      { name: 'Orla de Atalaia', desc: 'Ponto de partida — café da manhã beira-mar', time: '08:00' },
      { name: 'Mercado Municipal', desc: 'Arte, artesanato e tapioca fresca', time: '10:00' },
      { name: 'Centro Histórico', desc: 'Catedral e Praça General Valadão', time: '12:00' },
      { name: 'Museu da Gente Sergipana', desc: 'Cultura sergipana interativa', time: '14:00' },
      { name: 'Aracaju Bugio', desc: 'Pôr do sol e frutos do mar', time: '17:30' },
    ],
    cover: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=600&q=80',
    tags: ['praias', 'cultura', 'gastronomia'],
  },
  {
    id: 2,
    title: 'Rota das Praias',
    duration: '2 dias',
    difficulty: 'Moderado',
    stops: [
      { name: 'Praia de Atalaia', desc: 'A mais famosa — boa para famílias', time: 'Dia 1' },
      { name: 'Praia do Refúgio', desc: 'Mais tranquila, ótima para mergulho', time: 'Dia 1' },
      { name: 'Praia de Caueira', desc: 'Piscinas naturais e coqueiros', time: 'Dia 2' },
      { name: 'Praia do Saco', desc: 'Paradisíaca, vale a viagem', time: 'Dia 2' },
    ],
    cover: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
    tags: ['praias', 'natureza', 'relaxar'],
  },
  {
    id: 3,
    title: 'Cultura Sergipana',
    duration: '1 dia',
    difficulty: 'Fácil',
    stops: [
      { name: 'Museu da Gente Sergipana', desc: 'Melhor ponto de partida cultural', time: '09:00' },
      { name: 'Centro de Criatividade', desc: 'Arte contemporânea local', time: '11:00' },
      { name: 'Mercado Thales Ferraz', desc: 'Comida típica e artesanato', time: '13:00' },
      { name: 'Teatro Atheneu', desc: 'Arquitetura histórica', time: '15:00' },
      { name: 'Casa de Cultura', desc: 'Forró pé-de-serra à noite', time: '19:00' },
    ],
    cover: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&q=80',
    tags: ['museus', 'história', 'forró'],
  },
]

function DifficultyBadge({ level }) {
  const colors = {
    Fácil: 'bg-green-500/15 text-green-700 dark:text-green-400',
    Moderado: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
    Difícil: 'bg-red-500/15 text-red-700 dark:text-red-400',
  }
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${colors[level] ?? ''}`}>
      {level}
    </span>
  )
}

export default function Roteiros() {
  const { city } = useCity()
  const [selected, setSelected] = useState(null)

  if (selected !== null) {
    const r = ROTEIROS[selected]
    return (
      <PageShell>
        <button
          onClick={() => setSelected(null)}
          className="flex items-center gap-1.5 text-sm font-medium text-ink-600 dark:text-sand-400 pt-4 pb-2"
        >
          ← Roteiros
        </button>

        {r.cover && (
          <div className="rounded-2xl overflow-hidden mb-5" style={{ aspectRatio: '16/7' }}>
            <img src={r.cover} alt={r.title} className="w-full h-full object-cover" />
          </div>
        )}

        <h1 className="text-2xl font-bold text-ink-800 dark:text-sand-100 mb-1">{r.title}</h1>
        <div className="flex items-center gap-2 mb-5">
          <span className="text-xs text-ink-500 dark:text-ink-400">{r.duration}</span>
          <span className="text-ink-300">·</span>
          <DifficultyBadge level={r.difficulty} />
        </div>

        <div className="space-y-3 mb-8">
          {r.stops.map((stop, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-ink-800 dark:bg-white flex items-center justify-center flex-none">
                  <span className="text-xs font-bold text-white dark:text-ink-900">{i + 1}</span>
                </div>
                {i < r.stops.length - 1 && <div className="w-px flex-1 bg-ink-200 dark:bg-ink-700 mt-1" />}
              </div>
              <div className="glass rounded-2xl p-3 flex-1 mb-2">
                <div className="flex items-center justify-between mb-0.5">
                  <p className="font-semibold text-sm text-ink-800 dark:text-sand-100">{stop.name}</p>
                  <span className="text-[10px] font-medium text-ink-400">{stop.time}</span>
                </div>
                <p className="text-xs text-ink-500 dark:text-ink-400">{stop.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell>
      <div className="pt-5 pb-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-ink-400 mb-1">Roteiros</p>
        <h1 className="text-2xl font-bold text-ink-800 dark:text-sand-100">
          {city ? `Explore ${city}` : 'Itinerários prontos'}
        </h1>
        <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">Roteiros com paradas, horários e dicas</p>
      </div>

      <div className="space-y-4">
        {ROTEIROS.map((r, i) => (
          <button
            key={r.id}
            onClick={() => setSelected(i)}
            className="w-full text-left glass rounded-2xl overflow-hidden active:scale-[0.98] transition-transform"
          >
            {r.cover && (
              <div className="relative" style={{ aspectRatio: '16/7' }}>
                <img src={r.cover} alt={r.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(15,22,10,0.6) 0%, transparent 60%)' }} />
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="font-bold text-base text-white">{r.title}</h3>
                </div>
              </div>
            )}
            <div className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IcRoute className="w-4 h-4 text-ink-500" />
                <span className="text-xs text-ink-500 dark:text-ink-400">{r.stops.length} paradas · {r.duration}</span>
              </div>
              <div className="flex gap-1.5 flex-wrap justify-end">
                <DifficultyBadge level={r.difficulty} />
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="h-8" />
    </PageShell>
  )
}
