import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function BrokersPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: userData } = await supabase
    .from('users')
    .select('company_id')
    .eq('id', user?.id)
    .single()

  const { data: brokers } = await supabase
    .from('brokers')
    .select('*')
    .eq('company_id', userData?.company_id)
    .order('name')

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Brokers / Introducers</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage your broker and introducer contacts and commission rates.
          </p>
        </div>
        <Link
          href="/brokers/new"
          className="rounded-md px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm"
          style={{ background: 'var(--primary)' }}
        >
          Add Contact
        </Link>
      </div>

      {!brokers || brokers.length === 0 ? (
        <div className="lens-card text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-semibold text-foreground">No contacts</h3>
          <p className="mt-1 text-sm text-muted-foreground">Get started by adding your first broker or introducer.</p>
          <div className="mt-6">
            <Link
              href="/brokers/new"
              className="inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold text-primary-foreground shadow-sm"
              style={{ background: 'var(--primary)' }}
            >
              Add Contact
            </Link>
          </div>
        </div>
      ) : (
        <div className="lens-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr>
                  <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-foreground">Name</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-foreground">Type</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-foreground">Company</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-foreground">Email</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-foreground">Phone</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-foreground">Typical Commission</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-foreground">Status</th>
                  <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {brokers.map((broker) => (
                  <tr key={broker.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-foreground">
                      {broker.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <div className="flex gap-1.5">
                        {broker.is_broker && (
                          <span className="inline-flex rounded-full px-2 py-0.5 text-xs font-semibold" style={{ background: 'var(--accent)', color: 'var(--primary)' }}>
                            Broker
                          </span>
                        )}
                        {broker.is_introducer && (
                          <span className="inline-flex rounded-full px-2 py-0.5 text-xs font-semibold" style={{ background: 'var(--muted)', color: 'var(--foreground)' }}>
                            Introducer
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">
                      {broker.company_name || '-'}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">
                      {broker.email}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">
                      {broker.phone || '-'}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">
                      {broker.default_commission_type === 'percentage' ? (
                        `${broker.default_commission_rate}%`
                      ) : (
                        `£${broker.default_commission_amount?.toLocaleString() || '0'}`
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <span
                        className="inline-flex rounded-full px-2 text-xs font-semibold leading-5"
                        style={broker.is_active
                          ? { background: 'var(--accent)', color: 'var(--status-active)' }
                          : { background: 'var(--muted)', color: 'var(--muted-foreground)' }}
                      >
                        {broker.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <Link
                        href={`/brokers/${broker.id}/edit`}
                        className="text-primary hover:opacity-70"
                      >
                        Edit
                      </Link>
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
