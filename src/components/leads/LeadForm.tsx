'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Broker {
  id: string
  name: string
  company_name: string
}

interface Lead {
  id?: string
  broker_id: string | null
  status: string
  loan_amount: number | null
  interest_rate: number | null
  term_months: number | null
  loan_type: string
  broker_commission_type: string
  broker_commission_rate: number | null
  broker_commission_amount: number | null
  borrower_name: string
  borrower_company: string
  borrower_email: string
  borrower_phone: string
  property_address: string
  property_value: number | null
  property_type: string
  ltv: number | null
  exit_strategy: string
  purpose: string
  requested_completion_date: string
  notes: string
  missing_info: string[]
}

export default function LeadForm({ 
  lead, 
  brokers,
  companyId 
}: { 
  lead?: Lead
  brokers: Broker[]
  companyId: string 
}) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [activeTab, setActiveTab] = useState('basics')

  const [formData, setFormData] = useState({
    broker_id: lead?.broker_id || null,
    status: lead?.status || 'new',
    loan_amount: lead?.loan_amount || null,
    interest_rate: lead?.interest_rate || null,
    term_months: lead?.term_months || null,
    loan_type: lead?.loan_type || '',
    broker_commission_type: lead?.broker_commission_type || 'percentage',
    broker_commission_rate: lead?.broker_commission_rate || null,
    broker_commission_amount: lead?.broker_commission_amount || null,
    borrower_name: lead?.borrower_name || '',
    borrower_company: lead?.borrower_company || '',
    borrower_email: lead?.borrower_email || '',
    borrower_phone: lead?.borrower_phone || '',
    property_address: lead?.property_address || '',
    property_value: lead?.property_value || null,
    property_type: lead?.property_type || '',
    ltv: lead?.ltv || null,
    exit_strategy: lead?.exit_strategy || '',
    purpose: lead?.purpose || '',
    requested_completion_date: lead?.requested_completion_date || '',
    notes: lead?.notes || '',
    missing_info: lead?.missing_info || [],
  })

 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      const url = lead?.id ? `/api/leads/${lead.id}` : '/api/leads'
      const method = lead?.id ? 'PUT' : 'POST'

      // Clean up empty strings - convert to null for database
      const cleanData = {
        ...formData,
        requested_completion_date: formData.requested_completion_date || null,
        companyId,
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanData),
      })

      if (response.ok) {
        setMessage('Lead saved successfully!')
        setTimeout(() => router.push('/leads'), 1000)
      } else {
        setMessage('Failed to save lead')
      }
    } catch (error) {
      setMessage('An error occurred')
    } finally {
      setSaving(false)
    }
  } 

  const tabs = [
    { id: 'basics', name: 'Loan Details' },
    { id: 'borrower', name: 'Borrower' },
    { id: 'property', name: 'Property' },
    { id: 'terms', name: 'Terms & Commission' },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Tabs */}
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

      {/* Loan Details Tab */}
      {activeTab === 'basics' && (
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-900">Broker</label>
              <select
                value={formData.broker_id || ''}
                onChange={(e) => setFormData({ ...formData, broker_id: e.target.value || null })}
                className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
              >
                <option value="">No broker</option>
                {brokers.map((broker) => (
                  <option key={broker.id} value={broker.id}>
                    {broker.name} {broker.company_name && `(${broker.company_name})`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900">Loan Amount (£) *</label>
              <input
                type="number"
                step="0.01"
                value={formData.loan_amount || ''}
                onChange={(e) => setFormData({ ...formData, loan_amount: parseFloat(e.target.value) || null })}
                className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900">Interest Rate (%) *</label>
              <input
                type="number"
                step="0.01"
                value={formData.interest_rate || ''}
                onChange={(e) => setFormData({ ...formData, interest_rate: parseFloat(e.target.value) || null })}
                className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900">Term (months) *</label>
              <input
                type="number"
                value={formData.term_months || ''}
                onChange={(e) => setFormData({ ...formData, term_months: parseInt(e.target.value) || null })}
                className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900">Loan Type</label>
              <select
                value={formData.loan_type}
                onChange={(e) => setFormData({ ...formData, loan_type: e.target.value })}
                className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
              >
                <option value="">Select...</option>
                <option value="first_charge">First Charge</option>
                <option value="second_charge">Second Charge</option>
                <option value="bridging">Bridging</option>
                <option value="development">Development</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-900">Purpose</label>
              <input
                type="text"
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                placeholder="e.g., Property purchase, Refurbishment"
              />
            </div>
          </div>
        </div>
      )}

      {/* Borrower Tab */}
      {activeTab === 'borrower' && (
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-900">Borrower Name *</label>
              <input
                type="text"
                value={formData.borrower_name}
                onChange={(e) => setFormData({ ...formData, borrower_name: e.target.value })}
                className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-900">Company (if applicable)</label>
              <input
                type="text"
                value={formData.borrower_company}
                onChange={(e) => setFormData({ ...formData, borrower_company: e.target.value })}
                className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900">Email</label>
              <input
                type="email"
                value={formData.borrower_email}
                onChange={(e) => setFormData({ ...formData, borrower_email: e.target.value })}
                className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900">Phone</label>
              <input
                type="tel"
                value={formData.borrower_phone}
                onChange={(e) => setFormData({ ...formData, borrower_phone: e.target.value })}
                className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
              />
            </div>
          </div>
        </div>
      )}

      {/* Property Tab */}
      {activeTab === 'property' && (
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-900">Property Address</label>
              <input
                type="text"
                value={formData.property_address}
                onChange={(e) => setFormData({ ...formData, property_address: e.target.value })}
                className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900">Property Value (£)</label>
              <input
                type="number"
                step="0.01"
                value={formData.property_value || ''}
                onChange={(e) => setFormData({ ...formData, property_value: parseFloat(e.target.value) || null })}
                className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900">LTV (%)</label>
              <input
                type="number"
                step="0.01"
                value={formData.ltv || ''}
                onChange={(e) => setFormData({ ...formData, ltv: parseFloat(e.target.value) || null })}
                className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-900">Property Type</label>
              <select
                value={formData.property_type}
                onChange={(e) => setFormData({ ...formData, property_type: e.target.value })}
                className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
              >
                <option value="">Select...</option>
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="land">Land</option>
                <option value="mixed_use">Mixed Use</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-900">Exit Strategy</label>
              <input
                type="text"
                value={formData.exit_strategy}
                onChange={(e) => setFormData({ ...formData, exit_strategy: e.target.value })}
                className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                placeholder="e.g., Sale, Refinance"
              />
            </div>
          </div>
        </div>
      )}

      {/* Terms & Commission Tab */}
      {activeTab === 'terms' && (
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-900">Requested Completion Date</label>
              <input
                type="date"
                value={formData.requested_completion_date}
                onChange={(e) => setFormData({ ...formData, requested_completion_date: e.target.value })}
                className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
              />
            </div>

            <div className="sm:col-span-2 border-t pt-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Broker Commission</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">Commission Type</label>
                  <div className="flex gap-4">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="commission_type"
                        value="percentage"
                        checked={formData.broker_commission_type === 'percentage'}
                        onChange={(e) => setFormData({ ...formData, broker_commission_type: 'percentage' })}
                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-600"
                      />
                      <span className="ml-2 text-sm text-gray-900">Percentage</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="commission_type"
                        value="fixed"
                        checked={formData.broker_commission_type === 'fixed'}
                        onChange={(e) => setFormData({ ...formData, broker_commission_type: 'fixed' })}
                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-600"
                      />
                      <span className="ml-2 text-sm text-gray-900">Fixed Amount</span>
                    </label>
                  </div>
                </div>

                {formData.broker_commission_type === 'percentage' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-900">Commission Rate (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.broker_commission_rate || ''}
                      onChange={(e) => setFormData({ ...formData, broker_commission_rate: parseFloat(e.target.value) || null })}
                      className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                      placeholder="e.g., 1.50"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-900">Commission Amount (£)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.broker_commission_amount || ''}
                      onChange={(e) => setFormData({ ...formData, broker_commission_amount: parseFloat(e.target.value) || null })}
                      className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                      placeholder="e.g., 5000"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="sm:col-span-2 border-t pt-6">
              <label className="block text-sm font-medium text-gray-900">Notes</label>
              <textarea
                rows={4}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
          type="button"
          onClick={() => router.push('/leads')}
          className="text-sm font-semibold text-gray-900"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50"
        >
          {saving ? 'Saving...' : lead?.id ? 'Update Lead' : 'Create Lead'}
        </button>
      </div>
    </form>
  )
}
