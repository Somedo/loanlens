'use client'

import { useTheme, type ThemeName } from '@/lib/theme/ThemeContext'
import { useState } from 'react'
import { Check } from 'lucide-react'

const THEMES: Array<{ id: ThemeName; name: string; description: string; swatch: string[] }> = [
  { id: 'oxblood', name: 'Workbench Oxblood', description: 'Parchment and burgundy ledger', swatch: ['#F1EBDD', '#6E1E2A', '#241F1A'] },
  { id: 'dark-pro', name: 'Professional Dark', description: 'Sophisticated and elegant', swatch: ['#0F172A', '#38BDF8', '#1E293B'] },
  { id: 'modern-blue', name: 'Modern Blue', description: 'Clean and trustworthy', swatch: ['#F4F7FB', '#2563EB', '#1F2937'] },
  { id: 'minimal-green', name: 'Minimal Green', description: 'Fresh and calm', swatch: ['#F0F7F2', '#047857', '#1A2E22'] },
  { id: 'luxury-gold', name: 'Luxury Gold', description: 'Premium and high-end', swatch: ['#F7F1E1', '#A67C12', '#3A2E16'] },
  { id: 'tech-purple', name: 'Tech Purple', description: 'Modern and innovative', swatch: ['#15101F', '#A78BFA', '#221733'] },
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
        <h3 className="text-lg font-semibold mb-2 text-foreground">Theme Preference</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Choose your preferred appearance. Your selection is saved instantly.
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
                ? 'border-primary bg-accent shadow-md'
                : 'border-border bg-card hover:border-primary'
              }
              ${saving ? 'opacity-50 cursor-wait' : 'cursor-pointer'}
            `}
          >
            <div className="flex items-center gap-3">
              {/* palette swatch */}
              <div className="flex rounded-md overflow-hidden border border-border shrink-0">
                {themeOption.swatch.map((c, i) => (
                  <span key={i} className="w-4 h-9" style={{ background: c }} />
                ))}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-foreground">{themeOption.name}</h4>
                <p className="text-xs text-muted-foreground">{themeOption.description}</p>
              </div>
              {theme === themeOption.id && (
                <Check className="w-5 h-5 text-primary shrink-0" strokeWidth={2.5} />
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="rounded-lg p-4 text-sm border border-border bg-secondary">
        <p className="text-secondary-foreground">
          <strong>Tip:</strong> Your theme is saved automatically and applies instantly.
          It will persist when you log back in.
        </p>
      </div>
    </div>
  )
}
