import { createClient } from '@/lib/supabase/server'
import SolicitorForm from '@/components/solicitors/SolicitorForm'

export default async function NewSolicitorPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: userData } = await supabase.from('users').select('company_id').eq('id', user?.id).single()
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Add Solicitor</h1>
        <p className="mt-2 text-sm text-gray-600">Add a new solicitor firm.</p>
      </div>
      <SolicitorForm companyId={userData?.company_id} />
    </div>
  )
}
