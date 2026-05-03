import { createClient } from '@/lib/supabase/server'
import LeadForm from '@/components/leads/LeadForm'

export default async function NewLeadPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: userData } = await supabase
    .from('users')
    .select('company_id')
    .eq('id', user?.id)
    .single()
  
  // Fetch active brokers for the dropdown
  const { data: brokers } = await supabase
    .from('brokers')
    .select('id, name, company_name')
    .eq('company_id', userData?.company_id)
    .eq('is_active', true)
    .order('name')
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">New Lead</h1>
        <p className="mt-2 text-sm text-gray-600">
          Add a new loan opportunity from a broker.
        </p>
      </div>

      <LeadForm brokers={brokers || []} companyId={userData?.company_id} />
    </div>
  )
}
