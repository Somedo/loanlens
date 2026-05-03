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

    const { data: brokers, error } = await supabase
      .from('brokers')
      .select('*')
      .eq('company_id', userData?.company_id)
      .order('name')

    if (error) {
      console.error('Error fetching brokers:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ brokers })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Failed to fetch brokers' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    console.log('📥 Creating broker:', body)

    const { companyId, ...brokerData } = body

    const { data, error } = await supabase
      .from('brokers')
      .insert({
        ...brokerData,
        company_id: companyId,
      })
      .select()
      .single()

    if (error) {
      console.error('❌ Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('✅ Broker created:', data)
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('❌ API error:', error)
    return NextResponse.json({
      error: 'Failed to create broker',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
