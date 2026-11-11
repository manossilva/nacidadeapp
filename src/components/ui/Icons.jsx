// Flat SVG icons — substitutos dos emojis em todo o app

export const IcSun = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <circle cx="12" cy="12" r="4" />
    <path strokeLinecap="round" d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
)

export const IcMoon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
)

export const IcCircle = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="9" />
  </svg>
)

export const IcPin = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

export const IcGlobe = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <circle cx="12" cy="12" r="10" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
  </svg>
)

export const IcStar = ({ className = 'w-5 h-5', filled = false }) => (
  <svg className={className} fill={filled ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
)

export const IcParty = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3M3 12a9 9 0 1018 0A9 9 0 003 12z" />
  </svg>
)

export const IcMusic = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
  </svg>
)

export const IcCross = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v8m0 4v8M4 8h8m4 0h4M4 16h4m4 0h8" />
  </svg>
)

export const IcUsers = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

export const IcSettings = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

export const IcUser = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
)

export const IcKey = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
  </svg>
)

export const IcLogout = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
)

export const IcInfo = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

export const IcSearch = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)

export const IcShare = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
  </svg>
)

export const IcMap = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
  </svg>
)

export const IcRoute = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
  </svg>
)

export const IcCamera = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

export const IcChevronRight = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
)

export const IcCheck = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
)

export const IcWave = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 15c.8-.8 2-.8 3 0s2.2.8 3 0 2-.8 3 0 2.2.8 3 0 2-.8 3 0M3 9c.8-.8 2-.8 3 0s2.2.8 3 0 2-.8 3 0 2.2.8 3 0 2-.8 3 0" />
  </svg>
)

// ── Categorias da Home ──

export const IcChurch = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v4M10 4h4M6 21V11l6-5 6 5v10M3 21h18M10 21v-3a2 2 0 014 0v3" />
  </svg>
)

export const IcBeer = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 9h10v10a2 2 0 01-2 2H7a2 2 0 01-2-2V9zM15 11.5h2a2 2 0 012 2v1.5a2 2 0 01-2 2h-2M5 9a2.5 2.5 0 012.6-3.4 3 3 0 014.9-.6A2.5 2.5 0 0115 9M8.5 13v4.5M11.5 13v4.5" />
  </svg>
)

export const IcUtensils = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 3v7a2 2 0 002 2v9M10 3v7a2 2 0 01-2 2M8 3v5M17 21V3c-2 1.5-3 4-3 7v3h3" />
  </svg>
)

export const IcMasks = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h11v6.5a5.5 5.5 0 01-11 0V4zM6 8.5h.01M11 8.5h.01M6.5 12.5a3 3 0 004 0" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 9h7v6.5a5.5 5.5 0 01-9.6 3.7M16.5 13h.01M19 13h.01M16 17.5a3 3 0 013.5 0" />
  </svg>
)

export const IcLeaf = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 19C5 10.5 10 5 19.5 4.5 20 14 14.5 19 6 19H5zM5 19l8-8" />
  </svg>
)

export const IcChevronLeft = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
)

// ── Agenda, lojas e órgão público ──

export const IcLandmark = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.5L12 4l9 5.5M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 21h18" />
  </svg>
)

export const IcMegaphone = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 10v4a1 1 0 001 1h2l1.5 5h2.5l-1.2-5H11l7 4V5l-7 4H5a1 1 0 00-1 1zM21 10.5v3" />
  </svg>
)

export const IcPhone = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h2.3a1 1 0 01.95.68l1.3 3.9a1 1 0 01-.5 1.2l-1.8.9a11 11 0 005.07 5.07l.9-1.8a1 1 0 011.2-.5l3.9 1.3a1 1 0 01.68.95V19a2 2 0 01-2 2h-1C9.72 21 3 14.28 3 6V5z" />
  </svg>
)

export const IcChat = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.5a8.5 8.5 0 01-12.4 7.55L3 21l1.95-5.6A8.5 8.5 0 1121 11.5z" />
  </svg>
)

export const IcClock = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <circle cx="12" cy="12" r="9" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 2" />
  </svg>
)

export const IcCalendar = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

export const IcStore = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 9.5V20h16V9.5M3 9.5L5 4h14l2 5.5a3 3 0 01-6 0 3 3 0 01-6 0 3 3 0 01-6 0zM10 20v-5h4v5" />
  </svg>
)

