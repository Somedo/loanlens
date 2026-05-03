import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

const statusColors = {
  new: 'bg-blue-100 text-blue-800',
  reviewing: 'bg-yellow-100 text-yellow-800',
  info_requested: 'bg-purple-100 text-purple-800',
  accepted: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  withdrawn: 'bg-gray-100 text-gray-800',
}

const statusLabels = {
  new: 'New',
  reviewing: 'Reviewing',
  info_requested: 'Info Requested',
  accepted: 'Accepted',
  rejected: 'Rejected',
  withdrawn: 'Withdrawn',
}

export default async function LeadsPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: userData } = await supabase
    .from('users')
    .select('company_id')
    .eq('id', user?.id)
    .single()
  
  const { data: leads } = await supabase
    .from('loan_leads')
    .select('*, broker:brokers(name, company_name)')
    .eq('company_id', userData?.company_id)
    .order('created_at', { ascending: false })
  
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Loan Leads</h1>
          <p className="mt-2 text-sm text-gray-600">
            Track and manage loan opportunities from brokers.
          </p>
        </div>
        <Link
          href="/leads/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
        >
          New Lead
        </Link>
      </div>

      {!leads || leads.length === 0 ? (
        <div className="text-center py-12 bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No leads</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating your first loan lead.</p>
          <div className="mt-6">
            <Link
              href="/leads/new"
              className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
            >
              New Lead
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl overflow-hidden">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Borrower</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Property</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Loan Amount</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Rate</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Broker</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Created</th>
                <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm">
                    <div className="font-medium text-gray-900">{lead.borrower_name || 'Unknown'}</div>
                    {lead.borrower_company && (
                      <div className="text-gray-500">{lead.borrower_company}</div>
                    )}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500">
                    <div className="max-w-xs truncate">{lead.property_address || '-'}</div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                    {lead.loan_amount ? `£${lead.loan_amount.toLocaleString()}` : '-'}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                    {lead.interest_rate ? `${lead.interest_rate}%` : '-'}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <div>{lead.broker?.name || 'No broker'}</div>
                    {lead.broker?.company_name && (
                      <div className="text-xs text-gray-400">{lead.broker.company_name}</div>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${statusColors[lead.status as keyof typeof statusColors]}`}>
                      {statusLabels[lead.status as keyof typeof statusLabels]}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <Link
                      href={`/leads/${lead.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View
                    </Link>
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
