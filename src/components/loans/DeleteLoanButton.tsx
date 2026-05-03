'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DeleteLoanButton({ loanId, loanReference }: { loanId: string, loanReference: string }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete loan ${loanReference}? This cannot be undone.`)) {
      return
    }

    setDeleting(true)
    try {
      const response = await fetch('/api/loans/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: loanId }),
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert('Failed to delete loan')
        setDeleting(false)
      }
    } catch (error) {
      alert('Error deleting loan')
      setDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="text-red-600 hover:text-red-900 text-sm font-medium disabled:opacity-50"
    >
      {deleting ? 'Deleting...' : 'Delete'}
    </button>
  )
}