import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get user's company FROM user_companies TABLE (NOT users table!)
  const { data: userCompany } = await supabase
    .from('user_companies')
    .select('company_id')
    .eq('user_id', user.id)
    .single()

  if (!userCompany) {
    return NextResponse.json({ error: 'No company found' }, { status: 400 })
  }

  const companyId = userCompany.company_id

  // Query deals for this company
  const { data, error } = await supabase
    .from('deals')
    .select('*')
    .eq('company_id', companyId)
    .is('deleted_at', null)
    .order('stage', { ascending: true })
    .order('position', { ascending: true })

  if (error) {
    console.error('Deals fetch error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data || [])
}

export async function POST(request: Request) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()

  // Get user's company FROM user_companies TABLE (NOT users table!)
  const { data: userCompany } = await supabase
    .from('user_companies')
    .select('company_id')
    .eq('user_id', user.id)
    .single()

  if (!userCompany) {
    return NextResponse.json({ error: 'No company found' }, { status: 400 })
  }

  const companyId = userCompany.company_id

  // Get max position in the target stage
  const { data: maxPosition } = await supabase
    .from('deals')
    .select('position')
    .eq('stage', body.stage || 'lead')
    .eq('company_id', companyId)
    .order('position', { ascending: false })
    .limit(1)
    .maybeSingle()

  const { data, error } = await supabase
    .from('deals')
    .insert({
      ...body,
      company_id: companyId,
      position: (maxPosition?.position || -1) + 1,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}