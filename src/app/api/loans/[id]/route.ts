import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: loan, error } = await supabase.from('loans').select('*, lender_entity:lender_entities(name), broker:brokers(name, company_name), solicitor:solicitors(firm_name), fees:loan_fees(*)').eq('id', id).single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ loan })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch loan' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const body = await request.json()
    const { companyId, fees, ...loanData } = body
    
    const { data: loan, error: loanError } = await supabase.from('loans').update(loanData).eq('id', id).select().single()
    if (loanError) return NextResponse.json({ error: loanError.message }, { status: 500 })
    
    // Delete existing fees
    await supabase.from('loan_fees').delete().eq('loan_id', id)
    
    // Insert new fees (strip id field to let Supabase auto-generate)
    if (fees && fees.length > 0) {
      const feesWithLoanId = fees.map((f: any) => {
        const { id: feeId, ...feeWithoutId } = f  // Remove id field
        return { ...feeWithoutId, loan_id: id }
      })
      const { error: feesError } = await supabase.from('loan_fees').insert(feesWithLoanId)
      if (feesError) return NextResponse.json({ error: feesError.message }, { status: 500 })
    }
    
    return NextResponse.json({ success: true, data: loan })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update loan' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { error } = await supabase.from('loans').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete loan' }, { status: 500 })
  }
}