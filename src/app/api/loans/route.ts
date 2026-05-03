import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const { data: userData } = await supabase.from('users').select('company_id').eq('id', user?.id).single()
    const { data: loans, error } = await supabase.from('loans').select('*, lender_entity:lender_entities(name), broker:brokers(name)').eq('company_id', userData?.company_id).order('created_at', { ascending: false })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ loans })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch loans' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { companyId, fees, ...loanData } = body
    
    const { data: loan, error: loanError } = await supabase.from('loans').insert({ ...loanData, company_id: companyId }).select().single()
    if (loanError) return NextResponse.json({ error: loanError.message }, { status: 500 })
    
    if (fees && fees.length > 0) {
      const feesWithLoanId = fees.map((f: any) => ({ ...f, loan_id: loan.id }))
      const { error: feesError } = await supabase.from('loan_fees').insert(feesWithLoanId)
      if (feesError) return NextResponse.json({ error: feesError.message }, { status: 500 })
    }
    
    return NextResponse.json({ success: true, data: loan })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create loan' }, { status: 500 })
  }
}
