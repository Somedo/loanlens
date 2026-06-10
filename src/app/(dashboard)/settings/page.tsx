'use client'

import { ThemeSelector } from '@/components/settings/ThemeSelector'

export default function SettingsPage() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-foreground">Settings</h1>

      <div className="lens-card p-8 mb-6">
        <ThemeSelector />
      </div>
    </div>
  )
}