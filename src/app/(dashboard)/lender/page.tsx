'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'

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

  // Calculate days until redemption
  const daysUntilRedemption = (loan: Loan) => {
    const redemptionDate = loan.redemption_date || loan.maturity_date
    if (!redemptionDate) return 'N/A'

    const today = new Date()
    const redemption = new Date(redemptionDate)
    const days = Math.ceil((redemption.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return days > 0 ? `${days} days` : 'Overdue'
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-GB')
  }

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'completion':
        return 'bg-blue-100 text-blue-800'
      case 'redeemed':
        return 'bg-yellow-100 text-yellow-800'
      case 'default':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Lender Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage and monitor your loan portfolio</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Funds Deployed</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(totals.deployed)}</p>
            </div>
            <div className="text-3xl">💵</div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pipeline</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(totals.pipeline)}</p>
            </div>
            <div className="text-3xl">📈</div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Expected Returns (30d)</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(totals.expectedReturns30d)}</p>
            </div>
            <div className="text-3xl">💰</div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Accrued Interest</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(totals.accruredInterest)}</p>
            </div>
            <div className="text-3xl">💹</div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Watchlist</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">£0</p>
            </div>
            <div className="text-3xl">⚠️</div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Defaults</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(totals.defaults)}</p>
            </div>
            <div className="text-3xl">🔴</div>
          </div>
        </div>
      </div>

      {/* Portfolio Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Portfolio</h2>

        {/* Search and Filter */}
        <div className="flex gap-4 mb-6 flex-wrap">
          <input
            type="text"
            placeholder="Search by loan reference or borrower..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 min-w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Status</option>
            <option value="lead">Lead</option>
            <option value="active">Active</option>
            <option value="completion">Completion</option>
            <option value="redeemed">Redeemed</option>
            <option value="default">Default</option>
          </select>

          {(searchQuery || statusFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('')
                setStatusFilter('all')
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Table */}
        {filteredLoans.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No loans match your filters</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Loan Reference</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Borrower</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Gross Amount</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Monthly Rate</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Redemption Date</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Accrued Interest</th>
                </tr>
              </thead>
              <tbody>
                {filteredLoans.map((loan) => (
                  <tr
                    key={loan.id}
                    onClick={() => { window.location.href = `/loans/${loan.id}` }}
                    className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="py-3 px-4 text-gray-900 font-medium">{loan.loan_reference}</td>
                    <td className="py-3 px-4 text-gray-700">{loan.borrower_name}</td>
                    <td className="py-3 px-4 text-right text-gray-900 font-medium">
                      {formatCurrency(loan.gross_amount)}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-700">{loan.monthly_interest_rate}%</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(loan.status)}`}>
                        {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{formatDate(loan.redemption_date || loan.maturity_date)}</td>
                    <td className="py-3 px-4 text-right text-gray-900">{formatCurrency(loan.interest_accrued || 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="text-sm text-gray-500 mt-4">
          Showing {filteredLoans.length} of {loans.length} loans
        </p>
      </div>
    </div>
  )
}