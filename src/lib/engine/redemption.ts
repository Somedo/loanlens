export interface RedemptionCalculation {
  actual_days_held: number
  months_billed: number
  interest_refund: number
  exit_fees_charged: number
  total_redemption_amount: number
  notice_period_met: boolean
  early_redemption: boolean
}

export function calculateRedemption(
  loan: any,
  fees: any[],
  redemptionDate: Date
): RedemptionCalculation {
  const completionDate = new Date(loan.completion_date)
  const redemption = new Date(redemptionDate)
  
  // 1. Calculate actual days held
  const msPerDay = 24 * 60 * 60 * 1000
  const actual_days_held = Math.round((redemption.getTime() - completionDate.getTime()) / msPerDay)
  
  // 2. Calculate months based on calculation method
  let actual_months_held: number
  if (loan.redemption_calculation_method === 'daily_accrual') {
    // Precise daily calculation
    actual_months_held = actual_days_held / 30.4167
  } else {
    // Full months only - round up any partial month
    actual_months_held = Math.ceil(actual_days_held / 30.4167)
  }
  
  // 3. Apply minimum term
  const months_billed = Math.max(actual_months_held, loan.minimum_interest_period_months)
  
  // 4. Check if early redemption (before term end)
  const early_redemption = months_billed < loan.term_months
  
  // 5. Calculate interest refund for unused months
  let interest_refund = 0
  if (early_redemption && loan.retained_interest_amount) {
    const unused_months = loan.term_months - months_billed
    interest_refund = loan.retained_interest_amount * (unused_months / loan.term_months)
  }
  
  // 6. Check notice period requirement
  let notice_period_met = true
  if (loan.requires_notice_period && early_redemption && loan.notice_received_date) {
    const noticeDate = new Date(loan.notice_received_date)
    const noticeDays = Math.round((redemption.getTime() - noticeDate.getTime()) / msPerDay)
    notice_period_met = noticeDays >= 90  // 3 months = 90 days
  }
  
  // 7. Calculate exit fees (only fees with timing='redemption')
  const redemptionFees = fees.filter(f => f.timing === 'redemption')
  const exit_fees_charged = redemptionFees.reduce((sum, f) => sum + (f.calculated_amount || 0), 0)
  
  // 8. Total redemption = Gross - Interest Refund + Exit Fees
  const total_redemption_amount = loan.gross_amount - interest_refund + exit_fees_charged
  
  return {
    actual_days_held: Math.round(actual_days_held),
    months_billed: Math.round(months_billed * 100) / 100,
    interest_refund: Math.round(interest_refund * 100) / 100,
    exit_fees_charged: Math.round(exit_fees_charged * 100) / 100,
    total_redemption_amount: Math.round(total_redemption_amount * 100) / 100,
    notice_period_met,
    early_redemption,
  }
}