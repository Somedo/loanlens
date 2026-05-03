import { createClient } from '@/lib/supabase/server'
import LenderEntityForm from '@/components/lender-entities/LenderEntityForm'

export default async function NewEntityPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: userData } = await supabase.from('users').select('company_id').eq('id', user?.id).single()
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Add Lender Entity</h1>
        <p className="mt-2 text-sm text-gray-600">Add a new entity you lend through.</p>
      </div>
      <LenderEntityForm companyId={userData?.company_id} />
    </div>
  )
}
