'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SolicitorForm({ solicitor, companyId }: any) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const [formData, setFormData] = useState({
    firm_name: solicitor?.firm_name || '',
    sra_number: solicitor?.sra_number || '',
    contact_name: solicitor?.contact_name || '',
    email: solicitor?.email || '',
    phone: solicitor?.phone || '',
    address_line1: solicitor?.address_line1 || '',
    address_line2: solicitor?.address_line2 || '',
    city: solicitor?.city || '',
    postcode: solicitor?.postcode || '',
    default_discharge_fee: solicitor?.default_discharge_fee || null,
    is_active: solicitor?.is_active ?? true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      const url = solicitor?.id ? `/api/solicitors/${solicitor.id}` : '/api/solicitors'
      const method = solicitor?.id ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, companyId }),
      })

      if (response.ok) {
        setMessage('Solicitor saved successfully!')
        setTimeout(() => router.push('/solicitors'), 1000)
      } else {
        setMessage('Failed to save solicitor')
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
            <label className="block text-sm font-medium text-gray-900">Firm Name *</label>
            <input type="text" value={formData.firm_name} onChange={(e) => setFormData({ ...formData, firm_name: e.target.value })} className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900">SRA Number</label>
            <input type="text" value={formData.sra_number} onChange={(e) => setFormData({ ...formData, sra_number: e.target.value })} className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900">Default Discharge Fee (£)</label>
            <input type="number" step="0.01" value={formData.default_discharge_fee || ''} onChange={(e) => setFormData({ ...formData, default_discharge_fee: parseFloat(e.target.value) || null })} className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300" />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-900">Contact Name</label>
            <input type="text" value={formData.contact_name} onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })} className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900">Email</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900">Phone</label>
            <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300" />
          </div>

          <div className="sm:col-span-2 border-t pt-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Address</h3>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-900">Address Line 1</label>
            <input type="text" value={formData.address_line1} onChange={(e) => setFormData({ ...formData, address_line1: e.target.value })} className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300" />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-900">Address Line 2</label>
            <input type="text" value={formData.address_line2} onChange={(e) => setFormData({ ...formData, address_line2: e.target.value })} className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900">City</label>
            <input type="text" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900">Postcode</label>
            <input type="text" value={formData.postcode} onChange={(e) => setFormData({ ...formData, postcode: e.target.value })} className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300" />
          </div>

          <div className="sm:col-span-2">
            <label className="flex items-center cursor-pointer">
              <input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-600" />
              <span className="ml-2 text-sm text-gray-900">Active solicitor</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-x-6">
        {message && <span className={`text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{message}</span>}
        <button type="button" onClick={() => router.push('/solicitors')} className="text-sm font-semibold text-gray-900">Cancel</button>
        <button type="submit" disabled={saving} className="rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50">
          {saving ? 'Saving...' : solicitor?.id ? 'Update Solicitor' : 'Add Solicitor'}
        </button>
      </div>
    </form>
  )
}
