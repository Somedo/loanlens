'use client'

import { useState } from 'react'
import Link from 'next/link'

type Audience = 'lender' | 'broker'
type Billing = 'monthly' | 'annual'

interface Tier {
  name: string
  limit: string
  monthly: number | null // null = custom
  featured?: boolean
  features: string[]
}

const TIERS: Record<Audience, Tier[]> = {
  lender: [
    { name: 'Starter', limit: 'Up to 10 active loans', monthly: 99, features: ['Live portfolio dashboard', 'Accurate interest engine', 'Redemption statements', 'Email support'] },
    { name: 'Growth', limit: 'Up to 50 active loans', monthly: 249, featured: true, features: ['Everything in Starter', 'Unlimited users', 'Broker collaboration', 'Priority support'] },
    { name: 'Scale', limit: 'Up to 200 active loans', monthly: 499, features: ['Everything in Growth', 'Advanced reporting', 'Bulk operations', 'Dedicated onboarding'] },
    { name: 'Enterprise', limit: 'Unlimited loans', monthly: null, features: ['Everything in Scale', 'Integrations (valuations, AML, e-sign)', 'Custom SLAs', 'Account manager'] },
  ],
  broker: [
    { name: 'Starter', limit: 'Up to 15 active deals', monthly: 49, features: ['Deal pipeline', 'Lead to completion tracking', 'Fee tracking', 'Email support'] },
    { name: 'Growth', limit: 'Up to 60 active deals', monthly: 119, featured: true, features: ['Everything in Starter', 'Unlimited users', 'Live introduced-deal view', 'Priority support'] },
    { name: 'Scale', limit: 'Up to 200 active deals', monthly: 249, features: ['Everything in Growth', 'Lender relationship tools', 'Advanced reporting', 'Dedicated onboarding'] },
    { name: 'Enterprise', limit: 'Unlimited deals', monthly: null, features: ['Everything in Scale', 'Team management', 'Custom SLAs', 'Account manager'] },
  ],
}

