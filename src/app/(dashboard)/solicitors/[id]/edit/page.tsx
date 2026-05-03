import { createClient } from '@/lib/supabase/server'
import SolicitorForm from '@/components/solicitors/SolicitorForm'
import { notFound } from 'next/navigation'

export default async function EditSolicitorPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: userData } = await supabase.from('users').select('company_id').eq('id', user?.id).single()
  const { data: solicitor } = await supabase.from('solicitors').select('*').eq('id', params.id).eq('company_id', userData?.company_id).single()
  
  if (!solicitor) notFound()
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Edit Solicitor</h1>
        <p className="mt-2 text-sm text-gray-600">Update solicitor details.</p>
      </div>
      <SolicitorForm solicitor={solicitor} companyId={userData?.company_id} />
    </div>
  )
}
