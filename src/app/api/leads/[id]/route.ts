import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    
    const { data: lead, error } = await supabase
      .from('loan_leads')
      .select('*, broker:brokers(name, company_name)')
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('Error fetching lead:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ lead })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Failed to fetch lead' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    console.log('📥 Updating lead:', params.id, body)

    const { companyId, ...leadData } = body

    const { data, error } = await supabase
      .from('loan_leads')
      .update(leadData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('❌ Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('✅ Lead updated:', data)
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('❌ API error:', error)
    return NextResponse.json({
      error: 'Failed to update lead',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()

    console.log('📥 Deleting lead:', params.id)

    const { error } = await supabase
      .from('loan_leads')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('❌ Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('✅ Lead deleted')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('❌ API error:', error)
    return NextResponse.json({
      error: 'Failed to delete lead',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