export default function PricingPage() {
  const [audience, setAudience] = useState<Audience>('lender')
  const [billing, setBilling] = useState<Billing>('annual')

  const tiers = TIERS[audience]
  const annualPrice = (m: number) => Math.round((m * 10) / 12) // ~2 months free

  return (
    <div className="pricing">
      <style>{css}</style>
      <div className="wrap">
        <nav>
          <Link href="/" className="brand"><span className="dot" />LoanLens</Link>
          <div className="navlinks">
            <Link href="/pricing">Pricing</Link>
            <Link href="/login">Sign in</Link>
            <Link href="/register" className="btn btn-accent">Start free trial</Link>
          </div>
        </nav>

        <section className="head">
          <div className="pill">14-day free trial · no card required</div>
          <h1>Simple pricing that scales with your book.</h1>
          <p className="lead">Pay for what you run. No per-seat fees — add your whole team on any plan.</p>

          <div className="toggles">
            <div className="seg">
              <button className={audience === 'lender' ? 'on' : ''} onClick={() => setAudience('lender')}>Lenders</button>
              <button className={audience === 'broker' ? 'on' : ''} onClick={() => setAudience('broker')}>Brokers</button>
            </div>
            <div className="seg seg-billing">
              <button className={billing === 'monthly' ? 'on' : ''} onClick={() => setBilling('monthly')}>Monthly</button>
              <button className={billing === 'annual' ? 'on' : ''} onClick={() => setBilling('annual')}>
                Annual <span className="save">Save ~17%</span>
              </button>
            </div>
          </div>
        </section>

        <section className="grid">
          {tiers.map((t) => (
            <div key={t.name} className={`tier ${t.featured ? 'featured' : ''}`}>
              {t.featured && <div className="ribbon">Most popular</div>}
              <h3>{t.name}</h3>
              <p className="limit">{t.limit}</p>
              <div className="price">
                {t.monthly === null ? (
                  <span className="custom">Custom</span>
                ) : (
                  <>
                    <span className="amt">£{billing === 'annual' ? annualPrice(t.monthly) : t.monthly}</span>
                    <span className="per">/mo</span>
                  </>
                )}
              </div>
              <p className="billed">
                {t.monthly === null ? 'Tailored to your needs' : billing === 'annual' ? 'billed annually' : 'billed monthly'}
              </p>
              <Link href={t.monthly === null ? '/contact' : '/register'} className={`btn btn-lg ${t.featured ? 'btn-accent' : 'btn-line'} full`}>
                {t.monthly === null ? 'Contact sales' : 'Start free trial'}
              </Link>
              <ul>
                {t.features.map((f) => (
                  <li key={f}><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" /></svg>{f}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section className="faq">
          <h2>Common questions</h2>
          <div className="faq-grid">
            <div className="qa"><h4>What counts as an active loan or deal?</h4><p>Anything live in your book — not yet redeemed (lenders) or not yet completed/declined (brokers). Closed items don’t count toward your limit.</p></div>
            <div className="qa"><h4>Do I pay per user?</h4><p>No. Every plan includes unlimited users — add your whole team. You’re billed on the size of your book, not headcount.</p></div>
            <div className="qa"><h4>What happens after the trial?</h4><p>Your 14-day trial is full-featured with no card required. Choose a plan when you’re ready; nothing is charged automatically.</p></div>
            <div className="qa"><h4>Can I change plans later?</h4><p>Yes — upgrade or downgrade anytime as your book grows or contracts. Changes apply from your next billing cycle.</p></div>
          </div>
        </section>

        <footer>
          <Link href="/" className="brand"><span className="dot" />LoanLens</Link>
          <div>© 2026 LoanLens · Built for UK bridging finance</div>
        </footer>
      </div>
    </div>
  )
}

const css = `
.pricing{--bg:#FBFBFA;--bg-soft:#F4F5F3;--panel:#FFFFFF;--ink:#16181C;--ink-soft:#5A6069;--ink-faint:#9097A0;--line:#ECEDEA;--line-strong:#E0E1DE;--accent:#6E1E2A;--accent-deep:#581620;--accent-tint:#F6ECEC;--shadow:0 1px 2px rgba(22,24,28,.04),0 8px 24px rgba(22,24,28,.06);--shadow-lg:0 2px 6px rgba(22,24,28,.05),0 24px 56px rgba(22,24,28,.12);background:var(--bg);color:var(--ink);font-family:'Geist',system-ui,sans-serif;-webkit-font-smoothing:antialiased;line-height:1.5;min-height:100vh}
.pricing .wrap{max-width:1100px;margin:0 auto;padding:0 28px}
.pricing a{color:inherit;text-decoration:none}
.pricing nav{display:flex;align-items:center;justify-content:space-between;padding:22px 0}
.pricing .brand{font-weight:700;font-size:19px;letter-spacing:-.03em;display:flex;align-items:center;gap:9px}
.pricing .dot{width:20px;height:20px;border-radius:6px;background:var(--accent);position:relative}
.pricing .dot::after{content:"";position:absolute;inset:6px;border:1.5px solid #fff;border-radius:2px}
.pricing .navlinks{display:flex;align-items:center;gap:26px;font-size:14px;color:var(--ink-soft)}
.pricing .navlinks a:hover{color:var(--ink)}
.pricing .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border-radius:10px;padding:10px 18px;font-size:14px;font-weight:600;transition:all .2s;cursor:pointer;border:none}
.pricing .btn-accent{background:var(--accent);color:#fff;box-shadow:0 2px 10px rgba(110,30,42,.25)}
.pricing .btn-accent:hover{background:var(--accent-deep)}
.pricing .btn-line{border:1px solid var(--line-strong);color:var(--ink)}
.pricing .btn-line:hover{border-color:var(--accent)}
.pricing .btn-lg{padding:13px 20px;font-size:14px;border-radius:11px}
.pricing .full{width:100%}
.pricing .head{text-align:center;padding:50px 0 36px}
.pricing .pill{display:inline-flex;align-items:center;gap:8px;background:var(--panel);border:1px solid var(--line-strong);border-radius:30px;padding:6px 14px;font-size:13px;color:var(--ink-soft);margin-bottom:22px;box-shadow:var(--shadow);font-family:'Geist Mono',monospace}
.pricing h1{font-size:46px;font-weight:800;letter-spacing:-.04em;line-height:1.02;max-width:640px;margin:0 auto 16px}
.pricing .lead{font-size:18px;color:var(--ink-soft);max-width:520px;margin:0 auto 30px}
.pricing .toggles{display:flex;gap:14px;justify-content:center;align-items:center;flex-wrap:wrap}
.pricing .seg{display:inline-flex;background:var(--bg-soft);border:1px solid var(--line);border-radius:12px;padding:4px}
.pricing .seg button{border:none;background:none;padding:9px 22px;font-family:'Geist',sans-serif;font-size:14px;font-weight:600;color:var(--ink-soft);border-radius:9px;cursor:pointer;transition:all .2s;display:flex;align-items:center;gap:8px}
.pricing .seg button.on{background:#fff;color:var(--ink);box-shadow:var(--shadow)}
.pricing .save{font-size:10px;font-weight:600;color:var(--accent);background:var(--accent-tint);border-radius:5px;padding:2px 6px;font-family:'Geist Mono',monospace}
.pricing .grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;padding-bottom:30px;align-items:start}
.pricing .tier{background:#fff;border:1px solid var(--line);border-radius:18px;padding:26px 22px;position:relative;display:flex;flex-direction:column}
.pricing .tier.featured{border-color:var(--accent);box-shadow:var(--shadow-lg)}
.pricing .ribbon{position:absolute;top:-11px;left:50%;transform:translateX(-50%);background:var(--accent);color:#fff;font-size:11px;font-weight:600;padding:4px 12px;border-radius:20px;white-space:nowrap}
.pricing .tier h3{font-size:19px;font-weight:800;letter-spacing:-.03em;margin-bottom:4px}
.pricing .limit{font-size:13px;color:var(--ink-soft);margin-bottom:18px;min-height:34px}
.pricing .price{display:flex;align-items:baseline;gap:3px;margin-bottom:2px}
.pricing .amt{font-family:'Geist Mono',monospace;font-size:34px;font-weight:700;letter-spacing:-.03em}
.pricing .per{font-size:15px;color:var(--ink-faint)}
.pricing .custom{font-family:'Geist Mono',monospace;font-size:30px;font-weight:700;letter-spacing:-.03em}
.pricing .billed{font-size:12px;color:var(--ink-faint);margin-bottom:18px;font-family:'Geist Mono',monospace}
.pricing .tier ul{list-style:none;display:flex;flex-direction:column;gap:10px;margin:20px 0 0;padding:20px 0 0;border-top:1px solid var(--line)}
.pricing .tier li{display:flex;gap:9px;align-items:flex-start;font-size:13px;color:var(--ink-soft)}
.pricing .tier li svg{width:16px;height:16px;stroke:var(--accent);fill:none;stroke-width:2.2;flex-shrink:0;margin-top:1px}
.pricing .faq{padding:60px 0;border-top:1px solid var(--line);margin-top:20px}
.pricing .faq h2{font-size:28px;font-weight:800;letter-spacing:-.03em;text-align:center;margin-bottom:36px}
.pricing .faq-grid{display:grid;grid-template-columns:1fr 1fr;gap:28px;max-width:820px;margin:0 auto}
.pricing .qa h4{font-size:15px;font-weight:700;margin-bottom:6px}
.pricing .qa p{font-size:14px;color:var(--ink-soft)}
.pricing footer{padding:40px 0;border-top:1px solid var(--line);color:var(--ink-faint);font-size:13px;display:flex;justify-content:space-between;align-items:center}
@media(max-width:880px){.pricing .grid{grid-template-columns:1fr 1fr}}
@media(max-width:560px){.pricing h1{font-size:34px}.pricing .grid,.pricing .faq-grid{grid-template-columns:1fr}}
`
