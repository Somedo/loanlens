'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

export type ThemeName = 'oxblood' | 'modern-blue' | 'dark-pro' | 'minimal-green' | 'luxury-gold' | 'tech-purple'

const VALID_THEMES: ThemeName[] = ['oxblood', 'modern-blue', 'dark-pro', 'minimal-green', 'luxury-gold', 'tech-purple']

interface ThemeContextType {
  theme: ThemeName
  setTheme: (theme: ThemeName) => Promise<void>
  isLoading: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>('oxblood')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadTheme = async () => {
      // 1. Instant: apply localStorage theme to avoid a flash
      try {
        const savedTheme = localStorage.getItem('theme') as ThemeName | null
        if (savedTheme && VALID_THEMES.includes(savedTheme)) {
          setThemeState(savedTheme)
          applyTheme(savedTheme)
        } else {
          applyTheme('oxblood')
        }
      } catch {
        applyTheme('oxblood')
      }
      setIsLoading(false)

      // 2. Reconcile: fetch the saved DB preference (source of truth across devices)
      try {
        const res = await fetch('/api/user-preferences')
        if (res.ok) {
          const data = await res.json()
          const dbTheme = data?.theme as ThemeName | undefined
          if (dbTheme && VALID_THEMES.includes(dbTheme)) {
            setThemeState(dbTheme)
            applyTheme(dbTheme)
            localStorage.setItem('theme', dbTheme)
          }
        }
      } catch {
        // offline or not logged in — localStorage value stands
      }
    }

    loadTheme()
  }, [])

  const setTheme = async (newTheme: ThemeName) => {
    // Apply immediately
    setThemeState(newTheme)
    applyTheme(newTheme)
    try {
      localStorage.setItem('theme', newTheme)
    } catch {}

    // Persist to database
    try {
      const response = await fetch('/api/user-preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: newTheme }),
      })
      if (!response.ok) {
        console.error('Theme saved locally, but database save failed')
      }
    } catch (error) {
      console.error('Theme saved locally, but database save failed:', error)
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isLoading }}>
      <div className={`theme-${theme}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

function applyTheme(theme: ThemeName) {
  document.documentElement.setAttribute('data-theme', theme)
  document.body.className = `theme-${theme}`
}
