import { useState, useEffect } from 'react'

// 'light' | 'dark' | 'black'
function applyTheme(theme) {
  const root = document.documentElement
  root.classList.remove('dark', 'black')
  if (theme === 'dark') root.classList.add('dark')
  if (theme === 'black') root.classList.add('dark', 'black')
  localStorage.setItem('theme', theme)
}

export function useTheme() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('theme') || 'light'
  )

  useEffect(() => { applyTheme(theme) }, [theme])

  function cycleTheme() {
    setTheme(t => ({ light: 'dark', dark: 'black', black: 'light' }[t]))
  }

  return [theme, cycleTheme, setTheme]
}
