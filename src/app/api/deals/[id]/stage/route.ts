import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get user's company FROM user_companies TABLE
  const { data: userCompany } = await supabase
    .from('user_companies')
    .select('company_id')
    .eq('user_id', user.id)
    .single()

  if (!userCompany) {
    return NextResponse.json({ error: 'No company found' }, { status: 400 })
  }

  const body = await request.json()
  const { stage, position } = body

  // Use the reorder_deals_in_stage function to handle position updates
  const { error } = await supabase.rpc('reorder_deals_in_stage', {
    p_deal_id: id,
    p_new_position: position,
    p_new_stage: stage
  })

  if (error) {
    console.error('Error calling reorder_deals_in_stage:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Fetch the updated deal to return
  const { data: updatedDeal, error: fetchError } = await supabase
    .from('deals')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 })
  }

  return NextResponse.json(updatedDeal)
}