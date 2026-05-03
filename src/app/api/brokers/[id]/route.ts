import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    
    const { data: broker, error } = await supabase
      .from('brokers')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('Error fetching broker:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ broker })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Failed to fetch broker' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    console.log('📥 Updating broker:', params.id, body)

    const { companyId, ...brokerData } = body

    const { data, error } = await supabase
      .from('brokers')
      .update(brokerData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('❌ Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('✅ Broker updated:', data)
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('❌ API error:', error)
    return NextResponse.json({
      error: 'Failed to update broker',
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

    console.log('📥 Deleting broker:', params.id)

    const { error } = await supabase
      .from('brokers')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('❌ Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('✅ Broker deleted')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('❌ API error:', error)
    return NextResponse.json({
      error: 'Failed to delete broker',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
