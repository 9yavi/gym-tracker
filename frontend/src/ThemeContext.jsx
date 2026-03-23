import { createContext, useContext, useState } from 'react'
import { darkTheme, lightTheme } from './theme'

const ThemeContext = createContext(darkTheme)
const ThemeToggleContext = createContext(null)
const ThemeModeContext = createContext('dark')

export function ThemeProvider({ children }) {
  const saved = localStorage.getItem('theme_mode') || 'dark'
  const [mode, setMode] = useState(saved)
  const T = mode === 'dark' ? darkTheme : lightTheme

  function toggle() {
    const next = mode === 'dark' ? 'light' : 'dark'
    setMode(next)
    localStorage.setItem('theme_mode', next)
  }

  return (
    <ThemeModeContext.Provider value={mode}>
      <ThemeToggleContext.Provider value={toggle}>
        <ThemeContext.Provider value={T}>
          {children}
        </ThemeContext.Provider>
      </ThemeToggleContext.Provider>
    </ThemeModeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}

export function useThemeToggle() {
  return useContext(ThemeToggleContext)
}

export function useThemeMode() {
  return useContext(ThemeModeContext)
}
