import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import DeleteLoanButton from '@/components/loans/DeleteLoanButton'

export default async function LoansPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: userData } = await supabase.from('users').select('company_id').eq('id', user?.id).single()
  
  const { data: loans, error: loansError } = await supabase
    .from('loans')
    .select('*, lender_entity:lender_entities(name), broker:brokers!loans_broker_id_fkey(name)')
    .eq('company_id', userData?.company_id)
    .order('created_at', { ascending: false })

 
  const statusStyle = (status: string) => {
    switch (status) {
      case 'active': return { background: 'var(--accent)', color: 'var(--status-active)' }
      case 'redeemed': return { background: 'var(--accent)', color: 'var(--status-completion)' }
      case 'draft': return { background: 'var(--muted)', color: 'var(--muted-foreground)' }
      default: return { background: 'var(--accent)', color: 'var(--status-default)' }
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Loans</h1>
          <p className="mt-2 text-sm text-muted-foreground">Manage your loan portfolio.</p>
        </div>
        <Link href="/loans/new" className="rounded-md px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm" style={{ background: 'var(--primary)' }}>
          Add Loan
        </Link>
      </div>

      {!loans || loans.length === 0 ? (
        <div className="lens-card text-center py-12">
          <h3 className="mt-2 text-sm font-semibold text-foreground">No loans</h3>
          <p className="mt-1 text-sm text-muted-foreground">Get started by adding your first loan.</p>
          <div className="mt-6">
            <Link href="/loans/new" className="inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold text-primary-foreground shadow-sm" style={{ background: 'var(--primary)' }}>
              Add Loan
            </Link>
          </div>
        </div>
      ) : (
        <div className="lens-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr>
                  <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-foreground">Reference</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-foreground">Borrower</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-foreground">Amount</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-foreground">Rate</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-foreground">Term</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-foreground">Lender</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-foreground">Status</th>
                  <th className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loans.map((loan) => (
                  <tr key={loan.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-foreground">{loan.loan_reference}</td>
                    <td className="px-3 py-4 text-sm text-muted-foreground">{loan.borrower_name}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-foreground tabular-nums">£{loan.gross_amount.toLocaleString()}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-foreground tabular-nums">{loan.monthly_interest_rate}%</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-foreground tabular-nums">{loan.term_months}m</td>
                    <td className="px-3 py-4 text-sm text-muted-foreground">{loan.lender_entity?.name || '-'}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <span className="inline-flex rounded-full px-2 text-xs font-semibold leading-5" style={statusStyle(loan.status)}>
                        {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                      </span>
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <Link href={`/loans/${loan.id}`} className="text-primary hover:opacity-70">View</Link>
                      <span className="mx-2 text-border">|</span>
                      <DeleteLoanButton loanId={loan.id} loanReference={loan.loan_reference} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
