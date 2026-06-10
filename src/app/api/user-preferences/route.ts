import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const VALID_THEMES = ['oxblood', 'modern-blue', 'dark-pro', 'minimal-green', 'luxury-gold', 'tech-purple']

// Save the current user's theme preference
export async function PUT(request: Request) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json()
    const theme = body?.theme

    if (!theme || !VALID_THEMES.includes(theme)) {
      return NextResponse.json({ error: 'Invalid theme' }, { status: 400 })
    }

    const { error } = await supabase
      .from('users')
      .update({ theme_preference: theme })
      .eq('id', user.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true, theme })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// Load the current user's saved theme preference
export async function GET() {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('users')
      .select('theme_preference')
      .eq('id', user.id)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ theme: data?.theme_preference || 'oxblood' })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
