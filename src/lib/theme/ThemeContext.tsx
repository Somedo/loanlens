'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

export type ThemeName = 'modern-blue' | 'dark-pro' | 'minimal-green' | 'luxury-gold' | 'tech-purple'

interface ThemeContextType {
  theme: ThemeName
  setTheme: (theme: ThemeName) => Promise<void>
  isLoading: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>('dark-pro')
  const [isLoading, setIsLoading] = useState(true)

  // Load theme on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        // Try to get from localStorage first (instant)
        const savedTheme = localStorage.getItem('theme') as ThemeName | null
        if (savedTheme && ['modern-blue', 'dark-pro', 'minimal-green', 'luxury-gold', 'tech-purple'].includes(savedTheme)) {
          setThemeState(savedTheme)
          applyTheme(savedTheme)
          setIsLoading(false)
          return
        }

        // Default to dark-pro
        applyTheme('dark-pro')
        setIsLoading(false)
      } catch (error) {
        console.error('Failed to load theme:', error)
        applyTheme('dark-pro')
        setIsLoading(false)
      }
    }

    loadTheme()
  }, [])

  const setTheme = async (newTheme: ThemeName) => {
    try {
      // Update state immediately
      setThemeState(newTheme)
      applyTheme(newTheme)
      localStorage.setItem('theme', newTheme)

      // Save to database (fire and forget)
      const response = await fetch('/api/user-preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: newTheme })
      })

      if (!response.ok) {
        console.error('Failed to save theme to database')
      }
    } catch (error) {
      console.error('Failed to save theme:', error)
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

// Apply theme to document
function applyTheme(theme: ThemeName) {
  document.documentElement.setAttribute('data-theme', theme)
  document.body.className = `theme-${theme}`
}