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
          <h1 className="text-2xl font-bold text-gray-900">Lender Entities</h1>
          <p className="mt-2 text-sm text-gray-600">Manage entities you lend through.</p>
        </div>
        <Link href="/lender-entities/new" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500">
          Add Entity
        </Link>
      </div>

      {!entities || entities.length === 0 ? (
        <div className="text-center py-12 bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No entities</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding your first lending entity.</p>
          <div className="mt-6">
            <Link href="/lender-entities/new" className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500">
              Add Entity
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Name</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Type</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Details</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {entities.map((entity) => (
                <tr key={entity.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">{entity.name}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 capitalize">{entity.entity_type.replace('_', ' ')}</td>
                  <td className="px-3 py-4 text-sm text-gray-500">
                    {entity.entity_type === 'individual' && entity.individual_first_name && <div>{entity.individual_first_name} {entity.individual_last_name}</div>}
                    {entity.entity_type === 'joint' && entity.individual_first_name && <div>{entity.individual_first_name} & {entity.co_lender_first_name}</div>}
                    {(entity.entity_type === 'limited_company' || entity.entity_type === 'llp') && entity.company_number && <div>#{entity.company_number}</div>}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${entity.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {entity.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <Link href={`/lender-entities/${entity.id}/edit`} className="text-blue-600 hover:text-blue-900">Edit</Link>
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
