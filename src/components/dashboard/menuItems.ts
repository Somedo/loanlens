export interface MenuItem {
  label: string
  href: string
}

// Single source of truth for dashboard navigation.
// Both DashboardNav (sidebar) and DashboardHeader (mobile) import this,
// so the two menus can never drift apart.
export const MENU_ITEMS: MenuItem[] = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Lender Dashboard', href: '/lender' },
  { label: 'Deals', href: '/deals' },
  { label: 'Brokers', href: '/brokers' },
  { label: 'Add Loan', href: '/loans/new' },
  { label: 'All Loans', href: '/loans' },
  { label: 'Borrowers', href: '/borrowers' },
  { label: 'Lender Entities', href: '/lender-entities' },
  { label: 'Solicitors', href: '/solicitors' },
  { label: 'Settings', href: '/settings' },
]