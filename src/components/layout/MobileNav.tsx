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

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)

  const closeMenu = () => setIsOpen(false)

  return (
    <>
      {/* Hamburger Button - Only visible on mobile, positioned in header area */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-2 left-2 z-40 p-2 rounded-lg bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700"
        aria-label="Toggle menu"
        title="Open menu"
      >
        <svg
          className="w-6 h-6 text-gray-700 dark:text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Mobile Menu Overlay - Click outside to close */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black bg-opacity-50"
          onClick={closeMenu}
        />
      )}

      {/* Mobile Sidebar Menu */}
      <nav
        className={`md:hidden fixed left-0 top-0 h-screen w-64 bg-white dark:bg-gray-950 z-40 transform transition-transform duration-300 ease-in-out overflow-y-auto shadow-lg ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={closeMenu}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
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
        <div className="pt-4 px-4 pb-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Menu</h2>
        </div>

        {/* Menu Items */}
        <div className="px-4 py-4 space-y-1">
          {MENU_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMenu}
              className="block px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  )
}