import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: userData } = await supabase
    .from('users')
    .select('id, company_id')
    .eq('id', user?.id)
    .single()
  
  const { data: companies } = await supabase
    .from('companies')
    .select('*')
  
  return NextResponse.json({
    userId: user?.id,
    userData,
    allCompanies: companies
  })
}