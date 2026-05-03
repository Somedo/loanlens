import { createClient } from '@/lib/supabase/server'
import LoanForm from '@/components/loans/LoanForm'

export default async function NewLoanPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: userData } = await supabase.from('users').select('company_id').eq('id', user?.id).single()
  
  const { data: lenderEntities } = await supabase.from('lender_entities').select('id, name').eq('company_id', userData?.company_id).eq('is_active', true).order('name')
  const { data: brokers } = await supabase.from('brokers').select('id, name').eq('company_id', userData?.company_id).eq('is_active', true).order('name')
  const { data: solicitors } = await supabase.from('solicitors').select('id, firm_name').eq('company_id', userData?.company_id).eq('is_active', true).order('firm_name')
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Add Loan</h1>
        <p className="mt-2 text-sm text-gray-600">Create a new loan record.</p>
      </div>
      <LoanForm lenderEntities={lenderEntities || []} brokers={brokers || []} solicitors={solicitors || []} companyId={userData?.company_id} />
    </div>
  )
}
