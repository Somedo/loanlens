import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import LandingPage from '@/components/landing/LandingPage'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Logged-in users go straight to their dashboard
  if (user) {
    redirect('/dashboard')
  }

  // Logged-out visitors see the marketing landing page
  return <LandingPage />
}
