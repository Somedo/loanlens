import { createClient } from '@/lib/supabase/server'
import LoanForm from '@/components/loans/LoanForm'
import { notFound } from 'next/navigation'

export default async function EditLoanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: userData } = await supabase.from('users').select('company_id').eq('id', user?.id).single()
  
  const { data: loan } = await supabase.from('loans').select('*, fees:loan_fees(*)').eq('id', id).eq('company_id', userData?.company_id).single()
  if (!loan) notFound()
  
  const { data: lenderEntities } = await supabase.from('lender_entities').select('id, name').eq('company_id', userData?.company_id).eq('is_active', true).order('name')
  const { data: brokers } = await supabase.from('brokers').select('id, name').eq('company_id', userData?.company_id).eq('is_active', true).order('name')
  const { data: solicitors } = await supabase.from('solicitors').select('id, firm_name').eq('company_id', userData?.company_id).eq('is_active', true).order('firm_name')
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Edit Loan</h1>
        <p className="mt-2 text-sm text-gray-600">Update loan details.</p>
      </div>
      <LoanForm loan={loan} lenderEntities={lenderEntities || []} brokers={brokers || []} solicitors={solicitors || []} companyId={userData?.company_id} />
    </div>
  )
}