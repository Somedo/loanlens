'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function DashboardNav({ user }: { user: any }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const navigation = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'New Leads', href: '/leads' },
  { name: 'Brokers', href: '/brokers' },
  { name: 'Add Loan', href: '/loans/new' },
  { name: 'Lender Entities', href: '/lender-entities'},
  { name: 'Solicitors', href: '/solicitors' },
  { name: 'All Loans', href: '/loans' },
  { name: 'Borrowers', href: '/borrowers' },
  { name: 'Properties', href: '/properties' },
  { name: 'Settings', href: '/settings' },
]

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
        <div className="flex h-16 shrink-0 items-center">
          <h1 className="text-2xl font-bold text-blue-600">LoanLens</h1>
        </div>

        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ${
                          isActive
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                        }`}
                      >
                        {item.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </li>

            <li className="mt-auto">
              <div className="border-t border-gray-200 pt-4">
                <div className="mb-4">
                  <p className="text-xs text-gray-500">Company</p>
                  <p className="text-sm font-medium text-gray-900">
                    {user?.company?.name || 'Your Company'}
                  </p>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-gray-500">Logged in as</p>
                  <p className="text-sm font-medium text-gray-900">
                    {user?.email || 'User'}
                  </p>
                </div>

                <button
                  onClick={handleLogout}
                  className="group flex w-full gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-700 hover:text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}