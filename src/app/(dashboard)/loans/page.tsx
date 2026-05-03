import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import DeleteLoanButton from '@/components/loans/DeleteLoanButton'

export default async function LoansPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: userData } = await supabase.from('users').select('company_id').eq('id', user?.id).single()
  
  const { data: loans } = await supabase
    .from('loans')
    .select('*, lender_entity:lender_entities(name), broker:brokers(name)')
    .eq('company_id', userData?.company_id)
    .order('created_at', { ascending: false })
  
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Loans</h1>
          <p className="mt-2 text-sm text-gray-600">Manage your loan portfolio.</p>
        </div>
        <Link href="/loans/new" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500">
          Add Loan
        </Link>
      </div>

      {!loans || loans.length === 0 ? (
        <div className="text-center py-12 bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No loans</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding your first loan.</p>
          <div className="mt-6">
            <Link href="/loans/new" className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500">
              Add Loan
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Reference</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Borrower</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Amount</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Rate</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Term</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Lender</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loans.map((loan) => (
                <tr key={loan.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">{loan.loan_reference}</td>
                  <td className="px-3 py-4 text-sm text-gray-500">{loan.borrower_name}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">£{loan.gross_amount.toLocaleString()}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{loan.monthly_interest_rate}%</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{loan.term_months}m</td>
                  <td className="px-3 py-4 text-sm text-gray-500">{loan.lender_entity?.name || '-'}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      loan.status === 'active' ? 'bg-green-100 text-green-800' :
                      loan.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                      loan.status === 'redeemed' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                    </span>
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
  <Link href={`/loans/${loan.id}`} className="text-blue-600 hover:text-blue-900">View</Link>
  <span className="mx-2 text-gray-300">|</span>
  <DeleteLoanButton loanId={loan.id} loanReference={loan.loan_reference} />
</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
