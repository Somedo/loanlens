import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="landing">
      <style>{css}</style>
      <div className="wrap">
        <nav>
          <div className="brand"><span className="dot" />LoanLens</div>
          <div className="navlinks">
            <Link href="/pricing">Pricing</Link>
            <Link href="/login">Sign in</Link>
            <Link href="/register" className="btn btn-accent">Start free trial</Link>
          </div>
        </nav>

        <section className="hero">
          <div className="pill"><b>New</b> · The shared workspace for bridging deals</div>
          <h1>Run every bridging deal in one place — not ten spreadsheets.</h1>
          <p className="lead">A single, accurate home for the full loan lifecycle — from DIP to redemption. Built for UK bridging brokers and lenders.</p>
          <div className="cta-row">
            <Link href="/register" className="btn btn-accent btn-lg">Start free trial</Link>
            <Link href="/pricing" className="btn btn-line btn-lg">See pricing</Link>
          </div>
          <p className="trial-note">14-day free trial · no card required</p>

          <div className="preview">
            <div className="frame">
              <div className="frame-top">
                <span className="d" /><span className="d" /><span className="d" />
                <span className="addr">app.loanlens.co.uk/lender</span>
              </div>
              <div className="frame-body">
                <div className="mini-side">
                  <div className="mini-brand"><span className="dot" />LoanLens</div>
                  <div className="mini-link on" />
                  <div className="mini-link w1" />
                  <div className="mini-link w2" />
                  <div className="mini-link w3" />
                  <div className="mini-link w4" />
                  <div className="mini-link w2" />
                </div>
                <div className="mini-main">
                  <div className="mini-cards">
                    <div className="mc"><span className="rail" /><div className="l">Funds Deployed</div><div className="v">£1,240,000</div></div>
                    <div className="mc"><span className="rail" /><div className="l">Accrued Interest</div><div className="v">£58,500.00</div></div>
                    <div className="mc"><span className="rail" /><div className="l">Redeeming 30d</div><div className="v">£320,000</div></div>
                  </div>
                  <div className="mini-table">
                    <div className="mt-row"><span>Reference</span><span>Borrower</span><span>Status</span></div>
                    <div className="mt-row"><span className="ref">2041</span><span className="amt">Example Holdings Ltd</span><span className="tag">Active</span></div>
                    <div className="mt-row"><span className="ref">2042</span><span className="amt">Sample Developments</span><span className="tag">Active</span></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="chip">
              <div className="ico"><svg viewBox="0 0 24 24"><path d="M12 3v18"/><path d="M7 8h7a2.5 2.5 0 010 5H9a2.5 2.5 0 000 5h8"/></svg></div>
              <div><div className="ct">Live accrual</div><div className="cv">to the penny</div></div>
            </div>
          </div>
        </section>

        <div className="strip">Built for UK bridging finance · DIP → Redemption · Multi-tenant</div>

        <section className="split">
          <div className="sec-title">One platform. Both sides of the deal.</div>
          <div className="sec-sub">Whether you place deals or fund them, LoanLens gives you a focused workspace.</div>
          <div className="two">
            <div className="col">
              <span className="badge">For Brokers</span>
              <h3>Place deals without the chaos.</h3>
              <p className="p">Track every case from enquiry to completion, and watch your introduced loans right through to redemption.</p>
              <ul>
                <li><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>Pipeline from lead to completion</li>
                <li><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>See your introduced deals live</li>
                <li><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>Fee tracking built in</li>
              </ul>
            </div>
            <div className="col">
              <span className="badge">For Lenders</span>
              <h3>Manage your book with precision.</h3>
              <p className="p">Deploy funds, track accrued interest to the penny, and generate redemption statements in seconds.</p>
              <ul>
                <li><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>Live portfolio dashboard</li>
                <li><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>Accurate interest & redemption engine</li>
                <li><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>Full lifecycle: DIP to redemption</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="features">
          <div className="sec-title">Everything the spreadsheet can&apos;t do</div>
          <div className="sec-sub">Accurate engines, live figures, and a clean record of every deal.</div>
          <div className="fgrid">
            <div className="fcard">
              <div className="ficon"><svg viewBox="0 0 24 24"><path d="M12 3v18"/><path d="M7 8h7a2.5 2.5 0 010 5H9a2.5 2.5 0 000 5h8"/></svg></div>
              <h3>Accurate interest engine</h3>
              <p>Minimum terms, retained interest, daily accrual — calculated exactly, every time, to the penny.</p>
            </div>
            <div className="fcard">
              <div className="ficon"><svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h10"/></svg></div>
              <h3>Redemption statements</h3>
              <p>Generate clean, accurate redemption figures and statements in seconds, not hours.</p>
            </div>
            <div className="fcard">
              <div className="ficon"><svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3"/><circle cx="17" cy="10" r="2.5"/><path d="M3 20a6 6 0 0112 0M14 20a5 5 0 017-4.6"/></svg></div>
              <h3>Brokers &amp; lenders together</h3>
              <p>One shared deal record both sides can see — no more chasing updates over email.</p>
            </div>
          </div>
        </section>

        <section className="collab">
          <div className="pill"><b>The part no one else does</b></div>
          <h2>The first platform where brokers and lenders work the same deal, live.</h2>
          <p>When a broker introduces a deal, the lender sees it instantly — and both track it through to redemption on one synchronised record.</p>
          <Link href="/register" className="btn btn-accent btn-lg">Start your free trial</Link>
        </section>

        <footer>
          <div className="brand"><span className="dot" />LoanLens</div>
          <div>© 2026 LoanLens · Built for UK bridging finance</div>
        </footer>
      </div>
    </div>
  )
}

