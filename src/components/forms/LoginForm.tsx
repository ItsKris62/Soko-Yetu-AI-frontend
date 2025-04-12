'use client'

import { useState } from 'react'
import { loginSchema } from '../../lib/validators'
import { api } from '../../lib/api'
import { errorToast, successToast } from '../../utils/toast'
import { useModalStore } from '../../store/modalStore'
import { useRouter } from 'next/navigation'
import Lottie from 'lottie-react'
import successAnim from '../../../public/lottie/Success-animation.json'
import { redirectToDashboard } from '../../lib/helpers'

export default function LoginForm() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const { closeModal } = useModalStore()
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = loginSchema.safeParse(form)
    if (!result.success) return errorToast('Invalid credentials')

    try {
      const res = await api.post('/auth/login', form)
      const user = res.data.user
      const redirectPath = redirectToDashboard(user.role)

      setShowSuccess(true)
      successToast('Login successful')
      setTimeout(() => {
        closeModal()
        router.push(redirectPath)
      }, 1800)
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Login failed'
      errorToast(message)
    }
  }

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-6">
        <Lottie animationData={successAnim} loop={false} className="w-32 h-32" />
        <p className="text-green-600 font-semibold mt-4">Welcome back 🎉</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 animate-slideIn px-1">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <input
            type="email"
            name="email"
            placeholder="your@email.com"
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition text-sm"
            required
          />
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 text-sm">
            <i className="fas fa-envelope"></i>
          </span>
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <input
            type={showPass ? 'text' : 'password'}
            name="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 pr-10 pl-10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition text-sm"
            required
          />
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 text-sm">
            <i className="fas fa-lock"></i>
          </span>
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary transition"
            aria-label="Toggle Password"
          >
            <i className={`fas fa-${showPass ? 'eye-slash' : 'eye'}`}></i>
          </button>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-[#297373] to-[#85FFC7] text-white font-bold py-2 rounded-lg shadow hover:shadow-md transform transition hover:scale-105 active:scale-95"
      >
        <i className="fas fa-sign-in-alt mr-2"></i> Login
      </button>
    </form>
  )
}
