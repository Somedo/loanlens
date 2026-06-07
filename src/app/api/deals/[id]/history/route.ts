import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: userData } = await supabase
    .from('users')
    .select('company_id')
    .eq('id', user.id)
    .single()

  if (!userData?.company_id) {
    return NextResponse.json({ error: 'No company found' }, { status: 400 })
  }

  // Verify deal belongs to user's company
  const { data: deal } = await supabase
    .from('deals')
    .select('id')
    .eq('id', id)
    .eq('company_id', userData.company_id)
    .single()

  if (!deal) {
    return NextResponse.json({ error: 'Deal not found' }, { status: 404 })
  }

  const { data, error } = await supabase
    .from('deal_stage_history')
    .select('*')
    .eq('deal_id', id)
    .order('changed_at', { ascending: false })

  if (error) {
    // Table may not exist yet — return empty array gracefully
    return NextResponse.json([])
  }

  return NextResponse.json(data ?? [])
}
