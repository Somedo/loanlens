import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

const admin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') || '/dashboard'

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`)
  }

  const supabase = await createClient()

  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
  if (exchangeError) {
    return NextResponse.redirect(`${origin}/login?error=auth`)
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.redirect(`${origin}/login?error=no_user`)
  }

  // Skip if already provisioned (e.g. link clicked twice)
  const { data: existing } = await admin
    .from('users')
    .select('id, company_id')
    .eq('id', user.id)
    .maybeSingle()

  if (existing?.company_id) {
    return NextResponse.redirect(`${origin}${next}`)
  }

  const meta = user.user_metadata || {}
  const role = (meta.signup_role as string) === 'lender' ? 'lender' : 'broker'
  const entityType = (meta.entity_type as string) === 'individual' ? 'individual' : 'company'
  const firstName = (meta.first_name as string) || ''
  const lastName = (meta.last_name as string) || ''
  const companyName = (meta.company_name as string) || ''

  // Build the entity name
  const individualName = [firstName, lastName].filter(Boolean).join(' ').trim()
  const entityName =
    entityType === 'individual'
      ? (individualName || 'Individual Lender')
      : (companyName || 'My Company')

  // 1. Create the entity (companies row — may represent a person)
  const { data: company, error: companyError } = await admin
    .from('companies')
    .insert({
      name: entityName,
      email: user.email,
      company_type: role,
      entity_type: entityType,
      individual_first_name: entityType === 'individual' ? firstName : null,
      individual_last_name: entityType === 'individual' ? lastName : null,
      can_broker: role === 'broker',
      can_lend: role === 'lender',
      is_active: true,
    })
    .select('id')
    .single()

  if (companyError || !company) {
    return NextResponse.redirect(`${origin}/login?error=company_create`)
  }

  // 2. Create the user profile (the person logging in) — always has a name
  const { error: userError } = await admin
    .from('users')
    .insert({
      id: user.id,
      company_id: company.id,
      email: user.email,
      first_name: firstName || null,
      last_name: lastName || null,
      role: 'admin',
      is_active: true,
    })

  if (userError) {
    return NextResponse.redirect(`${origin}/login?error=profile_create`)
  }

  return NextResponse.redirect(`${origin}${next}`)
}