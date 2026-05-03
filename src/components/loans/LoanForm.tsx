'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoanForm({ loan, lenderEntities, brokers, solicitors, companyId }: any) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [extracting, setExtracting] = useState(false)
  const [extractMessage, setExtractMessage] = useState('')
  
  const [expandedSections, setExpandedSections] = useState({
    loan: true,
    borrower: false,
    property: false,
    fees: true,
  })

  const [formData, setFormData] = useState({
    lender_entity_id: loan?.lender_entity_id || '',
    broker_id: loan?.broker_id || null,
    solicitor_id: loan?.solicitor_id || null,
    loan_reference: loan?.loan_reference || '',
    status: loan?.status || 'draft',
    gross_amount: loan?.gross_amount || null,
    term_months: loan?.term_months || null,
    monthly_interest_rate: loan?.monthly_interest_rate || null,
    interest_method: loan?.interest_method || 'retained',
    minimum_interest_period_months: loan?.minimum_interest_period_months || null,
    borrower_name: loan?.borrower_name || '',
    borrower_company: loan?.borrower_company || '',
    borrower_email: loan?.borrower_email || '',
    borrower_phone: loan?.borrower_phone || '',
    property_address: loan?.property_address || '',
    property_value: loan?.property_value || null,
    property_type: loan?.property_type || '',
    ltv: loan?.ltv || null,
    completion_date: loan?.completion_date || '',
    requires_notice_period: loan?.requires_notice_period || false,
    notice_received_date: loan?.notice_received_date || '',
    redemption_calculation_method: loan?.redemption_calculation_method || 'full_months',
    notes: loan?.notes || '',
  })

  const [fees, setFees] = useState(loan?.fees || [])

  const toggleSection = (section: 'loan' | 'borrower' | 'property' | 'fees') => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setExtracting(true)
    setExtractMessage('')

    try {
      const formDataUpload = new FormData()
      formDataUpload.append('file', file)

      const response = await fetch('/api/loans/extract-from-pdf', {
        method: 'POST',
        body: formDataUpload,
      })

      if (response.ok) {
        const result = await response.json()
        const extracted = result.data

        // Populate form with extracted data
        setFormData(prev => ({
          ...prev,
          loan_reference: extracted.loan_reference || prev.loan_reference,
          borrower_name: extracted.borrower_name || prev.borrower_name,
          borrower_company: extracted.borrower_company || prev.borrower_company,
          borrower_email: extracted.borrower_email || prev.borrower_email,
          borrower_phone: extracted.borrower_phone || prev.borrower_phone,
          property_address: extracted.property_address || prev.property_address,
          property_value: extracted.property_value || prev.property_value,
          ltv: extracted.ltv || prev.ltv,
          gross_amount: extracted.gross_amount || prev.gross_amount,
          monthly_interest_rate: extracted.monthly_interest_rate || prev.monthly_interest_rate,
          term_months: extracted.term_months || prev.term_months,
          minimum_interest_period_months: extracted.minimum_interest_period_months || prev.minimum_interest_period_months,
          completion_date: extracted.completion_date || prev.completion_date,
        }))

        // Populate fees if any were extracted
        if (extracted.fees && extracted.fees.length > 0) {
          setFees(extracted.fees)
        }

        // Expand all sections so user can review
        setExpandedSections({
          loan: true,
          borrower: true,
          property: true,
          fees: true,
        })

        setExtractMessage('✓ Data extracted successfully - please review and save')
      } else {
        const error = await response.json()
        setExtractMessage(`✗ Failed to extract: ${error.error}`)
      }
    } catch (error) {
      setExtractMessage('✗ Upload failed')
    } finally {
      setExtracting(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      const cleanData = {
        ...formData,
        broker_id: formData.broker_id || null,
        solicitor_id: formData.solicitor_id || null,
        completion_date: formData.completion_date || null,
        notice_received_date: formData.notice_received_date || null,
        borrower_email: formData.borrower_email || null,
        borrower_phone: formData.borrower_phone || null,
        property_type: formData.property_type || null,
        notes: formData.notes || null,
        companyId,
        fees,
      }

      const url = loan?.id ? `/api/loans/${loan.id}` : '/api/loans'
      const method = loan?.id ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanData),
      })

      if (response.ok) {
        setMessage('✓ Loan saved successfully')
        setTimeout(() => router.push('/loans'), 1000)
      } else {
        const error = await response.json()
        setMessage(`✗ Failed to save: ${error.error || 'Unknown error'}`)
      }
    } catch (error) {
      setMessage('✗ An error occurred')
    } finally {
      setSaving(false)
    }
  }

  const addFee = () => {
    setFees([...fees, {
      fee_name: '',
      fee_type: 'other',
      timing: 'completion',
      amount_type: 'fixed',
      amount_value: null,
      calculated_amount: null,
      deducted_from_gross: false,
      funded_by_lender: false,
    }])
  }

  const removeFee = (index: number) => {
    setFees(fees.filter((_: any, i: number) => i !== index))
  }

  const updateFee = (index: number, field: string, value: any) => {
    const updated = [...fees]
    updated[index] = { ...updated[index], [field]: value }
    setFees(updated)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {loan?.id ? 'Edit Loan' : 'Create New Loan'}
        </h1>
        <div className="flex gap-3">
          {message && (
            <span className={`text-sm self-center ${message.startsWith('✓') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </span>
          )}
          <button type="button" onClick={() => router.push('/loans')} className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50">
            {saving ? 'Saving...' : loan?.id ? 'Update Loan' : 'Create Loan'}
          </button>
        </div>
      </div>

      {/* Document Upload Section */}
      {!loan?.id && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-blue-900">Upload facility agreement</h3>
              <p className="mt-1 text-sm text-blue-700">Upload a PDF facility agreement to automatically extract loan details</p>
              <div className="mt-3 flex items-center gap-3">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500"
                />
                {extracting && <span className="text-sm text-blue-700">Extracting data...</span>}
                {extractMessage && (
                  <span className={`text-sm ${extractMessage.startsWith('✓') ? 'text-green-600' : 'text-red-600'}`}>
                    {extractMessage}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loan Details Section */}
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('loan')}
          className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <span className="text-base font-semibold text-gray-900">Loan Details</span>
          <span className="text-gray-500 text-sm">{expandedSections.loan ? '▼' : '▶'}</span>
        </button>
        {expandedSections.loan && (
          <div className="p-6 border-t border-gray-200">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Loan Reference *</label>
                <input type="text" value={formData.loan_reference} onChange={(e) => setFormData({ ...formData, loan_reference: e.target.value })} className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Status</label>
                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300">
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="redeemed">Redeemed</option>
                  <option value="defaulted">Defaulted</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-900 mb-2">Lender Entity *</label>
                <select value={formData.lender_entity_id} onChange={(e) => setFormData({ ...formData, lender_entity_id: e.target.value })} className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300" required>
                  <option value="">Select lender entity...</option>
                  {lenderEntities.map((e: any) => <option key={e.id} value={e.id}>{e.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Broker</label>
                <select value={formData.broker_id || ''} onChange={(e) => setFormData({ ...formData, broker_id: e.target.value || null })} className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300">
                  <option value="">None</option>
                  {brokers.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Solicitor</label>
                <select value={formData.solicitor_id || ''} onChange={(e) => setFormData({ ...formData, solicitor_id: e.target.value || null })} className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300">
                  <option value="">None</option>
                  {solicitors.map((s: any) => <option key={s.id} value={s.id}>{s.firm_name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Gross Amount (£) *</label>
                <input type="number" step="0.01" value={formData.gross_amount || ''} onChange={(e) => setFormData({ ...formData, gross_amount: parseFloat(e.target.value) || null })} className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Monthly Interest Rate (%) *</label>
                <input type="number" step="0.01" value={formData.monthly_interest_rate || ''} onChange={(e) => setFormData({ ...formData, monthly_interest_rate: parseFloat(e.target.value) || null })} className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Term (months) *</label>
                <input type="number" value={formData.term_months || ''} onChange={(e) => setFormData({ ...formData, term_months: parseInt(e.target.value) || null })} className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Min Interest Period (months) *</label>
                <input type="number" value={formData.minimum_interest_period_months || ''} onChange={(e) => setFormData({ ...formData, minimum_interest_period_months: parseInt(e.target.value) || null })} className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Completion Date</label>
                <input type="date" value={formData.completion_date} onChange={(e) => setFormData({ ...formData, completion_date: e.target.value })} className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Interest Method</label>
                <select value={formData.interest_method} onChange={(e) => setFormData({ ...formData, interest_method: e.target.value })} className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300">
                  <option value="retained">Retained</option>
                  <option value="serviced">Serviced</option>
                  <option value="rolled_up">Rolled Up</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Redemption Calculation</label>
                <select value={formData.redemption_calculation_method} onChange={(e) => setFormData({ ...formData, redemption_calculation_method: e.target.value })} className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300">
                  <option value="full_months">Full Months (round up)</option>
                  <option value="daily_accrual">Daily Accrual (precise)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" checked={formData.requires_notice_period} onChange={(e) => setFormData({ ...formData, requires_notice_period: e.target.checked })} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                  <span className="ml-2 text-sm text-gray-900">Requires 3 months notice for early redemption</span>
                </label>
              </div>

              {formData.requires_notice_period && (
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Notice Received Date</label>
                  <input type="date" value={formData.notice_received_date} onChange={(e) => setFormData({ ...formData, notice_received_date: e.target.value })} className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300" />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Borrower Section */}
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('borrower')}
          className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <span className="text-base font-semibold text-gray-900">Borrower Information</span>
          <span className="text-gray-500 text-sm">{expandedSections.borrower ? '▼' : '▶'}</span>
        </button>
        {expandedSections.borrower && (
          <div className="p-6 border-t border-gray-200">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-900 mb-2">Borrower Name *</label>
                <input type="text" value={formData.borrower_name} onChange={(e) => setFormData({ ...formData, borrower_name: e.target.value })} className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300" required />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-900 mb-2">Company</label>
                <input type="text" value={formData.borrower_company} onChange={(e) => setFormData({ ...formData, borrower_company: e.target.value })} className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Email</label>
                <input type="email" value={formData.borrower_email} onChange={(e) => setFormData({ ...formData, borrower_email: e.target.value })} className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Phone</label>
                <input type="tel" value={formData.borrower_phone} onChange={(e) => setFormData({ ...formData, borrower_phone: e.target.value })} className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Property Section */}
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('property')}
          className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <span className="text-base font-semibold text-gray-900">Property Details</span>
          <span className="text-gray-500 text-sm">{expandedSections.property ? '▼' : '▶'}</span>
        </button>
        {expandedSections.property && (
          <div className="p-6 border-t border-gray-200">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-900 mb-2">Property Address *</label>
                <input type="text" value={formData.property_address} onChange={(e) => setFormData({ ...formData, property_address: e.target.value })} className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Property Value (£)</label>
                <input type="number" step="0.01" value={formData.property_value || ''} onChange={(e) => setFormData({ ...formData, property_value: parseFloat(e.target.value) || null })} className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">LTV (%)</label>
                <input type="number" step="0.01" value={formData.ltv || ''} onChange={(e) => setFormData({ ...formData, ltv: parseFloat(e.target.value) || null })} className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-900 mb-2">Property Type</label>
                <select value={formData.property_type} onChange={(e) => setFormData({ ...formData, property_type: e.target.value })} className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300">
                  <option value="">Select...</option>
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="land">Land</option>
                  <option value="mixed_use">Mixed Use</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fees Section */}
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('fees')}
          className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <span className="text-base font-semibold text-gray-900">Fees ({fees.length})</span>
          <span className="text-gray-500 text-sm">{expandedSections.fees ? '▼' : '▶'}</span>
        </button>
        {expandedSections.fees && (
          <div className="p-6 border-t border-gray-200">
            {fees.length === 0 ? (
              <p className="text-sm text-gray-500 mb-4">No fees added yet</p>
            ) : (
              <div className="overflow-x-auto mb-4">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fee Name</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount (£)</th>
                      <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase">Timing</th>
                      <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase">Deducted</th>
                      <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase">Funded</th>
                      <th className="px-3 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {fees.map((fee: any, index: number) => (
                      <tr key={index}>
                        <td className="px-3 py-2">
                          <input type="text" value={fee.fee_name} onChange={(e) => updateFee(index, 'fee_name', e.target.value)} className="block w-full border-0 p-0 text-sm focus:ring-0" placeholder="Fee name" />
                        </td>
                        <td className="px-3 py-2">
                          <select value={fee.fee_type} onChange={(e) => updateFee(index, 'fee_type', e.target.value)} className="block w-full border-0 p-0 text-sm focus:ring-0">
                            <option value="arrangement">Arrangement</option>
                            <option value="valuation">Valuation</option>
                            <option value="legal">Legal</option>
                            <option value="broker_commission">Broker</option>
                            <option value="exit_interest">Exit Interest</option>
                            <option value="discharge">Discharge</option>
                            <option value="admin">Admin</option>
                            <option value="other">Other</option>
                          </select>
                        </td>
                        <td className="px-3 py-2">
                          <input type="number" step="0.01" value={fee.calculated_amount || ''} onChange={(e) => updateFee(index, 'calculated_amount', parseFloat(e.target.value) || null)} className="block w-full border-0 p-0 text-sm text-right focus:ring-0" placeholder="0.00" />
                        </td>
                        <td className="px-3 py-2">
                          <select value={fee.timing} onChange={(e) => updateFee(index, 'timing', e.target.value)} className="block w-full border-0 p-0 text-sm focus:ring-0">
                            <option value="completion">Completion</option>
                            <option value="redemption">Redemption</option>
                            <option value="monthly">Monthly</option>
                          </select>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <input type="checkbox" checked={fee.deducted_from_gross} onChange={(e) => updateFee(index, 'deducted_from_gross', e.target.checked)} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                        </td>
                        <td className="px-3 py-2 text-center">
                          <input type="checkbox" checked={fee.funded_by_lender} onChange={(e) => updateFee(index, 'funded_by_lender', e.target.checked)} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                        </td>
                        <td className="px-3 py-2 text-center">
                          <button type="button" onClick={() => removeFee(index)} className="text-red-600 hover:text-red-900 text-sm font-medium">×</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <button type="button" onClick={addFee} className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
              + Add Fee
            </button>
          </div>
        )}
      </div>
    </form>
  )
}