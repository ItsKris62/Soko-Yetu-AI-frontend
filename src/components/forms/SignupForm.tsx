'use client'

import { useState } from 'react'

const roles = ['farmer', 'buyer']

export default function SignupForm() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    idNumber: '',
    gender: '',
    role: '',
    phone: '',
    county: '',
    subCounty: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()
    if (!res.ok) return alert(data.message)
    alert('Signup successful')
  }

  return (
    <form className="space-y-4 max-w-xl" onSubmit={handleSubmit}>
      <div className="flex gap-4">
        <input
          required
          placeholder="First Name"
          className="w-full px-3 py-2 border rounded"
          value={form.firstName}
          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
        />
        <input
          required
          placeholder="Last Name"
          className="w-full px-3 py-2 border rounded"
          value={form.lastName}
          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
        />
      </div>
      <input
        required
        placeholder="ID Number"
        className="w-full px-3 py-2 border rounded"
        value={form.idNumber}
        onChange={(e) => setForm({ ...form, idNumber: e.target.value })}
      />
      <input
        required
        type="tel"
        placeholder="Phone Number"
        className="w-full px-3 py-2 border rounded"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />
      <div className="flex gap-4">
        <select
          required
          className="w-full px-3 py-2 border rounded"
          value={form.gender}
          onChange={(e) => setForm({ ...form, gender: e.target.value })}
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <select
          required
          className="w-full px-3 py-2 border rounded"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="">Select Role</option>
          {roles.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>
      <input
        required
        placeholder="County"
        className="w-full px-3 py-2 border rounded"
        value={form.county}
        onChange={(e) => setForm({ ...form, county: e.target.value })}
      />
      <input
        required
        placeholder="Sub County"
        className="w-full px-3 py-2 border rounded"
        value={form.subCounty}
        onChange={(e) => setForm({ ...form, subCounty: e.target.value })}
      />
      <input
        required
        type="password"
        placeholder="Password"
        className="w-full px-3 py-2 border rounded"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button className="w-full bg-primary text-dark py-2 rounded font-semibold">Create Account</button>
    </form>
  )
}