const css = `
.landing{--bg:#FBFBFA;--bg-soft:#F4F5F3;--panel:#FFFFFF;--ink:#16181C;--ink-soft:#5A6069;--ink-faint:#9097A0;--line:#ECEDEA;--line-strong:#E0E1DE;--accent:#6E1E2A;--accent-deep:#581620;--accent-tint:#F6ECEC;--halo:radial-gradient(55% 70% at 50% 0%, #F4E7E7 0%, transparent 72%);--shadow:0 1px 2px rgba(22,24,28,.04),0 8px 24px rgba(22,24,28,.06);--shadow-lg:0 2px 6px rgba(22,24,28,.05),0 30px 70px rgba(22,24,28,.13);background:var(--bg);color:var(--ink);font-family:'Geist',system-ui,sans-serif;-webkit-font-smoothing:antialiased;line-height:1.5;min-height:100vh}
.landing .wrap{max-width:1100px;margin:0 auto;padding:0 28px}
.landing a{color:inherit;text-decoration:none}
.landing nav{display:flex;align-items:center;justify-content:space-between;padding:22px 0;position:relative;z-index:5}
.landing .brand{font-weight:700;font-size:19px;letter-spacing:-.03em;display:flex;align-items:center;gap:9px}
.landing .dot{width:20px;height:20px;border-radius:6px;background:var(--accent);position:relative}
.landing .dot::after{content:"";position:absolute;inset:6px;border:1.5px solid #fff;border-radius:2px}
.landing .navlinks{display:flex;align-items:center;gap:26px;font-size:14px;color:var(--ink-soft)}
.landing .navlinks a:hover{color:var(--ink)}
.landing .btn{display:inline-flex;align-items:center;gap:8px;border-radius:10px;padding:10px 18px;font-size:14px;font-weight:600;transition:all .2s;cursor:pointer;border:none}
.landing .btn-accent{background:var(--accent);color:#fff;box-shadow:0 2px 10px rgba(110,30,42,.25)}
.landing .btn-accent:hover{background:var(--accent-deep)}
.landing .btn-line{border:1px solid var(--line-strong);color:var(--ink)}
.landing .btn-line:hover{border-color:var(--accent)}
.landing .btn-lg{padding:14px 28px;font-size:15px;border-radius:12px}
.landing .hero{position:relative;text-align:center;padding:64px 0 40px}
.landing .hero::before{content:"";position:absolute;inset:0 0 auto 0;height:600px;background:var(--halo);z-index:0}
.landing .hero>*{position:relative;z-index:1}
.landing .pill{display:inline-flex;align-items:center;gap:8px;background:var(--panel);border:1px solid var(--line-strong);border-radius:30px;padding:6px 14px;font-size:13px;color:var(--ink-soft);margin-bottom:24px;box-shadow:var(--shadow)}
.landing .pill b{color:var(--accent);font-weight:600}
.landing h1{font-size:60px;font-weight:800;letter-spacing:-.046em;line-height:.99;max-width:840px;margin:0 auto 22px}
.landing .lead{font-size:20px;color:var(--ink-soft);max-width:600px;margin:0 auto 30px}
.landing .cta-row{display:flex;gap:12px;justify-content:center;align-items:center}
.landing .trial-note{font-family:'Geist Mono',monospace;font-size:12px;color:var(--ink-faint);margin-top:16px}
.landing .preview{position:relative;margin:52px auto 0;max-width:960px}
.landing .frame{background:#fff;border:1px solid var(--line);border-radius:18px;box-shadow:var(--shadow-lg);overflow:hidden}
.landing .frame-top{display:flex;align-items:center;gap:8px;padding:13px 16px;border-bottom:1px solid var(--line);background:var(--bg-soft)}
.landing .frame-top .d{width:11px;height:11px;border-radius:50%;background:var(--line-strong)}
.landing .frame-top .addr{margin-left:12px;font-family:'Geist Mono',monospace;font-size:11px;color:var(--ink-faint);background:#fff;border:1px solid var(--line);border-radius:6px;padding:4px 10px}
.landing .frame-body{padding:22px;display:grid;grid-template-columns:170px 1fr;gap:18px;background:var(--bg)}
.landing .mini-side{display:flex;flex-direction:column;gap:8px}
.landing .mini-brand{font-weight:700;font-size:13px;display:flex;align-items:center;gap:7px;margin-bottom:8px}
.landing .mini-brand .dot{width:14px;height:14px;border-radius:4px}
.landing .mini-brand .dot::after{inset:4px;border-width:1px}
.landing .mini-link{height:9px;border-radius:5px;background:var(--bg-soft)}
.landing .mini-link.on{background:var(--accent-tint);width:90%}
.landing .mini-link.w1{width:70%}.landing .mini-link.w2{width:85%}.landing .mini-link.w3{width:60%}.landing .mini-link.w4{width:78%}
.landing .mini-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:14px}
.landing .mc{background:#fff;border:1px solid var(--line);border-radius:11px;padding:14px;box-shadow:var(--shadow);position:relative;overflow:hidden}
.landing .mc .rail{position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--accent)}
.landing .mc .l{font-size:9px;color:var(--ink-faint);text-transform:uppercase;letter-spacing:.06em;margin-bottom:7px}
.landing .mc .v{font-family:'Geist Mono',monospace;font-weight:600;font-size:17px}
.landing .mini-table{background:#fff;border:1px solid var(--line);border-radius:11px;overflow:hidden}
.landing .mt-row{display:flex;justify-content:space-between;align-items:center;padding:11px 14px;border-top:1px solid var(--line);font-size:12px}
.landing .mt-row:first-child{border-top:none;background:var(--bg-soft);font-family:'Geist Mono',monospace;font-size:9px;text-transform:uppercase;letter-spacing:.06em;color:var(--ink-faint)}
.landing .mt-row .ref{font-family:'Geist Mono',monospace;color:var(--accent);font-weight:500}
.landing .mt-row .amt{font-family:'Geist Mono',monospace;color:var(--ink-soft)}
.landing .tag{font-size:10px;font-weight:500;color:var(--accent);background:var(--accent-tint);border-radius:5px;padding:2px 8px}
.landing .chip{position:absolute;right:-14px;top:90px;background:#fff;border:1px solid var(--line);border-radius:12px;box-shadow:var(--shadow-lg);padding:12px 14px;display:flex;align-items:center;gap:10px}
.landing .chip .ico{width:30px;height:30px;border-radius:8px;background:var(--accent-tint);display:flex;align-items:center;justify-content:center}
.landing .chip .ico svg{width:15px;height:15px;stroke:var(--accent);fill:none;stroke-width:1.9}
.landing .chip .ct{font-size:11px;color:var(--ink-faint)}
.landing .chip .cv{font-family:'Geist Mono',monospace;font-weight:600;font-size:14px}
.landing .strip{text-align:center;padding:46px 0 10px;color:var(--ink-faint);font-size:12px;font-family:'Geist Mono',monospace;letter-spacing:.06em;text-transform:uppercase}
.landing .split{padding:80px 0 20px}
.landing .sec-title{text-align:center;font-size:36px;font-weight:800;letter-spacing:-.035em;margin-bottom:12px}
.landing .sec-sub{text-align:center;color:var(--ink-soft);max-width:520px;margin:0 auto 48px}
.landing .two{display:grid;grid-template-columns:1fr 1fr;gap:22px}
.landing .col{background:#fff;border:1px solid var(--line);border-radius:18px;padding:32px;position:relative;overflow:hidden}
.landing .col .badge{display:inline-block;font-size:12px;font-weight:600;color:var(--accent);background:var(--accent-tint);border-radius:20px;padding:5px 13px;margin-bottom:18px}
.landing .col h3{font-size:23px;font-weight:800;letter-spacing:-.03em;margin-bottom:8px}
.landing .col .p{color:var(--ink-soft);font-size:14px;margin-bottom:20px}
.landing .col ul{list-style:none;display:flex;flex-direction:column;gap:11px;padding:0;margin:0}
.landing .col li{display:flex;gap:10px;align-items:flex-start;font-size:14px}
.landing .col li svg{width:18px;height:18px;stroke:var(--accent);fill:none;stroke-width:2;flex-shrink:0;margin-top:1px}
.landing .features{padding:80px 0 20px}
.landing .fgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.landing .fcard{background:#fff;border:1px solid var(--line);border-radius:16px;padding:28px;transition:box-shadow .2s,transform .2s}
.landing .fcard:hover{box-shadow:var(--shadow);transform:translateY(-3px)}
.landing .ficon{width:44px;height:44px;border-radius:12px;background:var(--accent-tint);display:flex;align-items:center;justify-content:center;margin-bottom:18px}
.landing .ficon svg{width:21px;height:21px;stroke:var(--accent);fill:none;stroke-width:1.8}
.landing .fcard h3{font-size:18px;font-weight:700;letter-spacing:-.02em;margin-bottom:9px}
.landing .fcard p{font-size:14px;color:var(--ink-soft)}
.landing .collab{margin:80px 0;background:linear-gradient(135deg,#1a1c20,#2a2d33);border-radius:24px;padding:60px;text-align:center;color:#fff}
.landing .collab .pill{background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.15);color:rgba(255,255,255,.8)}
.landing .collab .pill b{color:#fff}
.landing .collab h2{font-size:38px;font-weight:800;letter-spacing:-.035em;max-width:640px;margin:0 auto 16px}
.landing .collab p{color:rgba(255,255,255,.75);max-width:540px;margin:0 auto 28px}
.landing .collab .btn-accent{background:#fff;color:var(--accent)}
.landing footer{padding:54px 0;border-top:1px solid var(--line);color:var(--ink-faint);font-size:13px;display:flex;justify-content:space-between;align-items:center}
@media(max-width:760px){.landing h1{font-size:40px}.landing .two,.landing .fgrid,.landing .mini-cards{grid-template-columns:1fr}.landing .frame-body{grid-template-columns:1fr}.landing .mini-side{display:none}.landing .chip{display:none}}
`
