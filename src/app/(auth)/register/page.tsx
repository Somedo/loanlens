'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Role = 'broker' | 'lender'
type EntityType = 'company' | 'individual'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [role, setRole] = useState<Role | null>(null)
  const [entityType, setEntityType] = useState<EntityType>('company')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    if (!role) {
      setError('Please choose how you’ll use LoanLens.')
      return
    }
    if (entityType === 'company' && !companyName.trim()) {
      setError('Please enter your company name.')
      return
    }

    setLoading(true)
    const supabase = createClient()

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          signup_role: role,
          entity_type: entityType,
          first_name: firstName,
          last_name: lastName,
          company_name: entityType === 'company' ? companyName : '',
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="w-full max-w-sm space-y-4 p-8 text-center">
          <h1 className="text-2xl font-bold text-foreground">Check your email</h1>
          <p className="text-muted-foreground">
            We sent a confirmation link to <strong>{email}</strong>. Click it to
            activate your account and finish setup.
          </p>
          <Link href="/login" className="text-sm font-medium underline text-primary">Back to sign in</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background py-10">
      <div className="w-full max-w-sm space-y-6 p-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Create your account</h1>
          <p className="text-sm text-muted-foreground mt-1">Set up your entity on LoanLens.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Role */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">How will you use LoanLens?</label>
            <div className="grid grid-cols-2 gap-3">
              {(['broker', 'lender'] as Role[]).map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setRole(r)}
                  className={`rounded-lg border-2 p-3 text-left transition-all ${
                    role === r ? 'border-primary bg-accent' : 'border-border bg-card hover:border-primary'
                  }`}
                >
                  <span className="block text-sm font-semibold text-foreground capitalize">{r}</span>
                  <span className="block text-xs text-muted-foreground mt-0.5">
                    {r === 'broker' ? 'I originate & place deals' : 'I deploy funds & manage loans'}
                  </span>
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">You can enable the other later in settings.</p>
          </div>

          {/* Entity type */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Are you a company or an individual?</label>
            <div className="grid grid-cols-2 gap-3">
              {(['company', 'individual'] as EntityType[]).map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setEntityType(t)}
                  className={`rounded-lg border-2 p-3 text-center text-sm font-semibold capitalize transition-all ${
                    entityType === t ? 'border-primary bg-accent text-foreground' : 'border-border bg-card text-foreground hover:border-primary'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Names — always */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="firstName" className="text-sm font-medium text-foreground">First name</label>
              <input id="firstName" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground" />
            </div>
            <div className="space-y-1">
              <label htmlFor="lastName" className="text-sm font-medium text-foreground">Last name</label>
              <input id="lastName" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground" />
            </div>
          </div>

          {/* Company name — only if company */}
          {entityType === 'company' && (
            <div className="space-y-1">
              <label htmlFor="companyName" className="text-sm font-medium text-foreground">Company name</label>
              <input id="companyName" type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground" />
            </div>
          )}

          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground" />
          </div>

          {/* Password with eye toggle */}
          <div className="space-y-1">
            <label htmlFor="password" className="text-sm font-medium text-foreground">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                minLength={6}
                className="w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm text-foreground"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full rounded-md px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
            style={{ background: 'var(--primary)' }}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="font-medium underline text-primary">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
