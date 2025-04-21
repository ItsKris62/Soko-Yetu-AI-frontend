// components/CallToAction.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import toast, { Toaster } from 'react-hot-toast'
import Lottie from 'lottie-react'
import successJson from '../../public/lottie/Success-animation.json'
import errorJson   from '../../public/lottie/error-animation.json'

export default function CallToAction() {
  const [form, setForm] = useState({ name: '', phone: '', role: '' })
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    toast.loading('Sending…', { id: 'send' })

    try {
      // TODO: swap this stub for your real POST /api/contact.ts call
      await new Promise((r) => setTimeout(r, 1200))

      toast.custom(
        (t) => (
          <div
            className={`
              ${t.visible ? 'animate-enter' : 'animate-leave'}
              bg-white rounded-lg p-4 flex items-center space-x-3 shadow-lg
            `}
          >
            <Lottie
              animationData={successJson}
              loop={false}
              style={{ width: 40, height: 40 }}
            />
            <span className="font-medium text-gray-800">
              Thanks, we’ll be in touch!
            </span>
          </div>
        ),
        { id: 'send' }
      )
      setForm({ name: '', phone: '', role: '' })
    } catch {
      toast.custom(
        (t) => (
          <div
            className={`
              ${t.visible ? 'animate-enter' : 'animate-leave'}
              bg-white rounded-lg p-4 flex items-center space-x-3 shadow-lg
            `}
          >
            <Lottie
              animationData={errorJson}
              loop={false}
              style={{ width: 40, height: 40 }}
            />
            <span className="font-medium text-gray-800">
              Oops! Something went wrong.
            </span>
          </div>
        ),
        { id: 'send' }
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-teal-700 to-teal-500 py-20">
      {/* Decorative blobs */}
      <div className="absolute -top-16 -left-16 w-72 h-72 bg-teal-600 rounded-full opacity-30 animate-pulse"></div>
      <div className="absolute -bottom-16 -right-16 w-96 h-96 bg-teal-800 rounded-full opacity-30"></div>

      <Toaster position="top-right" />

      <div className="container mx-auto px-6 md:grid md:grid-cols-2 gap-12 items-center text-white">
        {/* Left: headline & buttons */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Ready to Transform Your ​Agricultural Business?
          </h2>
          <p className="text-lg text-white/90 max-w-lg">
            Join thousands of farmers and buyers who are already benefiting
            from our AI‑powered platform. Get started today and experience the
            future of agricultural trade in Kenya.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="px-6 py-3 bg-white text-teal-700 font-semibold rounded-lg shadow hover:scale-[1.03] transition">
              Create Free Account
            </button>
            <button className="px-6 py-3 bg-transparent border border-white text-white font-semibold rounded-lg hover:bg-white hover:text-teal-700 transition">
              Schedule a Demo
            </button>
          </div>
        </motion.div>

        {/* Right: form */}
        <motion.div
          className="mt-10 md:mt-0 bg-white rounded-2xl p-8 shadow-lg"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-2xl font-semibold text-teal-700 mb-6">
            Get Started in Minutes
          </h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/** Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Enter your name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            {/** Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                placeholder="Enter your phone number"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            {/** Role */}
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                I am a
              </label>
              <select
                id="role"
                name="role"
                required
                value={form.role}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                <option value="">Select your role</option>
                <option value="farmer">Farmer</option>
                <option value="buyer">Buyer</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition disabled:opacity-60"
            >
              {submitting ? 'Sending...' : 'Join Now'}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  )
}
