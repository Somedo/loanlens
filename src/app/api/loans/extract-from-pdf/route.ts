import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Convert PDF to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')

    // Call Claude API to extract loan data from PDF
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
  model: 'claude-sonnet-4-6',
  max_tokens: 4000,
  messages: [
          {
            role: 'user',
            content: [
              {
                type: 'document',
                source: {
                  type: 'base64',
                  media_type: 'application/pdf',
                  data: base64,
                },
              },
              {
                type: 'text',
                text: `Extract loan information from this facility agreement and return ONLY a JSON object with these exact fields (use null for missing values):

{
  "loan_reference": "loan reference number",
  "borrower_name": "full borrower name",
  "borrower_company": "company name if mentioned",
  "borrower_email": "email address",
  "borrower_phone": "phone number",
  "property_address": "full property address",
  "property_value": numeric value only,
  "ltv": numeric percentage only,
  "gross_amount": numeric loan amount only,
  "monthly_interest_rate": numeric rate only (e.g., 1.35 not "1.35%"),
  "term_months": numeric months only,
  "minimum_interest_period_months": numeric months only,
  "completion_date": "YYYY-MM-DD format",
  "fees": [
  {
    "fee_name": "name of fee",
    "fee_type": "arrangement|legal|valuation|broker_commission|exit_interest|discharge|admin|other",
    "amount_type": "fixed",
    "amount_value": numeric amount,
    "calculated_amount": numeric amount,
    "timing": "completion|redemption|monthly",
    "deducted_from_gross": false,
    "funded_by_lender": false
  }
]

Return ONLY the JSON object, no explanations, no markdown formatting, no code blocks.`,
              },
            ],
          },
        ],
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Claude API error:', error)
      return NextResponse.json({ error: 'Failed to process document' }, { status: 500 })
    }

    const result = await response.json()
    const extractedText = result.content[0].text
    
    // Parse the JSON response
    let extractedData
    try {
      // Remove any markdown code blocks if present
      const cleanText = extractedText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      extractedData = JSON.parse(cleanText)
    } catch (parseError) {
      console.error('JSON parse error:', parseError)
      console.error('Extracted text:', extractedText)
      return NextResponse.json({ error: 'Failed to parse extracted data' }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: extractedData })
  } catch (error) {
    console.error('Extraction error:', error)
    return NextResponse.json({ error: 'Failed to extract loan data' }, { status: 500 })
  }
}