'use client'
import { useState } from 'react'

export default function CalculateRedemptionButton({ loan }: { loan: any }) {
  const [showModal, setShowModal] = useState(false)
  const [redemptionDate, setRedemptionDate] = useState('')
  const [calculating, setCalculating] = useState(false)
  const [message, setMessage] = useState('')

  // Calculated result held for review/override before saving
  const [result, setResult] = useState<any>(null)
  const [saving, setSaving] = useState(false)

  const gbp = (n: number) =>
    new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 2 }).format(Number(n) || 0)

  const handleCalculate = async () => {
    if (!redemptionDate) {
      setMessage('Please select a redemption date')
      return
    }
    setCalculating(true)
    setMessage('')
    try {
      const response = await fetch(`/api/loans/${loan.id}/calculate-redemption`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ redemption_date: redemptionDate, preview: true })
      })
      if (response.ok) {
        const data = await response.json()
        setResult(data.data)
      } else {
        const error = await response.json()
        setMessage(`Failed: ${error.error || 'Unknown error'}`)
      }
    } catch (error) {
      setMessage('Network error')
    }
    setCalculating(false)
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    try {
      const response = await fetch(`/api/loans/${loan.id}/calculate-redemption`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          redemption_date: redemptionDate,
          override: result,   // send possibly-edited figures
        })
      })
      if (response.ok) {
        setMessage('Redemption saved')
        setTimeout(() => { setShowModal(false); window.location.reload() }, 900)
      } else {
        const error = await response.json()
        setMessage(`Failed: ${error.error || 'Unknown error'}`)
      }
    } catch (error) {
      setMessage('Network error')
    }
    setSaving(false)
  }

  const reset = () => {
    setShowModal(false)
    setResult(null)
    setMessage('')
    setRedemptionDate('')
  }

  if (!loan.completion_date) return null

  const fieldClass = "block w-full rounded-md border border-input bg-background py-1.5 px-3 text-sm text-foreground text-right font-mono tabular-nums"

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="rounded-md px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm"
        style={{ background: 'var(--primary)' }}
      >
        Calculate Redemption
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="lens-card p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-foreground mb-4">Calculate Redemption</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground mb-2">Redemption Date</label>
              <input
                type="date"
                value={redemptionDate}
                onChange={(e) => { setRedemptionDate(e.target.value); setResult(null) }}
                className="block w-full rounded-md border border-input bg-background py-1.5 px-3 text-sm text-foreground"
              />
              <p className="mt-2 text-xs text-muted-foreground">
                Completion: {new Date(loan.completion_date).toLocaleDateString('en-GB')}
              </p>
            </div>

            {/* After calculating: show editable figures */}
            {result && (
              <div className="mb-4 space-y-3 border-t border-border pt-4">
                <p className="text-xs text-muted-foreground">Review and adjust if needed before saving.</p>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Days Held</label>
                  <input type="number" value={result.actual_days_held ?? ''} onChange={(e) => setResult({ ...result, actual_days_held: parseInt(e.target.value) || 0 })} className={fieldClass} />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Months Billed</label>
                  <input type="number" step="0.01" value={result.months_billed ?? ''} onChange={(e) => setResult({ ...result, months_billed: parseFloat(e.target.value) || 0 })} className={fieldClass} />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Interest Refund (£)</label>
                  <input type="number" step="0.01" value={result.interest_refund ?? ''} onChange={(e) => setResult({ ...result, interest_refund: parseFloat(e.target.value) || 0 })} className={fieldClass} />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Exit Fees (£)</label>
                  <input type="number" step="0.01" value={result.exit_fees_charged ?? ''} onChange={(e) => setResult({ ...result, exit_fees_charged: parseFloat(e.target.value) || 0 })} className={fieldClass} />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Total Redemption Amount (£)</label>
                  <input type="number" step="0.01" value={result.total_redemption_amount ?? ''} onChange={(e) => setResult({ ...result, total_redemption_amount: parseFloat(e.target.value) || 0 })} className={`${fieldClass} font-semibold`} style={{ color: 'var(--primary)' }} />
                </div>
              </div>
            )}

            {message && <div className="mb-4 text-sm text-muted-foreground">{message}</div>}

            <div className="flex gap-3">
              {!result ? (
                <button onClick={handleCalculate} disabled={calculating} className="flex-1 rounded-md px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm disabled:opacity-50" style={{ background: 'var(--primary)' }}>
                  {calculating ? 'Calculating...' : 'Calculate'}
                </button>
              ) : (
                <button onClick={handleSave} disabled={saving} className="flex-1 rounded-md px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm disabled:opacity-50" style={{ background: 'var(--primary)' }}>
                  {saving ? 'Saving...' : 'Save Redemption'}
                </button>
              )}
              <button onClick={reset} className="flex-1 rounded-md bg-card px-4 py-2 text-sm font-semibold text-foreground border border-input hover:bg-accent">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}