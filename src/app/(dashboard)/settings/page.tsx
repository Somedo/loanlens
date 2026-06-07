'use client'

import { ThemeSelector } from '@/components/settings/ThemeSelector'

export default function SettingsPage() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-text-dark">Settings</h1>

      <div className="bg-white rounded-lg shadow-md p-8 mb-6 border border-gray-200">
        <ThemeSelector />
      </div>

      {/* Add other settings sections here in the future */}
    </div>
  )
}