import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const { data: userData } = await supabase.from('users').select('company_id').eq('id', user?.id).single()
    const { data: solicitors, error } = await supabase.from('solicitors').select('*').eq('company_id', userData?.company_id).order('firm_name')
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ solicitors })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch solicitors' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { companyId, ...solicitorData } = body
    const { data, error } = await supabase.from('solicitors').insert({ ...solicitorData, company_id: companyId }).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create solicitor' }, { status: 500 })
  }
}
