export type Capability = 'shared' | 'lender' | 'broker'

export interface MenuItem {
  label: string
  href: string
  capability: Capability
  comingSoon?: boolean
}

// Single source of truth for dashboard navigation.
// Both DashboardNav (sidebar) and DashboardHeader (mobile) import this.
// `capability` controls who sees each item:
//   'shared' = everyone, 'lender' = can_lend, 'broker' = can_broker
export const MENU_ITEMS: MenuItem[] = [
  { label: 'Dashboard', href: '/dashboard', capability: 'shared' },

  // Lender-side
  { label: 'Lender Dashboard', href: '/lender', capability: 'lender' },
  { label: 'Leads', href: '/leads', capability: 'lender' },
  { label: 'All Loans', href: '/loans', capability: 'lender' },
  { label: 'Lender Entities', href: '/lender-entities', capability: 'lender' },
  { label: 'Redemptions', href: '/redemptions', capability: 'lender', comingSoon: true },

  // Broker-side
  { label: 'Deals', href: '/deals', capability: 'broker' },
  { label: 'Introduced Loans', href: '/introduced-loans', capability: 'broker', comingSoon: true },
  { label: 'Fees', href: '/fees', capability: 'broker', comingSoon: true },

  // Shared
  { label: 'Brokers', href: '/brokers', capability: 'shared' },
  { label: 'Add Loan', href: '/loans/new', capability: 'shared' },
  { label: 'Borrowers', href: '/borrowers', capability: 'shared' },
  { label: 'Solicitors', href: '/solicitors', capability: 'shared' },
  { label: 'Settings', href: '/settings', capability: 'shared' },
]

export function visibleMenuItems(canLend: boolean, canBroker: boolean): MenuItem[] {
  // If a company has neither flag set, show shared items so they're not stranded.
  return MENU_ITEMS.filter((item) => {
    if (item.capability === 'shared') return true
    if (item.capability === 'lender') return canLend
    if (item.capability === 'broker') return canBroker
    return false
  })
}