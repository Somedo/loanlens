'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { visibleMenuItems } from '@/components/dashboard/menuItems'

export default function DashboardHeader({ user }: { user: any }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const canLend = user?.company?.can_lend ?? false
  const canBroker = user?.company?.can_broker ?? false
  const items = visibleMenuItems(canLend, canBroker)

  const closeMenu = () => setMobileMenuOpen(false)

  return (
    <>
      {/* Header */}
      <div className="h-16 bg-sidebar border-b border-sidebar-border px-4 flex items-center justify-between sticky top-0 z-30">
        {/* Left: Hamburger + Title */}
        <div className="flex items-center gap-3">
          {/* Hamburger Button - shown below lg */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden flex flex-col justify-center items-center w-10 h-10 rounded-lg transition-all duration-200 cursor-pointer hover:bg-accent active:bg-muted group border-2 border-border hover:border-primary"
            aria-label="Toggle menu"
            title="Open menu"
          >
            <span className={`block w-6 h-0.5 rounded-full transition-all duration-300 bg-foreground ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 rounded-full mt-1.5 transition-all duration-300 bg-foreground ${mobileMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 rounded-full mt-1.5 transition-all duration-300 bg-foreground ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>

          {/* Title */}
          <h2 className="text-lg font-bold tracking-[-0.02em] text-sidebar-foreground">LoanLens Dashboard</h2>
        </div>

        {/* Right: User */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground hidden sm:block">{user?.email || 'User'}</span>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-20 bg-black/50 transition-opacity duration-300"
          onClick={closeMenu}
        />
      )}

      {/* Mobile Menu */}
      <nav
        className={`lg:hidden fixed left-0 top-16 h-screen w-64 bg-sidebar z-40 transform transition-transform duration-300 ease-in-out overflow-y-auto shadow-lg border-r border-sidebar-border ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={closeMenu}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-accent text-muted-foreground transition-colors"
          aria-label="Close menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Menu Title */}
        <div className="pt-4 px-4 pb-4 border-b border-sidebar-border">
          <h2 className="text-lg font-bold text-sidebar-foreground">Menu</h2>
        </div>

        {/* Menu Items */}
        <div className="px-4 py-4 space-y-1">
          {items.map((item) => {
            if (item.comingSoon) {
              return (
                <div
                  key={item.href}
                  className="flex items-center justify-between px-4 py-3 rounded-lg font-medium text-muted-foreground/50 cursor-default"
                >
                  {item.label}
                  <span className="text-[10px] font-medium uppercase tracking-wide rounded px-1.5 py-0.5" style={{ background: 'var(--accent)', color: 'var(--primary)' }}>
                    Soon
                  </span>
                </div>
              )
            }
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className={`block px-4 py-3 rounded-lg transition-colors font-medium ${
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-sidebar-accent-foreground'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
