import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { calcAccruedInterest } from '@/lib/engine/accruedInterest'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const { data: loans, error } = await supabase
      .from('loans')
      .select('*')
      .eq('is_archived', false)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const safeLoans = loans || []

    // Totals
    const deployed = safeLoans
      .filter((l) => l.status === 'active')
      .reduce((sum, l) => sum + Number(l.total_lender_investment || 0), 0)

    const pipeline = safeLoans
      .filter((l) => ['lead', 'completion'].includes(l.status))
      .reduce((sum, l) => sum + Number(l.gross_amount || 0), 0)

    const accruredInterest = safeLoans
      .filter((l) => l.status === 'active')
      .reduce((sum, l) => sum + calcAccruedInterest(l), 0)

    const defaults = safeLoans
      .filter((l) => l.status === 'default')
      .reduce((sum, l) => sum + Number(l.gross_amount || 0), 0)

    // Expected returns next 30 days
    const now = new Date()
    const in30 = new Date()
    in30.setDate(now.getDate() + 30)
    const expectedReturns30d = safeLoans
      .filter((l) => {
        const d = l.redemption_date || l.maturity_date
        if (!d) return false
        const date = new Date(d)
        return date >= now && date <= in30
      })
      .reduce((sum, l) => sum + Number(l.total_redemption_amount || 0), 0)

    return NextResponse.json({
      loans: safeLoans,
      totals: { deployed, pipeline, expectedReturns30d, accruredInterest, defaults },
    })
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}