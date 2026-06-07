'use client'

import { useTheme, type ThemeName } from '@/lib/theme/ThemeContext'
import { useState } from 'react'

const THEMES: Array<{ id: ThemeName; name: string; emoji: string; description: string }> = [
  { id: 'dark-pro', name: 'Professional Dark', emoji: '🌙', description: 'Sophisticated and elegant' },
  { id: 'modern-blue', name: 'Modern Blue', emoji: '🔵', description: 'Clean and trustworthy' },
  { id: 'minimal-green', name: 'Minimal Green', emoji: '🌿', description: 'Fresh and calm' },
  { id: 'luxury-gold', name: 'Luxury Gold', emoji: '✨', description: 'Premium and high-end' },
  { id: 'tech-purple', name: 'Tech Purple', emoji: '💜', description: 'Modern and innovative' },
]

export function ThemeSelector() {
  const { theme, setTheme } = useTheme()
  const [saving, setSaving] = useState(false)

  const handleThemeChange = async (newTheme: ThemeName) => {
    setSaving(true)
    await setTheme(newTheme)
    setSaving(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Theme Preference</h3>
        <p className="text-sm text-gray-600 mb-4">
          Choose your preferred appearance theme. Your selection will be saved instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {THEMES.map((themeOption) => (
          <button
            key={themeOption.id}
            onClick={() => handleThemeChange(themeOption.id)}
            disabled={saving}
            className={`
              p-4 rounded-lg border-2 transition-all text-left
              ${theme === themeOption.id
                ? 'border-primary bg-light-bg shadow-md'
                : 'border-gray-200 bg-white hover:border-primary'
              }
              ${saving ? 'opacity-50 cursor-wait' : 'cursor-pointer'}
            `}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{themeOption.emoji}</span>
              <div className="flex-1">
                <h4 className="font-semibold text-text-dark">{themeOption.name}</h4>
                <p className="text-xs text-gray-500">{themeOption.description}</p>
              </div>
              {theme === themeOption.id && (
                <div className="text-primary text-lg">✓</div>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
        <p className="text-gray-700">
          <strong>💡 Tip:</strong> Your theme preference is saved automatically. 
          Changes apply instantly and will persist when you log back in.
        </p>
      </div>
    </div>
  )
}