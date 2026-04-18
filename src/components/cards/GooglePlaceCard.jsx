import { useState } from 'react'
import { getPhotoUrl, priceLabel, typeLabel } from '../../lib/googlePlaces'
import { IcStar, IcPin, IcGlobe } from '../ui/Icons'
import { formatDistance } from '../../lib/geolocation'

function StarRating({ rating }) {
  if (!rating) return null
  return (
    <div className="flex items-center gap-1">
      <IcStar className="w-3 h-3 text-amber-500" filled />
      <span className="text-xs font-semibold text-ink-700 dark:text-sand-200">{rating.toFixed(1)}</span>
    </div>
  )
}

export default function GooglePlaceCard({ place }) {
  const [imgError, setImgError] = useState(false)
  const {
    displayName,
    formattedAddress,
    shortFormattedAddress,
    rating,
    userRatingCount,
    priceLevel,
    primaryType,
    photos,
    currentOpeningHours,
    googleMapsUri,
    _distance,
  } = place

  const name   = displayName?.text ?? 'Local'
  const addr   = shortFormattedAddress ?? formattedAddress ?? ''
  const isOpen = currentOpeningHours?.openNow
  const photo  = (!imgError && photos?.[0]?.name) ? getPhotoUrl(photos[0].name, 400) : null
  const price  = priceLabel(priceLevel)
  const type   = typeLabel(primaryType)

  function openMaps() {
    if (googleMapsUri) window.open(googleMapsUri, '_blank', 'noopener')
  }

  return (
    <div
      onClick={openMaps}
      className="card block active:scale-[0.98] transition-transform cursor-pointer"
    >
      {/* Foto */}
      <div className="relative aspect-[4/3] bg-sand-200 dark:bg-ink-800 overflow-hidden">
        {photo ? (
          <img
            src={photo}
            alt={name}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <IcGlobe className="w-8 h-8 text-sand-400 dark:text-ink-600" />
          </div>
        )}

        {/* Badge aberto/fechado */}
        {isOpen !== undefined && (
          <span
            className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{
              background: isOpen ? 'rgba(34,197,94,0.85)' : 'rgba(239,68,68,0.85)',
              color: '#fff',
              backdropFilter: 'blur(4px)',
            }}
          >
            {isOpen ? 'Aberto' : 'Fechado'}
          </span>
        )}

        {/* Preço */}
        {price && (
          <span
            className="absolute bottom-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(255,252,247,0.8)', color: '#3d5733', backdropFilter: 'blur(4px)' }}
          >
            {price}
          </span>
        )}
      </div>

      {/* Conteúdo */}
      <div className="p-3">
        <h3 className="font-semibold text-sm leading-tight text-ink-800 dark:text-sand-100 line-clamp-1">
          {name}
        </h3>

        <div className="flex items-center justify-between mt-1">
          <StarRating rating={rating} />
          {userRatingCount > 0 && (
            <span className="text-[10px] text-ink-400 dark:text-ink-500">
              ({userRatingCount > 999 ? `${(userRatingCount/1000).toFixed(1)}k` : userRatingCount})
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 mt-1.5 text-xs text-ink-500 dark:text-ink-400">
          <IcPin className="w-3 h-3 flex-none" />
          <span className="truncate">{addr}</span>
        </div>

        <div className="flex items-center justify-between mt-1.5">
          <span className="text-[10px] font-medium text-ink-400 dark:text-ink-500 capitalize">{type}</span>
          {_distance != null && (
            <span className="text-[10px] font-semibold text-ink-500 dark:text-ink-400">
              {formatDistance(_distance)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
