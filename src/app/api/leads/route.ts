import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    
    const { data: userData } = await supabase
      .from('users')
      .select('company_id')
      .eq('id', user?.id)
      .single()

    const { data: leads, error } = await supabase
      .from('loan_leads')
      .select('*, broker:brokers(name, company_name)')
      .eq('company_id', userData?.company_id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching leads:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ leads })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    console.log('📥 Creating lead:', body)

    const { companyId, ...leadData } = body

    const { data, error } = await supabase
      .from('loan_leads')
      .insert({
        ...leadData,
        company_id: companyId,
      })
      .select()
      .single()

    if (error) {
      console.error('❌ Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('✅ Lead created:', data)
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('❌ API error:', error)
    return NextResponse.json({
      error: 'Failed to create lead',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
