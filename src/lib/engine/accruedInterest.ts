// Pure engine: accrued interest for a loan, as of a given date.
// No DB, no side effects — testable and reusable.

export interface AccrualLoan {
  completion_date: string | null
  monthly_interest_rate: number | null
  term_months: number | null
  interest_method: string | null              // 'retained' | 'serviced' | 'rolled'
  minimum_interest_period_months: number | null
  retained_interest_amount: number | null
  total_lender_investment: number | null
  gross_amount: number | null
  post_minimum_accrual_method: string | null   // 'daily' | 'whole_month'
}

export function calcAccruedInterest(loan: AccrualLoan, asOf: Date = new Date()): number {
  if (!loan.completion_date) return 0

  const start = new Date(loan.completion_date)
  if (isNaN(start.getTime()) || asOf < start) return 0

  const monthlyRate = Number(loan.monthly_interest_rate || 0) / 100
  const term = Number(loan.term_months || 0)
  const floorMonths = Number(loan.minimum_interest_period_months || 0)
  const method = (loan.interest_method || 'serviced').toLowerCase()

  // Principal interest is charged on
  const principal = Number(loan.gross_amount || 0)

  // Elapsed days and approximate elapsed months
  const msPerDay = 1000 * 60 * 60 * 24
  const elapsedDays = Math.floor((asOf.getTime() - start.getTime()) / msPerDay)
  const elapsedMonths = elapsedDays / (365 / 12)

  // --- RETAINED: show earned portion of the retained pot ---
  if (method === 'retained') {
    const pot = Number(loan.retained_interest_amount || 0)
    if (term <= 0 || pot <= 0) return 0
    // Earned = pot * (elapsed / term), but never below the floor share, never above full pot
    const earnedFraction = Math.min(elapsedMonths / term, 1)
    const floorFraction = floorMonths > 0 ? Math.min(floorMonths / term, 1) : 0
    const fraction = Math.max(earnedFraction, elapsedMonths < floorMonths ? floorFraction : earnedFraction)
    return round2(pot * fraction)
  }

  // --- SERVICED / ROLLED: bill by floor, then by accrual method ---
  let billedMonths: number

  if (elapsedMonths <= floorMonths) {
    // Inside minimum period → charge the full floor
    billedMonths = floorMonths
  } else if ((loan.post_minimum_accrual_method || 'daily') === 'whole_month') {
    // Round up to next whole month
    billedMonths = Math.ceil(elapsedMonths)
  } else {
    // Daily, 365-day convention
    const dailyRate = (monthlyRate * 12) / 365
    return round2(principal * dailyRate * elapsedDays)
  }

  // Whole-month / floor path
  return round2(principal * monthlyRate * billedMonths)
}

function round2(n: number): number {
  return Math.round(n * 100) / 100
}