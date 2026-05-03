import { createClient } from '@/lib/supabase/server'
import LenderEntityForm from '@/components/lender-entities/LenderEntityForm'
import { notFound } from 'next/navigation'

export default async function EditEntityPage({ params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: userData } = await supabase.from('users').select('company_id').eq('id', user?.id).single()
  const { data: entity } = await supabase.from('lender_entities').select('*').eq('id', id).eq('company_id', userData?.company_id).single()
  
  if (!entity) notFound()
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Edit Lender Entity</h1>
        <p className="mt-2 text-sm text-gray-600">Update entity details.</p>
      </div>
      <LenderEntityForm entity={entity} companyId={userData?.company_id} />
    </div>
  )
}
