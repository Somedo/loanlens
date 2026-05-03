import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { calculateCompletion } from '@/lib/engine/completion'

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    const { data: loan, error: loanError } = await supabase
      .from('loans')
      .select('*, fees:loan_fees(*)')
      .eq('id', id)
      .single()
    
    if (loanError) return NextResponse.json({ error: loanError.message }, { status: 500 })
    
    const result = calculateCompletion(loan, loan.fees || [])
    
    const { error: updateError } = await supabase
      .from('loans')
      .update({
        retained_interest_amount: result.retained_interest_amount,
        net_to_solicitor: result.net_to_solicitor,
        total_lender_investment: result.total_lender_investment,
      })
      .eq('id', id)
    
    if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 })
    
    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to calculate completion' }, { status: 500 })
  }
}