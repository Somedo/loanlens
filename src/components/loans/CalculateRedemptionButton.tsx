'use client'

import { useState } from 'react'

export default function CalculateRedemptionButton({ loan }: { loan: any }) {
  const [showModal, setShowModal] = useState(false)
  const [redemptionDate, setRedemptionDate] = useState('')
  const [calculating, setCalculating] = useState(false)
  const [message, setMessage] = useState('')

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
        body: JSON.stringify({ redemption_date: redemptionDate })
      })
      
      if (response.ok) {
        setMessage('✓ Redemption calculated')
        setTimeout(() => {
          setShowModal(false)
          window.location.reload()
        }, 1000)
      } else {
        const error = await response.json()
        setMessage(`✗ Failed: ${error.error || 'Unknown error'}`)
      }
    } catch (error) {
      setMessage('✗ Network error')
    }
    
    setCalculating(false)
  }

  if (!loan.completion_date) {
    return null  // Can't calculate redemption without completion date
  }

  return (
    <>
      <button 
        onClick={() => setShowModal(true)} 
        className="rounded-md bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500"
      >
        Calculate Redemption
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Calculate Redemption</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Redemption Date
              </label>
              <input 
                type="date" 
                value={redemptionDate}
                onChange={(e) => setRedemptionDate(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
              />
              <p className="mt-2 text-xs text-gray-500">
                Completion: {new Date(loan.completion_date).toLocaleDateString('en-GB')}
              </p>
            </div>

            {message && (
              <div className={`mb-4 text-sm ${message.startsWith('✓') ? 'text-green-600' : 'text-red-600'}`}>
                {message}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleCalculate}
                disabled={calculating}
                className="flex-1 rounded-md bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 disabled:opacity-50"
              >
                {calculating ? 'Calculating...' : 'Calculate'}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}