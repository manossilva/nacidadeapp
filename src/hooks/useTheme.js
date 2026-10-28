import { useState, useEffect } from 'react'

// 'light' | 'dark' | 'black'
// Cor da barra do navegador/app instalado acompanha o fundo de cada tema
const THEME_COLORS = { light: '#f7f2e8', dark: '#121211', black: '#000000' }

function applyTheme(theme) {
  const root = document.documentElement
  root.classList.remove('dark', 'black')
  if (theme === 'dark') root.classList.add('dark')
  if (theme === 'black') root.classList.add('dark', 'black')
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[theme] ?? THEME_COLORS.light)
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