// ── Subgrupos das sessões ──
const sub = (name, children) => {
  const Icon = ({ className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  )
  Icon.displayName = name
  return Icon
}

// Gastronomia
export const IcCoffee = sub('IcCoffee', <>
  <path d="M6 2v2M10 2v2M14 2v2" />
  <path d="M16 8a1 1 0 011 1v8a4 4 0 01-4 4H7a4 4 0 01-4-4V9a1 1 0 011-1h14a4 4 0 110 8h-1" />
</>)
export const IcIceCream = sub('IcIceCream', <>
  <path d="M7 11l4.08 10.35a1 1 0 001.84 0L17 11" />
  <path d="M17 7A5 5 0 007 7" />
  <path d="M17 7a2 2 0 010 4H7a2 2 0 010-4" />
</>)
export const IcBurger = sub('IcBurger', <>
  <path d="M4 10.5C4 7.5 7.6 5 12 5s8 2.5 8 5.5H4z" />
  <path d="M3.5 14h17" />
  <path d="M4.5 17.5h15v.5a2 2 0 01-2 2h-11a2 2 0 01-2-2v-.5z" />
</>)
export const IcCake = sub('IcCake', <>
  <path d="M20 21v-8a2 2 0 00-2-2H6a2 2 0 00-2 2v8" />
  <path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1" />
  <path d="M2 21h20M7 8v3M12 8v3M17 8v3M7 4h.01M12 4h.01M17 4h.01" />
</>)
export const IcApple = sub('IcApple', <>
  <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0017 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 00-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06z" />
  <path d="M10 2c1 .5 2 2 2 5" />
</>)
export const IcTray = sub('IcTray', <>
  <path d="M3 17h18" />
  <path d="M5 17a7 7 0 0114 0" />
  <path d="M12 7v3M10.5 7h3" />
  <path d="M4 20.5h16" />
</>)

// Cultura
export const IcFilm = sub('IcFilm', <>
  <path d="M20.2 6L3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3z" />
  <path d="M6.2 5.3l3.1 3.9M12.4 3.4l3.1 4" />
  <path d="M3 11h18v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
</>)
export const IcLibrary = sub('IcLibrary', <>
  <path d="M16 6l4 14M12 6v14M8 8v12M4 4v16" />
</>)
export const IcBookStack = sub('IcBookStack', <>
  <rect x="4" y="15.5" width="16" height="4.5" rx="1" />
  <rect x="6.5" y="11" width="13" height="4.5" rx="1" />
  <rect x="5" y="6.5" width="12" height="4.5" rx="1" />
</>)
export const IcBookOpen = sub('IcBookOpen', <>
  <path d="M12 7v14" />
  <path d="M3 18a1 1 0 01-1-1V4a1 1 0 011-1h5a4 4 0 014 4 4 4 0 014-4h5a1 1 0 011 1v13a1 1 0 01-1 1h-6a3 3 0 00-3 3 3 3 0 00-3-3z" />
</>)

// Bem-estar
export const IcDumbbell = sub('IcDumbbell', <>
  <rect x="5" y="7" width="3" height="10" rx="1" />
  <rect x="16" y="7" width="3" height="10" rx="1" />
  <path d="M8 12h8M2.5 10v4M21.5 10v4" />
</>)
export const IcPaw = sub('IcPaw', <>
  <circle cx="11" cy="4" r="2" />
  <circle cx="18" cy="8" r="2" />
  <circle cx="20" cy="16" r="2" />
  <path d="M9 10a5 5 0 015 5v3.5a3.5 3.5 0 01-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 015.5 10z" />
</>)
export const IcLotus = sub('IcLotus', <>
  <path d="M12 5c2.2 2.4 3.3 5 3.3 7.5S13.5 17 12 18c-1.5-1-3.3-3-3.3-5.5S9.8 7.4 12 5z" />
  <path d="M8.9 11.6C7.2 10.4 5.2 9.8 3 9.8c0 3.8 2.8 7.6 9 8.2" />
  <path d="M15.1 11.6c1.7-1.2 3.7-1.8 5.9-1.8 0 3.8-2.8 7.6-9 8.2" />
  <path d="M7 21h10" />
</>)
export const IcStones = sub('IcStones', <>
  <ellipse cx="12" cy="18" rx="7" ry="2.6" />
  <ellipse cx="12" cy="12.4" rx="5" ry="2.3" />
  <ellipse cx="12" cy="7.3" rx="3.2" ry="2" />
</>)
export const IcScissors = sub('IcScissors', <>
  <circle cx="6" cy="6" r="3" />
  <circle cx="6" cy="18" r="3" />
  <path d="M8.12 8.12L12 12M20 4L8.12 15.88M14.8 14.8L20 20" />
</>)

// Religião
export const IcLatinCross = sub('IcLatinCross', <>
  <path d="M12 3v18M7 8.5h10" />
</>)
export const IcBible = sub('IcBible', <>
  <path d="M6.5 3H19v18H6.5A2.5 2.5 0 014 18.5v-13A2.5 2.5 0 016.5 3z" />
  <path d="M4 18.5A2.5 2.5 0 016.5 16H19" />
  <path d="M12 6.5v5.5M10 8.5h4" />
</>)
export const IcSparkles = sub('IcSparkles', <>
  <path d="M9.937 15.5A2 2 0 008.5 14.063l-6.135-1.582a.5.5 0 010-.962L8.5 9.936A2 2 0 009.937 8.5l1.582-6.135a.5.5 0 01.963 0L14.063 8.5A2 2 0 0015.5 9.937l6.135 1.581a.5.5 0 010 .964L15.5 14.063a2 2 0 00-1.437 1.437l-1.582 6.135a.5.5 0 01-.963 0z" />
  <path d="M20 3v4M22 5h-4M4 17v2M5 18H3" />
</>)
export const IcDrum = sub('IcDrum', <>
  <ellipse cx="12" cy="6" rx="6" ry="2.5" />
  <path d="M6 6l1.6 12.6c.2 1.3 2 2.4 4.4 2.4s4.2-1.1 4.4-2.4L18 6" />
  <path d="M9.2 8.3l.9 12.4M14.8 8.3l-.9 12.4" />
</>)

// Tarja dos bares
export const IcMic = sub('IcMic', <>
  <rect x="9" y="2.5" width="6" height="11" rx="3" />
  <path d="M5.5 11a6.5 6.5 0 0013 0M12 17.5V21M8.5 21h7" />
</>)
