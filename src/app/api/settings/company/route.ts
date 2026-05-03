import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    
    console.log('📥 Received data:', body)
    
    const { companyId, ...companyData } = body

    console.log('🔑 Company ID:', companyId)
    console.log('📦 Update data:', companyData)

    const { data, error } = await supabase
      .from('companies')
      .update(companyData)
      .eq('id', companyId)
      .select()
      .single()

    if (error) {
      console.error('❌ Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('✅ Success:', data)
    return NextResponse.json({ success: true, data })
    
  } catch (error) {
    console.error('❌ API error:', error)
    return NextResponse.json({ 
      error: 'Failed to update company',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}