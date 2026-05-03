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
  
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Loan {loan.loan_reference}</h1>
          <p className="mt-2 text-sm text-gray-600">{loan.borrower_name}</p>
        </div>
        <div className="flex gap-3">
          <CalculateCompletionButton loanId={loan.id} />
          <CalculateRedemptionButton loan={loan} />
          <Link href={`/loans/${loan.id}/edit`} className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
            Edit
          </Link>
          <Link href="/loans" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500">
            Back to Loans
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Loan Details</h2>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Gross Amount</dt>
                <dd className="mt-1 text-sm text-gray-900">£{loan.gross_amount.toLocaleString()}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Monthly Rate</dt>
                <dd className="mt-1 text-sm text-gray-900">{loan.monthly_interest_rate}%</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Term</dt>
                <dd className="mt-1 text-sm text-gray-900">{loan.term_months} months</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Min Interest Period</dt>
                <dd className="mt-1 text-sm text-gray-900">{loan.minimum_interest_period_months} months</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Interest Method</dt>
                <dd className="mt-1 text-sm text-gray-900 capitalize">{loan.interest_method}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1 text-sm text-gray-900 capitalize">{loan.status}</dd>
              </div>
            </dl>
          </div>

          <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Dates & Notice Period</h2>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Completion Date</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {loan.completion_date ? new Date(loan.completion_date).toLocaleDateString('en-GB') : '-'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Redemption Method</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {loan.redemption_calculation_method === 'daily_accrual' ? 'Daily Accrual' : 'Full Months'}
                </dd>
              </div>
              {loan.requires_notice_period && (
                <>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Notice Period Required</dt>
                    <dd className="mt-1 text-sm text-gray-900">3 months</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Notice Received Date</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {loan.notice_received_date ? new Date(loan.notice_received_date).toLocaleDateString('en-GB') : 'Not yet received'}
                    </dd>
                  </div>
                </>
              )}
            </dl>
          </div>

          <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Calculated Values</h2>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Retained Interest</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {loan.retained_interest_amount ? `£${loan.retained_interest_amount.toLocaleString()}` : '-'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Net to Solicitor</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {loan.net_to_solicitor ? `£${loan.net_to_solicitor.toLocaleString()}` : '-'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Total Lender Investment</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {loan.total_lender_investment ? `£${loan.total_lender_investment.toLocaleString()}` : '-'}
                </dd>
              </div>
            </dl>
          </div>

          {loan.redemption_date && (
            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Redemption Details</h2>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Redemption Date</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(loan.redemption_date).toLocaleDateString('en-GB')}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Days Held</dt>
                  <dd className="mt-1 text-sm text-gray-900">{loan.actual_days_held} days</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Months Billed</dt>
                  <dd className="mt-1 text-sm text-gray-900">{loan.months_billed} months</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Interest Refund</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    £{loan.interest_refund?.toLocaleString() || '0'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Exit Fees</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    £{loan.exit_fees_charged?.toLocaleString() || '0'}
                  </dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Total Redemption Amount</dt>
                  <dd className="mt-1 text-lg font-semibold text-gray-900">
                    £{loan.total_redemption_amount?.toLocaleString() || '0'}
                  </dd>
                </div>
              </dl>
            </div>
          )}

          <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Borrower</h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{loan.borrower_name}</dd>
              </div>
              {loan.borrower_company && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Company</dt>
                  <dd className="mt-1 text-sm text-gray-900">{loan.borrower_company}</dd>
                </div>
              )}
            </dl>
          </div>

          <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Property</h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Address</dt>
                <dd className="mt-1 text-sm text-gray-900">{loan.property_address}</dd>
              </div>
              {loan.property_value && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Value</dt>
                  <dd className="mt-1 text-sm text-gray-900">£{loan.property_value.toLocaleString()}</dd>
                </div>
              )}
              {loan.ltv && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">LTV</dt>
                  <dd className="mt-1 text-sm text-gray-900">{loan.ltv}%</dd>
                </div>
              )}
            </dl>
          </div>

          <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Fees</h2>
            {!loan.fees || loan.fees.length === 0 ? (
              <p className="text-sm text-gray-500">No fees</p>
            ) : (
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-2 text-left text-sm font-medium text-gray-500">Fee</th>
                    <th className="py-2 text-right text-sm font-medium text-gray-500">Amount</th>
                    <th className="py-2 text-center text-sm font-medium text-gray-500">Deducted</th>
                    <th className="py-2 text-center text-sm font-medium text-gray-500">Funded</th>
                  </tr>
                </thead>
                <tbody>
                  {loan.fees.map((fee: any) => (
                    <tr key={fee.id} className="border-b border-gray-100">
                      <td className="py-2 text-sm text-gray-900">{fee.fee_name}</td>
                      <td className="py-2 text-sm text-gray-900 text-right">£{fee.calculated_amount?.toLocaleString() || '0'}</td>
                      <td className="py-2 text-center">{fee.deducted_from_gross ? '✓' : '-'}</td>
                      <td className="py-2 text-center">{fee.funded_by_lender ? '✓' : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Lender Entity</h2>
            <p className="text-sm text-gray-900">{loan.lender_entity?.name || '-'}</p>
          </div>

          {loan.broker && (
            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Broker</h2>
              <p className="text-sm text-gray-900">{loan.broker.name}</p>
              {loan.broker.company_name && <p className="text-sm text-gray-500">{loan.broker.company_name}</p>}
            </div>
          )}

          {loan.solicitor && (
            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Solicitor</h2>
              <p className="text-sm text-gray-900">{loan.solicitor.firm_name}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}