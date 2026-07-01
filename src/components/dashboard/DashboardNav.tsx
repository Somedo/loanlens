'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { visibleMenuItems } from '@/components/dashboard/menuItems'

export default function DashboardNav({ user }: { user: any }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const canLend = user?.company?.can_lend ?? false
  const canBroker = user?.company?.can_broker ?? false
  const items = visibleMenuItems(canLend, canBroker)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-sidebar-border bg-sidebar px-6 pb-4">
        <div className="flex h-16 shrink-0 items-center gap-2">
          <span className="inline-block w-[18px] h-[18px] rounded-[5px] relative" style={{ background: 'var(--primary)' }}>
            <span className="absolute inset-[5px] rounded-[2px] border-[1.5px]" style={{ borderColor: 'var(--sidebar)' }} />
          </span>
          <h1 className="text-xl font-bold tracking-[-0.03em] text-sidebar-foreground">LoanLens</h1>
        </div>

        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {items.map((item) => {
                  if (item.comingSoon) {
                    return (
                      <li key={item.href}>
                        <span className="group flex items-center justify-between gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-muted-foreground/50 cursor-default">
                          {item.label}
                          <span className="text-[10px] font-medium uppercase tracking-wide rounded px-1.5 py-0.5" style={{ background: 'var(--accent)', color: 'var(--primary)' }}>
                            Soon
                          </span>
                        </span>
                      </li>
                    )
                  }
                  const isActive = pathname === item.href
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors ${
                          isActive
                            ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                            : 'text-muted-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent'
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </li>

            <li className="mt-auto">
              <div className="border-t border-sidebar-border pt-4">
                <div className="mb-4">
                  <p className="text-xs text-muted-foreground">Company</p>
                  <p className="text-sm font-medium text-sidebar-foreground">
                    {user?.company?.name || 'Your Company'}
                  </p>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-muted-foreground">Logged in as</p>
                  <p className="text-sm font-medium text-sidebar-foreground">
                    {user?.email || 'User'}
                  </p>
                </div>

                <button
                  onClick={handleLogout}
                  className="group flex w-full gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-muted-foreground hover:text-destructive hover:bg-accent transition-colors"
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
