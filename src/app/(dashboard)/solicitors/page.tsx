import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function SolicitorsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: userData } = await supabase.from('users').select('company_id').eq('id', user?.id).single()
  const { data: solicitors } = await supabase.from('solicitors').select('*').eq('company_id', userData?.company_id).order('firm_name')

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Solicitors</h1>
          <p className="mt-2 text-sm text-muted-foreground">Manage solicitor firms for completion and redemption.</p>
        </div>
        <Link href="/solicitors/new" className="rounded-md px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm" style={{ background: 'var(--primary)' }}>
          Add Solicitor
        </Link>
      </div>

      {!solicitors || solicitors.length === 0 ? (
        <div className="lens-card text-center py-12">
          <h3 className="mt-2 text-sm font-semibold text-foreground">No solicitors</h3>
          <p className="mt-1 text-sm text-muted-foreground">Get started by adding your first solicitor.</p>
          <div className="mt-6">
            <Link href="/solicitors/new" className="inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold text-primary-foreground shadow-sm" style={{ background: 'var(--primary)' }}>
              Add Solicitor
            </Link>
          </div>
        </div>
      ) : (
        <div className="lens-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr>
                  <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-foreground">Firm Name</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-foreground">SRA Number</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-foreground">Contact</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-foreground">Email</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-foreground">Discharge Fee</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-foreground">Status</th>
                  <th className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {solicitors.map((solicitor) => (
                  <tr key={solicitor.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-foreground">{solicitor.firm_name}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">{solicitor.sra_number || '-'}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">{solicitor.contact_name || '-'}</td>
                    <td className="px-3 py-4 text-sm text-muted-foreground">{solicitor.email || '-'}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">
                      {solicitor.default_discharge_fee ? `£${solicitor.default_discharge_fee.toLocaleString()}` : '-'}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <span
                        className="inline-flex rounded-full px-2 text-xs font-semibold leading-5"
                        style={solicitor.is_active
                          ? { background: 'var(--accent)', color: 'var(--status-active)' }
                          : { background: 'var(--muted)', color: 'var(--muted-foreground)' }}
                      >
                        {solicitor.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <Link href={`/solicitors/${solicitor.id}/edit`} className="text-primary hover:opacity-70">Edit</Link>
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
