import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { calculateRedemption } from '@/lib/engine/redemption'

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { redemption_date, preview, override } = body

    if (!redemption_date) {
      return NextResponse.json({ error: 'redemption_date is required' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: loan, error: loanError } = await supabase
      .from('loans')
      .select('*, fees:loan_fees(*)')
      .eq('id', id)
      .single()
    if (loanError) return NextResponse.json({ error: loanError.message }, { status: 500 })
    if (!loan.completion_date) {
      return NextResponse.json({ error: 'Loan must have a completion date' }, { status: 400 })
    }

    // Always compute from the engine first
    const calculated = calculateRedemption(loan, loan.fees || [], new Date(redemption_date))

    // PREVIEW: return figures without saving
    if (preview) {
      return NextResponse.json({ success: true, data: calculated })
    }

    // SAVE: use overridden figures if supplied, else the calculated ones
    const final = override ? { ...calculated, ...override } : calculated

    const { error: updateError } = await supabase
      .from('loans')
      .update({
        redemption_date,
        status: 'redeemed',
        actual_days_held: final.actual_days_held,
        months_billed: final.months_billed,
        interest_refund: final.interest_refund,
        exit_fees_charged: final.exit_fees_charged,
        total_redemption_amount: final.total_redemption_amount,
        redemption_statement_generated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 })
    return NextResponse.json({ success: true, data: final })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to calculate redemption' }, { status: 500 })
  }
}