'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Company {
  id: string
  name: string
  lender_type?: string
  individual_first_name?: string
  individual_last_name?: string
  co_lender_first_name?: string
  co_lender_last_name?: string
  registration_number?: string
  entity_type?: string
  registered_address_line1?: string
  registered_address_line2?: string
  registered_address_city?: string
  registered_address_postcode?: string
  trading_address_line1?: string
  trading_address_line2?: string
  trading_address_city?: string
  trading_address_postcode?: string
  phone?: string
  email?: string
  website?: string
  fca_number?: string
  bank_name?: string
  bank_account_name?: string
  bank_sort_code?: string
  bank_account_number?: string
  country?: string
}

export default function CompanySettingsForm({ company }: { company: Company }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('details')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const [formData, setFormData] = useState({
    lender_type: company?.lender_type || 'joint',
    name: company?.name || '',
    individual_first_name: company?.individual_first_name || '',
    individual_last_name: company?.individual_last_name || '',
    co_lender_first_name: company?.co_lender_first_name || '',
    co_lender_last_name: company?.co_lender_last_name || '',
    registration_number: company?.registration_number || '',
    entity_type: company?.entity_type || '',
    registered_address_line1: company?.registered_address_line1 || '',
    registered_address_line2: company?.registered_address_line2 || '',
    registered_address_city: company?.registered_address_city || '',
    registered_address_postcode: company?.registered_address_postcode || '',
    country: company?.country || 'United Kingdom',
    trading_address_line1: company?.trading_address_line1 || '',
    trading_address_line2: company?.trading_address_line2 || '',
    trading_address_city: company?.trading_address_city || '',
    trading_address_postcode: company?.trading_address_postcode || '',
    phone: company?.phone || '',
    email: company?.email || '',
    website: company?.website || '',
    fca_number: company?.fca_number || '',
    bank_name: company?.bank_name || '',
    bank_account_name: company?.bank_account_name || '',
    bank_sort_code: company?.bank_sort_code || '',
    bank_account_number: company?.bank_account_number || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      const response = await fetch('/api/settings/company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyId: company.id, ...formData }),
      })

      if (response.ok) {
        setMessage('Settings saved successfully!')
        router.refresh()
      } else {
        setMessage('Failed to save settings')
      }
    } catch (error) {
      setMessage('An error occurred')
    } finally {
      setSaving(false)
    }
  }

  const tabs = [
    { id: 'details', name: 'Lender Details' },
    { id: 'addresses', name: 'Addresses' },
    { id: 'contact', name: 'Contact Info' },
    { id: 'regulatory', name: 'Regulatory' },
    { id: 'banking', name: 'Banking' },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'details' && (
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">Lending As</label>
              <div className="flex flex-col gap-3">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="lender_type"
                    value="individual"
                    checked={formData.lender_type === 'individual'}
                    onChange={(e) => setFormData({ ...formData, lender_type: e.target.value })}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-600"
                  />
                  <span className="ml-2 text-sm text-gray-900">Individual / Private Person</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="lender_type"
                    value="joint"
                    checked={formData.lender_type === 'joint'}
                    onChange={(e) => setFormData({ ...formData, lender_type: e.target.value })}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-600"
                  />
                  <span className="ml-2 text-sm text-gray-900">Joint Lenders (e.g., Married Couple)</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="lender_type"
                    value="company"
                    checked={formData.lender_type === 'company'}
                    onChange={(e) => setFormData({ ...formData, lender_type: e.target.value })}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-600"
                  />
                  <span className="ml-2 text-sm text-gray-900">Company / Entity</span>
                </label>
              </div>
            </div>

            {formData.lender_type === 'individual' && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 pt-6 border-t">
                <div>
                  <label className="block text-sm font-medium text-gray-900">First Name</label>
                  <input
                    type="text"
                    value={formData.individual_first_name}
                    onChange={(e) => setFormData({ ...formData, individual_first_name: e.target.value })}
                    className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900">Last Name</label>
                  <input
                    type="text"
                    value={formData.individual_last_name}
                    onChange={(e) => setFormData({ ...formData, individual_last_name: e.target.value })}
                    className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-900">Display Name (for documents)</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                    placeholder="e.g., John Smith"
                    required
                  />
                </div>
              </div>
            )}

            {formData.lender_type === 'joint' && (
              <div className="pt-6 border-t space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-4">First Lender</h3>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-900">First Name</label>
                      <input
                        type="text"
                        value={formData.individual_first_name}
                        onChange={(e) => setFormData({ ...formData, individual_first_name: e.target.value })}
                        className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900">Last Name</label>
                      <input
                        type="text"
                        value={formData.individual_last_name}
                        onChange={(e) => setFormData({ ...formData, individual_last_name: e.target.value })}
                        className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="border-t pt-6">
                  <h3 className="text-base font-semibold text-gray-900 mb-4">Second Lender (Co-Lender)</h3>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-900">First Name</label>
                      <input
                        type="text"
                        value={formData.co_lender_first_name}
                        onChange={(e) => setFormData({ ...formData, co_lender_first_name: e.target.value })}
                        className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900">Last Name</label>
                      <input
                        type="text"
                        value={formData.co_lender_last_name}
                        onChange={(e) => setFormData({ ...formData, co_lender_last_name: e.target.value })}
                        className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="border-t pt-6">
                  <label className="block text-sm font-medium text-gray-900">Display Name (for documents)</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                    placeholder="e.g., John Smith & Jane Smith"
                    required
                  />
                </div>
              </div>
            )}

            {formData.lender_type === 'company' && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 pt-6 border-t">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-900">Company Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900">Registration Number</label>
                  <input
                    type="text"
                    value={formData.registration_number}
                    onChange={(e) => setFormData({ ...formData, registration_number: e.target.value })}
                    className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900">Entity Type</label>
                  <select
                    value={formData.entity_type}
                    onChange={(e) => setFormData({ ...formData, entity_type: e.target.value })}
                    className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                  >
                    <option value="">Select...</option>
                    <option value="limited_company">Limited Company</option>
                    <option value="llp">LLP</option>
                    <option value="partnership">Partnership</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'addresses' && (
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {formData.lender_type === 'company' ? 'Registered Address' : 'Residential Address'}
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-900">Address Line 1</label>
              <input
                type="text"
                value={formData.registered_address_line1}
                onChange={(e) => setFormData({ ...formData, registered_address_line1: e.target.value })}
                className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-900">Address Line 2</label>
              <input
                type="text"
                value={formData.registered_address_line2}
                onChange={(e) => setFormData({ ...formData, registered_address_line2: e.target.value })}
                className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900">City</label>
              <input
                type="text"
                value={formData.registered_address_city}
                onChange={(e) => setFormData({ ...formData, registered_address_city: e.target.value })}
                className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900">Postcode</label>
              <input
                type="text"
                value={formData.registered_address_postcode}
                onChange={(e) => setFormData({ ...formData, registered_address_postcode: e.target.value })}
                className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-900">Country</label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'contact' && (
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-900">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'regulatory' && (
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-8">
          <div>
            <label className="block text-sm font-medium text-gray-900">FCA Number</label>
            <input
              type="text"
              value={formData.fca_number}
              onChange={(e) => setFormData({ ...formData, fca_number: e.target.value })}
              className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
            />
          </div>
        </div>
      )}

      {activeTab === 'banking' && (
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-900">Bank Name</label>
              <input
                type="text"
                value={formData.bank_name}
                onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-900">Account Name</label>
              <input
                type="text"
                value={formData.bank_account_name}
                onChange={(e) => setFormData({ ...formData, bank_account_name: e.target.value })}
                className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900">Sort Code</label>
              <input
                type="text"
                value={formData.bank_sort_code}
                onChange={(e) => setFormData({ ...formData, bank_sort_code: e.target.value })}
                className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900">Account Number</label>
              <input
                type="text"
                value={formData.bank_account_number}
                onChange={(e) => setFormData({ ...formData, bank_account_number: e.target.value })}
                className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-end gap-x-6">
        {message && (
          <span className={`text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </span>
        )}
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </form>
  )
}
