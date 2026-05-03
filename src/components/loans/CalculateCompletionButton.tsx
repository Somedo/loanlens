'use client'

import { useState } from 'react'

export default function CalculateCompletionButton({ loanId }: { loanId: string }) {
  const [calculating, setCalculating] = useState(false)
  const [message, setMessage] = useState('')

  const handleCalculate = async () => {
    setCalculating(true)
    setMessage('')
    
    try {
      const response = await fetch(`/api/loans/${loanId}/calculate-completion`, { 
        method: 'POST' 
      })
      
      if (response.ok) {
        setMessage('✓ Calculated')
        setTimeout(() => window.location.reload(), 500)
      } else {
        const error = await response.json()
        setMessage(`✗ Failed: ${error.error || 'Unknown error'}`)
      }
    } catch (error) {
      setMessage('✗ Network error')
    }
    
    setCalculating(false)
  }

  return (
    <div className="flex items-center gap-2">
      <button 
        onClick={handleCalculate} 
        disabled={calculating} 
        className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 disabled:opacity-50"
      >
        {calculating ? 'Calculating...' : 'Calculate'}
      </button>
      {message && (
        <span className={`text-sm ${message.startsWith('✓') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </span>
      )}
    </div>
  )
}