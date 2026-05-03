import { createClient } from '@/lib/supabase/server'
import BrokerForm from '@/components/brokers/BrokerForm'
import { notFound } from 'next/navigation'

export default async function EditBrokerPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: userData } = await supabase
    .from('users')
    .select('company_id')
    .eq('id', user?.id)
    .single()
  
  const { data: broker } = await supabase
    .from('brokers')
    .select('*')
    .eq('id', params.id)
    .eq('company_id', userData?.company_id)
    .single()
  
  if (!broker) {
    notFound()
  }
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Edit Broker</h1>
        <p className="mt-2 text-sm text-gray-600">
          Update broker contact details and commission structure.
        </p>
      </div>

      <BrokerForm broker={broker} companyId={userData?.company_id} />
    </div>
  )
}
