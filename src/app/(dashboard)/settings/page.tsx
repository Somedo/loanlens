import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CompanySettingsForm from '@/components/settings/CompanySettingsForm'

export default async function SettingsPage() {
  const supabase = await createClient()
  
  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    redirect('/login')
  }

  // Get the user's company_id from the users table
  const { data: userData } = await supabase
    .from('users')
    .select('company_id')
    .eq('id', user.id)
    .single()

  if (!userData?.company_id) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl font-bold text-gray-900">Company Settings</h1>
          <p className="mt-2 text-sm text-gray-700">No company found. Please contact support.</p>
        </div>
      </div>
    )
  }

  // Fetch the company data
  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('id', userData.company_id)
    .single()

  if (!company) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl font-bold text-gray-900">Company Settings</h1>
          <p className="mt-2 text-sm text-gray-700">Company not found. Please contact support.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Company Settings</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your company profile, addresses, and regulatory information.
          </p>
        </div>

        <CompanySettingsForm company={company} />
      </div>
    </div>
  )
}
