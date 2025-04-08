'use client'

import { useState } from 'react'

export default function PasswordResetForm() {
  const [step, setStep] = useState<'email' | 'verify' | 'reset'>('email')
  const [form, setForm] = useState({
    email: '',
    phone: '',
    name: '',
    password: '',
  })

  const handleEmailCheck = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/auth/check-email', {
      method: 'POST',
      body: JSON.stringify({ email: form.email }),
      headers: { 'Content-Type': 'application/json' },
    })

    const data = await res.json()
    if (!res.ok) return alert(data.message)
    setStep('verify')
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/auth/verify-identity', {
      method: 'POST',
      body: JSON.stringify({ email: form.email, phone: form.phone, name: form.name }),
      headers: { 'Content-Type': 'application/json' },
    })

    const data = await res.json()
    if (!res.ok) return alert(data.message)
    setStep('reset')
  }

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email: form.email, password: form.password }),
      headers: { 'Content-Type': 'application/json' },
    })

    const data = await res.json()
    if (!res.ok) return alert(data.message)
    alert('Password reset successfully')
  }

  return (
    <form className="space-y-4 max-w-md">
      {step === 'email' && (
        <>
          <input
            placeholder="Enter your Email"
            className="w-full px-3 py-2 border rounded"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <button className="w-full bg-primary text-dark py-2 rounded" onClick={handleEmailCheck}>
            Next
          </button>
        </>
      )}

      {step === 'verify' && (
        <>
          <input
            placeholder="Enter your Full Name"
            className="w-full px-3 py-2 border rounded"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            placeholder="Enter your Phone Number"
            className="w-full px-3 py-2 border rounded"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <button className="w-full bg-primary text-dark py-2 rounded" onClick={handleVerify}>
            Verify
          </button>
        </>
      )}

      {step === 'reset' && (
        <>
          <input
            type="password"
            placeholder="Enter new password"
            className="w-full px-3 py-2 border rounded"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button className="w-full bg-primary text-dark py-2 rounded" onClick={handleReset}>
            Reset Password
          </button>
        </>
      )}
    </form>
  )
}
