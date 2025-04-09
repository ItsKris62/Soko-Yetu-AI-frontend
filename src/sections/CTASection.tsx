'use client'

import { useState } from 'react'

export default function CallToAction() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    role: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: send to API
    console.log('User registered:', form)
  }

  return (
    <section className="bg-secondary py-16 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        {/* Left: CTA Text */}
        <div>
          <h2 className="text-3xl font-bold mb-4 leading-snug">
            Ready to Transform Your Agricultural Business?
          </h2>
          <p className="text-white/90 mb-6">
            Join thousands of farmers and buyers who are already benefiting from our AI-powered platform.
            Get started today and experience the future of agricultural trade in Kenya.
          </p>
          <button className="bg-white text-secondary font-semibold px-6 py-2 rounded hover:bg-neutral transition">
            Create Free Account
          </button>
        </div>

        {/* Right: Registration Form */}
        <div className="bg-white rounded-lg p-8 shadow-md w-full text-dark">
          <h3 className="text-lg font-semibold mb-4">Get Started in Minutes</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="text-sm font-medium text-gray-700 block mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                placeholder="Enter your name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="phone" className="text-sm font-medium text-gray-700 block mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                placeholder="Enter your phone number"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="role" className="text-sm font-medium text-gray-700 block mb-1">
                I am a
              </label>
              <select
                id="role"
                name="role"
                required
                value={form.role}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
              >
                <option value="">Select your role</option>
                <option value="farmer">Farmer</option>
                <option value="buyer">Buyer</option>
                <option value="other">Other</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-dark font-semibold py-2 rounded hover:bg-accent transition"
            >
              Join Now
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
