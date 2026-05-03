'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface LenderEntity {
  id?: string
  name: string
  entity_type: string
  individual_first_name: string
  individual_last_name: string
  co_lender_first_name: string
  co_lender_last_name: string
  company_number: string
  registered_address_line1: string
  registered_address_line2: string
  registered_address_city: string
  registered_address_postcode: string
  is_active: boolean
}

export default function LenderEntityForm({ entity, companyId }: { entity?: LenderEntity; companyId: string }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const [formData, setFormData] = useState({
    name: entity?.name || '',
    entity_type: entity?.entity_type || 'individual',
    individual_first_name: entity?.individual_first_name || '',
    individual_last_name: entity?.individual_last_name || '',
    co_lender_first_name: entity?.co_lender_first_name || '',
    co_lender_last_name: entity?.co_lender_last_name || '',
    company_number: entity?.company_number || '',
    registered_address_line1: entity?.registered_address_line1 || '',
    registered_address_line2: entity?.registered_address_line2 || '',
    registered_address_city: entity?.registered_address_city || '',
    registered_address_postcode: entity?.registered_address_postcode || '',
    is_active: entity?.is_active ?? true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      const url = entity?.id ? `/api/lender-entities/${entity.id}` : '/api/lender-entities'
      const method = entity?.id ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, companyId }),
      })

      if (response.ok) {
        setMessage('Entity saved successfully!')
        setTimeout(() => router.push('/lender-entities'), 1000)
      } else {
        setMessage('Failed to save entity')
      }
    } catch (error) {
      setMessage('An error occurred')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-900">Entity Type *</label>
            <select
              value={formData.entity_type}
              onChange={(e) => setFormData({ ...formData, entity_type: e.target.value })}
              className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
              required
            >
              <option value="individual">Individual</option>
              <option value="joint">Joint (Two Individuals)</option>
              <option value="limited_company">Limited Company</option>
              <option value="llp">LLP</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-900">Display Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
              placeholder="e.g. Isaac & Joanna Davila, SL White Rose Ltd"
              required
            />
          </div>

          {formData.entity_type === 'individual' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-900">First Name</label>
                <input
                  type="text"
                  value={formData.individual_first_name}
                  onChange={(e) => setFormData({ ...formData, individual_first_name: e.target.value })}
                  className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900">Last Name</label>
                <input
                  type="text"
                  value={formData.individual_last_name}
                  onChange={(e) => setFormData({ ...formData, individual_last_name: e.target.value })}
                  className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                />
              </div>
            </>
          )}

          {formData.entity_type === 'joint' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-900">First Lender - First Name</label>
                <input
                  type="text"
                  value={formData.individual_first_name}
                  onChange={(e) => setFormData({ ...formData, individual_first_name: e.target.value })}
                  className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900">First Lender - Last Name</label>
                <input
                  type="text"
                  value={formData.individual_last_name}
                  onChange={(e) => setFormData({ ...formData, individual_last_name: e.target.value })}
                  className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900">Second Lender - First Name</label>
                <input
                  type="text"
                  value={formData.co_lender_first_name}
                  onChange={(e) => setFormData({ ...formData, co_lender_first_name: e.target.value })}
                  className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900">Second Lender - Last Name</label>
                <input
                  type="text"
                  value={formData.co_lender_last_name}
                  onChange={(e) => setFormData({ ...formData, co_lender_last_name: e.target.value })}
                  className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                />
              </div>
            </>
          )}

          {(formData.entity_type === 'limited_company' || formData.entity_type === 'llp') && (
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-900">Company Number</label>
              <input
                type="text"
                value={formData.company_number}
                onChange={(e) => setFormData({ ...formData, company_number: e.target.value })}
                className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
              />
            </div>
          )}

          <div className="sm:col-span-2 border-t pt-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Registered Address</h3>
          </div>

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
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-600"
              />
              <span className="ml-2 text-sm text-gray-900">Active entity</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-x-6">
        {message && <span className={`text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{message}</span>}
        <button type="button" onClick={() => router.push('/lender-entities')} className="text-sm font-semibold text-gray-900">Cancel</button>
        <button type="submit" disabled={saving} className="rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50">
          {saving ? 'Saving...' : entity?.id ? 'Update Entity' : 'Add Entity'}
        </button>
      </div>
    </form>
  )
}
