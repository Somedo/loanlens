import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    // Delete fees first (foreign key constraint)
    await supabase.from('loan_fees').delete().eq('loan_id', id)
    
    // Then delete the loan
    const { error } = await supabase.from('loans').delete().eq('id', id)
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete loan' }, { status: 500 })
  }
}