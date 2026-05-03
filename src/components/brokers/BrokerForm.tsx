'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Broker {
  id?: string
  name: string
  company_name: string
  email: string
  phone: string
  default_commission_type: 'percentage' | 'fixed'
  default_commission_rate: number | null
  default_commission_amount: number | null
  notes: string
  is_active: boolean
}

export default function BrokerForm({ broker, companyId }: { broker?: Broker; companyId: string }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const [formData, setFormData] = useState({
    name: broker?.name || '',
    company_name: broker?.company_name || '',
    email: broker?.email || '',
    phone: broker?.phone || '',
    default_commission_type: broker?.default_commission_type || 'percentage',
    default_commission_rate: broker?.default_commission_rate || null,
    default_commission_amount: broker?.default_commission_amount || null,
    notes: broker?.notes || '',
    is_active: broker?.is_active ?? true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      const url = broker?.id ? `/api/brokers/${broker.id}` : '/api/brokers'
      const method = broker?.id ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          companyId,
        }),
      })

      if (response.ok) {
        setMessage('Broker saved successfully!')
        setTimeout(() => router.push('/brokers'), 1000)
      } else {
        setMessage('Failed to save broker')
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
            <label className="block text-sm font-medium text-gray-900">Contact Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-900">Company Name</label>
            <input
              type="text"
              value={formData.company_name}
              onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900">Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
            />
          </div>

          <div className="sm:col-span-2 border-t pt-6">
            <h3 className="text-base font-semibold text-gray-900 mb-2">Typical Commission (Optional)</h3>
            <p className="text-sm text-gray-600 mb-4">Reference only - actual commission is set per deal</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">Commission Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="commission_type"
                      value="percentage"
                      checked={formData.default_commission_type === 'percentage'}
                      onChange={(e) => setFormData({ ...formData, default_commission_type: 'percentage' })}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-600"
                    />
                    <span className="ml-2 text-sm text-gray-900">Percentage</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="commission_type"
                      value="fixed"
                      checked={formData.default_commission_type === 'fixed'}
                      onChange={(e) => setFormData({ ...formData, default_commission_type: 'fixed' })}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-600"
                    />
                    <span className="ml-2 text-sm text-gray-900">Fixed Amount</span>
                  </label>
                </div>
              </div>

              {formData.default_commission_type === 'percentage' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-900">Typical Rate (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.default_commission_rate || ''}
                    onChange={(e) => setFormData({ ...formData, default_commission_rate: parseFloat(e.target.value) || null })}
                    className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                    placeholder="e.g., 1.50"
                  />
                  <p className="mt-1 text-sm text-gray-500">Reference only - can vary per deal</p>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-900">Typical Amount (£)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.default_commission_amount || ''}
                    onChange={(e) => setFormData({ ...formData, default_commission_amount: parseFloat(e.target.value) || null })}
                    className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                    placeholder="e.g., 5000"
                  />
                  <p className="mt-1 text-sm text-gray-500">Reference only - can vary per deal</p>
                </div>
              )}
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-900">Notes</label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
              <span className="ml-2 text-sm text-gray-900">Active broker</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-x-6">
        {message && (
          <span className={`text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </span>
        )}
        <button
          type="button"
          onClick={() => router.push('/brokers')}
          className="text-sm font-semibold text-gray-900"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50"
        >
          {saving ? 'Saving...' : broker?.id ? 'Update Broker' : 'Add Broker'}
        </button>
      </div>
    </form>
  )
}
