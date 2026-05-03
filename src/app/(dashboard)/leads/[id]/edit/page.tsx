import { createClient } from '@/lib/supabase/server'
import LeadForm from '@/components/leads/LeadForm'
import { notFound } from 'next/navigation'

export default async function EditLeadPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: userData } = await supabase
    .from('users')
    .select('company_id')
    .eq('id', user?.id)
    .single()
  
  const { data: lead } = await supabase
    .from('loan_leads')
    .select('*')
    .eq('id', params.id)
    .eq('company_id', userData?.company_id)
    .single()
  
  if (!lead) {
    notFound()
  }
  
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
        <h1 className="text-2xl font-bold text-gray-900">Edit Lead</h1>
        <p className="mt-2 text-sm text-gray-600">
          Update loan opportunity details.
        </p>
      </div>

      <LeadForm lead={lead} brokers={brokers || []} companyId={userData?.company_id} />
    </div>
  )
}
