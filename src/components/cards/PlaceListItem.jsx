import { useState } from 'react'
import { IcMap } from '../ui/Icons'
import { getPhotoUrl, typeLabel } from '../../lib/googlePlaces'
import { formatDistance } from '../../lib/geolocation'

// Item da lista de locais do Google Places — abre no Google Maps
export default function PlaceListItem({ place, hasEvent }) {
  const [imgErr, setImgErr] = useState(false)
  const name     = place.displayName?.text ?? 'Local'
  const photo    = (!imgErr && place.photos?.[0]?.name)
    ? getPhotoUrl(place.photos[0].name, 200)
    : null
  const isOpen   = place.currentOpeningHours?.openNow
  const type     = typeLabel(place.primaryType)
  const distance = place._distance != null ? formatDistance(place._distance) : null

  function openMaps() {
    if (place.googleMapsUri) window.open(place.googleMapsUri, '_blank', 'noopener')
  }

  return (
    <div
      onClick={openMaps}
      className="card flex items-center gap-3 p-3 cursor-pointer active:scale-[0.98] transition-transform relative"
    >
      {/* Foto miniatura */}
      <div className="w-14 h-14 rounded-xl overflow-hidden bg-sand-200 dark:bg-ink-800 flex-none">
        {photo ? (
          <img
            src={photo}
            alt={name}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={() => setImgErr(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <IcMap className="w-5 h-5 text-sand-400 dark:text-ink-600" />
          </div>
        )}
      </div>

      {/* Informações */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-ink-800 dark:text-sand-100 line-clamp-1">{name}</p>
        <p className="text-xs text-ink-400 dark:text-ink-500 mt-0.5">
          <span className="capitalize">{type}</span>
          {distance && ` · ${distance}`}
        </p>
        {isOpen !== undefined && (
          <div className="flex items-center gap-1.5 mt-1.5">
            <span
              className="w-1.5 h-1.5 rounded-full flex-none"
              style={{ background: isOpen ? '#22c55e' : '#f87171' }}
            />
            <span className="text-xs text-ink-500 dark:text-ink-400">
              {isOpen ? 'Aberto' : 'Fechado'}
            </span>
          </div>
        )}
      </div>

      {/* Bolinha piscando — evento nesta semana neste local */}
      {hasEvent && (
        <span
          className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full animate-pulse"
          style={{ background: '#ffe000', boxShadow: '0 0 0 2px rgba(0,0,0,0.12)' }}
          title="Tem evento essa semana"
        />
      )}
    </div>
  )
}
