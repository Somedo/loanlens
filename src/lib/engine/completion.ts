export interface CompletionCalculation {
  retained_interest_amount: number
  net_to_solicitor: number
  total_lender_investment: number
}

export function calculateCompletion(
  loan: any,
  fees: any[]
): CompletionCalculation {
  const gross = loan.gross_amount
  const monthlyRate = loan.monthly_interest_rate / 100  // Convert percentage to decimal
  const termMonths = loan.term_months

  // 1. Retained interest = gross × monthly_rate × term_months
  const retained_interest_amount = gross * monthlyRate * termMonths

  // 2. Get completion fees
  const completionFees = fees.filter(f => f.timing === 'completion')
  
  // 3. Fees deducted from gross (reduces what borrower receives)
  const fees_deducted = completionFees
    .filter(f => f.deducted_from_gross)
    .reduce((sum, f) => sum + (f.calculated_amount || 0), 0)

  // 4. Net to solicitor/borrower = gross - retained_interest - fees_deducted
  const net_to_solicitor = gross - retained_interest_amount - fees_deducted

  // 5. Fees funded by lender (lender pays these)
  const fees_funded = completionFees
    .filter(f => f.funded_by_lender)
    .reduce((sum, f) => sum + (f.calculated_amount || 0), 0)

  // 6. Total lender investment = ACTUAL CASH OUT (not including retained interest)
  //    = net to borrower + fees funded by lender
  const total_lender_investment = net_to_solicitor + fees_funded

  return {
    retained_interest_amount: Math.round(retained_interest_amount * 100) / 100,
    net_to_solicitor: Math.round(net_to_solicitor * 100) / 100,
    total_lender_investment: Math.round(total_lender_investment * 100) / 100,
  }
}