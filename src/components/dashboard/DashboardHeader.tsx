'use client'

import { useState } from 'react'
import Link from 'next/link'

const MENU_ITEMS = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Deals', href: '/deals' },
  { label: 'New Leads', href: '/leads' },
  { label: 'Brokers', href: '/brokers' },
  { label: 'Add Loan', href: '/loans/new' },
  { label: 'Lender Entities', href: '/lender-entities' },
  { label: 'Solicitors', href: '/solicitors' },
  { label: 'All Loans', href: '/loans' },
  { label: 'Settings', href: '/settings' },
]

export default function DashboardHeader({ user }: { user: any }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const closeMenu = () => setMobileMenuOpen(false)

  return (
    <>
      {/* Header */}
      <div className="h-16 bg-white border-b border-gray-200 px-4 flex items-center justify-between sticky top-0 z-30">
        {/* Left: Hamburger + Title */}
        <div className="flex items-center gap-3">
          {/* Hamburger Button - Mobile only */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden flex flex-col justify-center items-center w-10 h-10 rounded-lg transition-all duration-200 cursor-pointer hover:bg-purple-100 active:bg-purple-200 group border-2 border-gray-300 hover:border-purple-300"
            aria-label="Toggle menu"
            title="Open menu"
          >
            {/* Top line */}
            <span
              className={`block w-6 h-0.5 bg-gray-700 rounded-full transition-all duration-300 ${
                mobileMenuOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            />
            {/* Middle line */}
            <span
              className={`block w-6 h-0.5 bg-gray-700 rounded-full mt-1.5 transition-all duration-300 ${
                mobileMenuOpen ? 'opacity-0' : ''
              }`}
            />
            {/* Bottom line */}
            <span
              className={`block w-6 h-0.5 bg-gray-700 rounded-full mt-1.5 transition-all duration-300 ${
                mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            />
          </button>

          {/* Title */}
          <h2 className="text-lg font-semibold text-gray-900">LoanLens Dashboard</h2>
        </div>

        {/* Right: User */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 hidden sm:block">{user?.email || 'User'}</span>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity duration-300"
          onClick={closeMenu}
        />
      )}

      {/* Mobile Menu */}
      <nav
        className={`lg:hidden fixed left-0 top-16 h-screen w-64 bg-white z-40 transform transition-transform duration-300 ease-in-out overflow-y-auto shadow-lg ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={closeMenu}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-200 text-gray-700 transition-colors"
          aria-label="Close menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Menu Title */}
        <div className="pt-4 px-4 pb-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Menu</h2>
        </div>

        {/* Menu Items */}
        <div className="px-4 py-4 space-y-1">
          {MENU_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMenu}
              className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-purple-100 transition-colors font-medium"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  )
}