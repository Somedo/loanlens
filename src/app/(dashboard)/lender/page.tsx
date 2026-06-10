'use client'

import { useEffect, useState, useMemo } from 'react'
import {
  Wallet,
  TrendingUp,
  Clock,
  Percent,
  AlertTriangle,
  CircleOff,
  Plus,
} from 'lucide-react'
import StatCard from '@/components/dashboard/StatCard'

interface Loan {
  id: string
  loan_reference: string
  borrower_name: string
  gross_amount: number
  monthly_interest_rate: number
  status: string
  redemption_date: string | null
  maturity_date: string | null
  completion_date: string | null
  term_months: number
  interest_accrued: number
  property_address: string
  property_value: number
  ltv: number
}

interface Totals {
  deployed: number
  pipeline: number
  expectedReturns30d: number
  accruredInterest: number
  defaults: number
}

export default function LenderDashboard() {
  const [loans, setLoans] = useState<Loan[]>([])
  const [totals, setTotals] = useState<Totals>({
    deployed: 0,
    pipeline: 0,
    expectedReturns30d: 0,
    accruredInterest: 0,
    defaults: 0,
  })
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Fetch loans data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/lender/loans')
        const data = await response.json()
        setLoans(data.loans || [])
        setTotals(data.totals || {})
      } catch (error) {
        console.error('Failed to fetch loans:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter loans based on search and status
  const filteredLoans = useMemo(() => {
    return loans.filter((loan) => {
      const matchesSearch =
        loan.loan_reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loan.borrower_name.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === 'all' || loan.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [loans, searchQuery, statusFilter])

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  // Format date as DD.MM.YYYY
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—'
    const d = new Date(dateString)
    const dd = String(d.getDate()).padStart(2, '0')
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    return `${dd}.${mm}.${d.getFullYear()}`
  }

  // Status pill styling via tokens
  const statusVar = (status: string) => {
    switch (status) {
      case 'active': return 'var(--status-active)'
      case 'completion': return 'var(--status-completion)'
      case 'redeemed': return 'var(--status-redeemed)'
      case 'default': return 'var(--status-default)'
      default: return 'var(--muted-foreground)'
    }
  }

  if (loading) {
    return <div className="p-6 text-muted-foreground">Loading portfolio…</div>
  }

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-[34px] font-extrabold tracking-[-0.035em] leading-none text-foreground">
            Lender Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Monitor deployment, accrual and redemption across your active book.
          </p>
        </div>
        <button
          onClick={() => { window.location.href = '/loans/new' }}
          className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-semibold text-primary-foreground"
          style={{ background: 'var(--primary)' }}
        >
          <Plus className="w-4 h-4" strokeWidth={2.2} />
          New Loan
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatCard
          label="Funds Deployed"
          value={formatCurrency(totals.deployed)}
          caption={`${loans.filter((l) => l.status === 'active').length} active facilities`}
          icon={Wallet}
          rail="primary"
        />
        <StatCard
          label="Pipeline"
          value={formatCurrency(totals.pipeline)}
          caption={totals.pipeline > 0 ? undefined : 'No deals in pipeline'}
          captionMuted
          icon={TrendingUp}
          rail="completion"
        />
        <StatCard
          label="Expected Returns · 30d"
          value={formatCurrency(totals.expectedReturns30d)}
          caption={totals.expectedReturns30d > 0 ? undefined : 'None redeeming this month'}
          captionMuted
          icon={Clock}
          rail="primary"
        />
        <StatCard
          label="Accrued Interest"
          value={formatCurrency(totals.accruredInterest)}
          caption="Live · floor-protected"
          icon={Percent}
          rail="primary"
        />
        <StatCard
          label="Watchlist"
          value={formatCurrency(0)}
          caption="Nothing flagged"
          captionMuted
          icon={AlertTriangle}
          rail="redeemed"
        />
        <StatCard
          label="Defaults"
          value={formatCurrency(totals.defaults)}
          caption={totals.defaults > 0 ? undefined : 'Book in good standing'}
          captionMuted
          icon={CircleOff}
          rail="default"
        />
      </div>

      {/* Portfolio Section */}
      <div className="lens-card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-[18px] border-b border-border flex-wrap gap-3">
          <h2 className="text-lg font-bold tracking-[-0.025em] text-foreground">Portfolio</h2>
          <div className="flex gap-2.5 flex-wrap">
            <input
              type="text"
              placeholder="Search reference or borrower…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring w-56"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All status</option>
              <option value="lead">Lead</option>
              <option value="active">Active</option>
              <option value="completion">Completion</option>
              <option value="redeemed">Redeemed</option>
              <option value="default">Default</option>
            </select>
            {(searchQuery || statusFilter !== 'all') && (
              <button
                onClick={() => { setSearchQuery(''); setStatusFilter('all') }}
                className="rounded-lg border border-input bg-secondary px-3 py-2 text-sm text-secondary-foreground hover:bg-muted"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {filteredLoans.length === 0 ? (
          <p className="text-muted-foreground text-center py-12 text-sm">
            No facilities match your filters.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {['Reference', 'Borrower', 'Gross', 'Rate', 'Status', 'Redemption', 'Accrued'].map((h, i) => (
                    <th
                      key={h}
                      className={`font-mono text-[10.5px] font-medium text-muted-foreground uppercase tracking-[0.06em] px-6 py-3 border-b border-border ${
                        i === 2 || i === 3 || i === 6 ? 'text-right' : 'text-left'
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredLoans.map((loan) => (
                  <tr
                    key={loan.id}
                    onClick={() => { window.location.href = `/loans/${loan.id}` }}
                    className="cursor-pointer border-b border-border last:border-0 transition-colors hover:bg-accent"
                  >
                    <td className="px-6 py-[15px] font-mono font-medium text-sm" style={{ color: 'var(--primary)' }}>
                      {loan.loan_reference}
                    </td>
                    <td className="px-6 py-[15px] text-sm text-foreground">{loan.borrower_name}</td>
                    <td className="px-6 py-[15px] text-right font-mono text-sm font-semibold text-foreground tabular-nums">
                      {formatCurrency(loan.gross_amount)}
                    </td>
                    <td className="px-6 py-[15px] text-right font-mono text-sm text-foreground tabular-nums">
                      {loan.monthly_interest_rate}%
                    </td>
                    <td className="px-6 py-[15px]">
                      <span
                        className="inline-flex items-center gap-1.5 rounded-md border border-input px-2.5 py-0.5 text-xs font-medium"
                        style={{ color: statusVar(loan.status), background: 'var(--accent)' }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusVar(loan.status) }} />
                        {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-[15px] font-mono text-sm text-foreground tabular-nums">
                      {formatDate(loan.redemption_date || loan.maturity_date)}
                    </td>
                    <td className="px-6 py-[15px] text-right font-mono text-sm font-semibold text-foreground tabular-nums">
                      {formatCurrency(loan.interest_accrued || 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="px-6 py-[13px] font-mono text-[11px] text-muted-foreground">
          Showing {filteredLoans.length} of {loans.length} facilities
        </div>
      </div>
    </div>
  )
}
