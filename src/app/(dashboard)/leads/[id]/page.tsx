import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'

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

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: userData } = await supabase
    .from('users')
    .select('company_id')
    .eq('id', user?.id)
    .single()
  
  const { data: lead } = await supabase
    .from('loan_leads')
    .select('*, broker:brokers(name, company_name, email, phone)')
    .eq('id', id)
    .eq('company_id', userData?.company_id)
    .single()
  
  if (!lead) {
    notFound()
  }
  
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">{lead.borrower_name || 'Unnamed Lead'}</h1>
            <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${statusColors[lead.status as keyof typeof statusColors]}`}>
              {statusLabels[lead.status as keyof typeof statusLabels]}
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Created {new Date(lead.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href={`/leads/${lead.id}/edit`}
            className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Edit
          </Link>
          <Link
            href="/leads"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
          >
            Back to Leads
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Loan Details */}
          <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Loan Details</h2>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Loan Amount</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {lead.loan_amount ? `£${lead.loan_amount.toLocaleString()}` : '-'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Interest Rate</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {lead.interest_rate ? `${lead.interest_rate}%` : '-'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Term</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {lead.term_months ? `${lead.term_months} months` : '-'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Loan Type</dt>
                <dd className="mt-1 text-sm text-gray-900 capitalize">
                  {lead.loan_type?.replace('_', ' ') || '-'}
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="text-sm font-medium text-gray-500">Purpose</dt>
                <dd className="mt-1 text-sm text-gray-900">{lead.purpose || '-'}</dd>
              </div>
            </dl>
          </div>

          {/* Borrower Details */}
          <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Borrower</h2>
            <dl className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{lead.borrower_name || '-'}</dd>
              </div>
              {lead.borrower_company && (
                <div className="col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Company</dt>
                  <dd className="mt-1 text-sm text-gray-900">{lead.borrower_company}</dd>
                </div>
              )}
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{lead.borrower_email || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Phone</dt>
                <dd className="mt-1 text-sm text-gray-900">{lead.borrower_phone || '-'}</dd>
              </div>
            </dl>
          </div>

          {/* Property Details */}
          <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Property</h2>
            <dl className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <dt className="text-sm font-medium text-gray-500">Address</dt>
                <dd className="mt-1 text-sm text-gray-900">{lead.property_address || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Value</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {lead.property_value ? `£${lead.property_value.toLocaleString()}` : '-'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">LTV</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {lead.ltv ? `${lead.ltv}%` : '-'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Type</dt>
                <dd className="mt-1 text-sm text-gray-900 capitalize">
                  {lead.property_type?.replace('_', ' ') || '-'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Exit Strategy</dt>
                <dd className="mt-1 text-sm text-gray-900">{lead.exit_strategy || '-'}</dd>
              </div>
            </dl>
          </div>

          {/* Notes */}
          {lead.notes && (
            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Notes</h2>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{lead.notes}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Broker Info */}
          {lead.broker && (
            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Broker</h2>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{lead.broker.name}</dd>
                </div>
                {lead.broker.company_name && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Company</dt>
                    <dd className="mt-1 text-sm text-gray-900">{lead.broker.company_name}</dd>
                  </div>
                )}
                {lead.broker.email && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 text-sm text-gray-900">{lead.broker.email}</dd>
                  </div>
                )}
                {lead.broker.phone && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Phone</dt>
                    <dd className="mt-1 text-sm text-gray-900">{lead.broker.phone}</dd>
                  </div>
                )}
              </dl>
            </div>
          )}

          {/* Commission */}
          <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Commission</h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Type</dt>
                <dd className="mt-1 text-sm text-gray-900 capitalize">
                  {lead.broker_commission_type || '-'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Amount</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {lead.broker_commission_type === 'percentage' && lead.broker_commission_rate
                    ? `${lead.broker_commission_rate}%`
                    : lead.broker_commission_amount
                    ? `£${lead.broker_commission_amount.toLocaleString()}`
                    : '-'}
                </dd>
              </div>
            </dl>
          </div>

          {/* Timeline */}
          {lead.requested_completion_date && (
            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h2>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Requested Completion</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(lead.requested_completion_date).toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
