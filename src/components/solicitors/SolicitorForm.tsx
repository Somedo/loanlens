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

  const inputClass = "mt-2 block w-full rounded-md border border-input bg-background py-1.5 px-3 text-foreground"

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="lens-card p-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-foreground">Firm Name *</label>
            <input type="text" value={formData.firm_name} onChange={(e) => setFormData({ ...formData, firm_name: e.target.value })} className={inputClass} required />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground">SRA Number</label>
            <input type="text" value={formData.sra_number} onChange={(e) => setFormData({ ...formData, sra_number: e.target.value })} className={inputClass} />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground">Default Discharge Fee (£)</label>
            <input type="number" step="0.01" value={formData.default_discharge_fee || ''} onChange={(e) => setFormData({ ...formData, default_discharge_fee: parseFloat(e.target.value) || null })} className={inputClass} />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-foreground">Contact Name</label>
            <input type="text" value={formData.contact_name} onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })} className={inputClass} />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground">Email</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={inputClass} />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground">Phone</label>
            <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className={inputClass} />
          </div>

          <div className="sm:col-span-2 border-t border-border pt-6">
            <h3 className="text-base font-semibold text-foreground mb-4">Address</h3>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-foreground">Address Line 1</label>
            <input type="text" value={formData.address_line1} onChange={(e) => setFormData({ ...formData, address_line1: e.target.value })} className={inputClass} />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-foreground">Address Line 2</label>
            <input type="text" value={formData.address_line2} onChange={(e) => setFormData({ ...formData, address_line2: e.target.value })} className={inputClass} />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground">City</label>
            <input type="text" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className={inputClass} />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground">Postcode</label>
            <input type="text" value={formData.postcode} onChange={(e) => setFormData({ ...formData, postcode: e.target.value })} className={inputClass} />
          </div>

          <div className="sm:col-span-2">
            <label className="flex items-center cursor-pointer">
              <input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} className="h-4 w-4 rounded" />
              <span className="ml-2 text-sm text-foreground">Active solicitor</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-x-6">
        {message && <span className="text-sm text-muted-foreground">{message}</span>}
        <button type="button" onClick={() => router.push('/solicitors')} className="text-sm font-semibold text-foreground">Cancel</button>
        <button type="submit" disabled={saving} className="rounded-md px-6 py-2 text-sm font-semibold text-primary-foreground shadow-sm disabled:opacity-50" style={{ background: 'var(--primary)' }}>
          {saving ? 'Saving...' : solicitor?.id ? 'Update Solicitor' : 'Add Solicitor'}
        </button>
      </div>
    </form>
  )
}
