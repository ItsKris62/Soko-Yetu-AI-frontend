'use client'

import { useState } from 'react'

export default function LoginForm() {
  const [form, setForm] = useState({ idNumber: '', password: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()
    if (!res.ok) return alert(data.message)
    alert('Login successful')
  }

  return (
    <form className="space-y-4 max-w-md" onSubmit={handleSubmit}>
      <input
        required
        type="text"
        placeholder="ID Number"
        className="w-full px-3 py-2 border rounded"
        value={form.idNumber}
        onChange={(e) => setForm({ ...form, idNumber: e.target.value })}
      />
      <input
        required
        type="password"
        placeholder="Password"
        className="w-full px-3 py-2 border rounded"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button className="w-full bg-primary text-dark py-2 rounded font-semibold">Login</button>
    </form>
  )
}
