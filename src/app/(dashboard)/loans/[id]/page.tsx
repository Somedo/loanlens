import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import CalculateCompletionButton from '@/components/loans/CalculateCompletionButton'
import CalculateRedemptionButton from '@/components/loans/CalculateRedemptionButton'

export default async function LoanDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: userData } = await supabase.from('users').select('company_id').eq('id', user?.id).single()

  const { data: loan } = await supabase.from('loans').select('*, lender_entity:lender_entities(name), broker:brokers(name, company_name), solicitor:solicitors(firm_name), fees:loan_fees(*)').eq('id', id).eq('company_id', userData?.company_id).single()
  if (!loan) notFound()

  const dt = "text-sm font-medium text-muted-foreground"
  const dd = "mt-1 text-sm text-foreground"

  return (
    <div>
      <div className="mb-8 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Loan {loan.loan_reference}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{loan.borrower_name}</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <CalculateCompletionButton loanId={loan.id} />
          <CalculateRedemptionButton loan={loan} />
          <Link href={`/loans/${loan.id}/edit`} className="rounded-md bg-card px-4 py-2 text-sm font-semibold text-foreground border border-input hover:bg-accent">
            Edit
          </Link>
          <Link href="/loans" className="rounded-md px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm" style={{ background: 'var(--primary)' }}>
            Back to Loans
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="lens-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Loan Details</h2>
            <dl className="grid grid-cols-2 gap-4">
              <div><dt className={dt}>Gross Amount</dt><dd className={`${dd} font-mono tabular-nums`}>£{loan.gross_amount.toLocaleString()}</dd></div>
              <div><dt className={dt}>Monthly Rate</dt><dd className={`${dd} font-mono tabular-nums`}>{loan.monthly_interest_rate}%</dd></div>
              <div><dt className={dt}>Term</dt><dd className={dd}>{loan.term_months} months</dd></div>
              <div><dt className={dt}>Min Interest Period</dt><dd className={dd}>{loan.minimum_interest_period_months} months</dd></div>
              <div><dt className={dt}>Interest Method</dt><dd className={`${dd} capitalize`}>{loan.interest_method}</dd></div>
              <div><dt className={dt}>Status</dt><dd className={`${dd} capitalize`}>{loan.status}</dd></div>
            </dl>
          </div>

          <div className="lens-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Dates & Notice Period</h2>
            <dl className="grid grid-cols-2 gap-4">
              <div><dt className={dt}>Completion Date</dt><dd className={dd}>{loan.completion_date ? new Date(loan.completion_date).toLocaleDateString('en-GB') : '-'}</dd></div>
              <div><dt className={dt}>Redemption Method</dt><dd className={dd}>{loan.redemption_calculation_method === 'daily_accrual' ? 'Daily Accrual' : 'Full Months'}</dd></div>
              {loan.requires_notice_period && (
                <>
                  <div><dt className={dt}>Notice Period Required</dt><dd className={dd}>3 months</dd></div>
                  <div><dt className={dt}>Notice Received Date</dt><dd className={dd}>{loan.notice_received_date ? new Date(loan.notice_received_date).toLocaleDateString('en-GB') : 'Not yet received'}</dd></div>
                </>
              )}
            </dl>
          </div>

          <div className="lens-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Calculated Values</h2>
            <dl className="grid grid-cols-2 gap-4">
              <div><dt className={dt}>Retained Interest</dt><dd className={`${dd} font-mono tabular-nums`}>{loan.retained_interest_amount ? `£${loan.retained_interest_amount.toLocaleString()}` : '-'}</dd></div>
              <div><dt className={dt}>Net to Solicitor</dt><dd className={`${dd} font-mono tabular-nums`}>{loan.net_to_solicitor ? `£${loan.net_to_solicitor.toLocaleString()}` : '-'}</dd></div>
              <div><dt className={dt}>Total Lender Investment</dt><dd className={`${dd} font-mono tabular-nums`}>{loan.total_lender_investment ? `£${loan.total_lender_investment.toLocaleString()}` : '-'}</dd></div>
            </dl>
          </div>

          {loan.redemption_date && (
            <div className="lens-card p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Redemption Details</h2>
              <dl className="grid grid-cols-2 gap-4">
                <div><dt className={dt}>Redemption Date</dt><dd className={dd}>{new Date(loan.redemption_date).toLocaleDateString('en-GB')}</dd></div>
                <div><dt className={dt}>Days Held</dt><dd className={dd}>{loan.actual_days_held} days</dd></div>
                <div><dt className={dt}>Months Billed</dt><dd className={dd}>{loan.months_billed} months</dd></div>
                <div><dt className={dt}>Interest Refund</dt><dd className={`${dd} font-mono tabular-nums`}>£{loan.interest_refund?.toLocaleString() || '0'}</dd></div>
                <div><dt className={dt}>Exit Fees</dt><dd className={`${dd} font-mono tabular-nums`}>£{loan.exit_fees_charged?.toLocaleString() || '0'}</dd></div>
                <div className="col-span-2"><dt className={dt}>Total Redemption Amount</dt><dd className="mt-1 text-lg font-semibold text-foreground font-mono tabular-nums">£{loan.total_redemption_amount?.toLocaleString() || '0'}</dd></div>
              </dl>
            </div>
          )}

          <div className="lens-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Borrower</h2>
            <dl className="space-y-3">
              <div><dt className={dt}>Name</dt><dd className={dd}>{loan.borrower_name}</dd></div>
              {loan.borrower_company && (<div><dt className={dt}>Company</dt><dd className={dd}>{loan.borrower_company}</dd></div>)}
            </dl>
          </div>

          <div className="lens-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Property</h2>
            <dl className="space-y-3">
              <div><dt className={dt}>Address</dt><dd className={dd}>{loan.property_address}</dd></div>
              {loan.property_value && (<div><dt className={dt}>Value</dt><dd className={`${dd} font-mono tabular-nums`}>£{loan.property_value.toLocaleString()}</dd></div>)}
              {loan.ltv && (<div><dt className={dt}>LTV</dt><dd className={dd}>{loan.ltv}%</dd></div>)}
            </dl>
          </div>

          <div className="lens-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Fees</h2>
            {!loan.fees || loan.fees.length === 0 ? (
              <p className="text-sm text-muted-foreground">No fees</p>
            ) : (
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-2 text-left text-sm font-medium text-muted-foreground">Fee</th>
                    <th className="py-2 text-right text-sm font-medium text-muted-foreground">Amount</th>
                    <th className="py-2 text-center text-sm font-medium text-muted-foreground">Deducted</th>
                    <th className="py-2 text-center text-sm font-medium text-muted-foreground">Funded</th>
                  </tr>
                </thead>
                <tbody>
                  {loan.fees.map((fee: any) => (
                    <tr key={fee.id} className="border-b border-border">
                      <td className="py-2 text-sm text-foreground">{fee.fee_name}</td>
                      <td className="py-2 text-sm text-foreground text-right font-mono tabular-nums">£{fee.calculated_amount?.toLocaleString() || '0'}</td>
                      <td className="py-2 text-center text-muted-foreground">{fee.deducted_from_gross ? '✓' : '-'}</td>
                      <td className="py-2 text-center text-muted-foreground">{fee.funded_by_lender ? '✓' : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="lens-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Lender Entity</h2>
            <p className="text-sm text-foreground">{loan.lender_entity?.name || '-'}</p>
          </div>

          {loan.broker && (
            <div className="lens-card p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Broker</h2>
              <p className="text-sm text-foreground">{loan.broker.name}</p>
              {loan.broker.company_name && <p className="text-sm text-muted-foreground">{loan.broker.company_name}</p>}
            </div>
          )}

          {loan.solicitor && (
            <div className="lens-card p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Solicitor</h2>
              <p className="text-sm text-foreground">{loan.solicitor.firm_name}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
