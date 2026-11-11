import { IcMic } from '../ui/Icons'

// Tarja dos bares: avisa se hoje tem cover artístico (couvert pela música ao vivo)
export default function CoverBand({ cover, className = '' }) {
  return (
    <p className={`cover-band ${cover ? 'has-cover' : 'no-cover'} ${className}`}>
      <IcMic className="w-3 h-3 flex-none" />
      {cover ? 'Cover artístico hoje' : 'Sem cover artístico hoje'}
    </p>
  )
}
