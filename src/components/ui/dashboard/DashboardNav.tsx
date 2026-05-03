'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function DashboardNav({ user }: { user: any }) {
  const pathname = usePathname()

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
        <div className="flex h-16 shrink-0 items-center">
          <h1 className="text-2xl font-bold text-blue-600">LoanLens</h1>
        </div>

        <nav className="flex flex-1 flex-col">
          <div className="text-sm text-gray-600 mb-4">
            <p>Company: {user?.company?.name || 'Your Company'}</p>
            <p className="mt-1">User: {user?.email}</p>
          </div>
        </nav>
      </div>
    </div>
  )
}