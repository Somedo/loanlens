import { createClient } from '@/lib/supabase/server'
import BrokerForm from '@/components/brokers/BrokerForm'

export default async function NewBrokerPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: userData } = await supabase
    .from('users')
    .select('company_id')
    .eq('id', user?.id)
    .single()
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Add Broker</h1>
        <p className="mt-2 text-sm text-gray-600">
          Add a new broker contact with their commission structure.
        </p>
      </div>

      <BrokerForm companyId={userData?.company_id} />
    </div>
  )
}
