import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function LenderEntitiesPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: userData } = await supabase
    .from('users')
    .select('company_id')
    .eq('id', user?.id)
    .single()

  const { data: entities } = await supabase
    .from('lender_entities')
    .select('*')
    .eq('company_id', userData?.company_id)
    .order('name')

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Lender Entities</h1>
          <p className="mt-2 text-sm text-muted-foreground">Manage entities you lend through.</p>
        </div>
        <Link href="/lender-entities/new" className="rounded-md px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm" style={{ background: 'var(--primary)' }}>
          Add Entity
        </Link>
      </div>

      {!entities || entities.length === 0 ? (
        <div className="lens-card text-center py-12">
          <h3 className="mt-2 text-sm font-semibold text-foreground">No entities</h3>
          <p className="mt-1 text-sm text-muted-foreground">Get started by adding your first lending entity.</p>
          <div className="mt-6">
            <Link href="/lender-entities/new" className="inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold text-primary-foreground shadow-sm" style={{ background: 'var(--primary)' }}>
              Add Entity
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
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-foreground">Details</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-foreground">Status</th>
                  <th className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {entities.map((entity) => (
                  <tr key={entity.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-foreground">{entity.name}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground capitalize">{entity.entity_type.replace('_', ' ')}</td>
                    <td className="px-3 py-4 text-sm text-muted-foreground">
                      {entity.entity_type === 'individual' && entity.individual_first_name && <div>{entity.individual_first_name} {entity.individual_last_name}</div>}
                      {entity.entity_type === 'joint' && entity.individual_first_name && <div>{entity.individual_first_name} & {entity.co_lender_first_name}</div>}
                      {(entity.entity_type === 'limited_company' || entity.entity_type === 'llp') && entity.company_number && <div>#{entity.company_number}</div>}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <span
                        className="inline-flex rounded-full px-2 text-xs font-semibold leading-5"
                        style={entity.is_active
                          ? { background: 'var(--accent)', color: 'var(--status-active)' }
                          : { background: 'var(--muted)', color: 'var(--muted-foreground)' }}
                      >
                        {entity.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <Link href={`/lender-entities/${entity.id}/edit`} className="text-primary hover:opacity-70">Edit</Link>
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
