'use client'

import { useState } from 'react'
import { loginSchema } from '../../lib/validators'
import { api } from '../../lib/api'
import { errorToast, successToast } from '../../utils/toast'
import { useModalStore } from '../../store/modalStore'
import { useRouter } from 'next/navigation'
import Lottie from '../ui/LottiePlayer'
import successAnim from '../../../public/lottie/Success-animation.json'
import { redirectToDashboard } from '../../lib/helpers'
import { AxiosError } from 'axios'

// --- Predefined Credentials (FOR TESTING/DEMO ONLY) ---
const PREDEFINED_CREDENTIALS = {
  farmer: {
    email: 'farmer@test.com',
    password: 'farmerpassword', // Use simple passwords only for local testing
    role: 'farmer',
  },
  buyer: {
    email: 'buyer@test.com',
    password: 'buyerpassword', // Use simple passwords only for local testing
    role: 'buyer',
  },
}
// --- END OF PREDEFINED CREDENTIALS ---


export default function LoginForm() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const { closeModal } = useModalStore()
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

 // Helper function to handle successful login simulation/redirect
 const handleSuccess = (role: 'farmer' | 'buyer') => {
  const redirectPath = redirectToDashboard(role); // Get path from helper
  setShowSuccess(true);
  successToast('Login successful (Demo)'); // Indicate it's a demo login
  setTimeout(() => {
    closeModal();
    router.push(redirectPath);
  }, 1800);
}

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // --- Check for Predefined Credentials FIRST ---
    // WARNING: THIS IS FOR TESTING/DEMO ONLY. REMOVE FOR PRODUCTION.
    if (
      form.email === PREDEFINED_CREDENTIALS.farmer.email &&
      form.password === PREDEFINED_CREDENTIALS.farmer.password
    ) {
      console.warn('Using predefined FARMER credentials. Bypassing API call.');
      handleSuccess('farmer');
      return; // Stop execution here, don't call API
    }

    if (
      form.email === PREDEFINED_CREDENTIALS.buyer.email &&
      form.password === PREDEFINED_CREDENTIALS.buyer.password
    ) {
      console.warn('Using predefined BUYER credentials. Bypassing API call.');
      handleSuccess('buyer');
      return; // Stop execution here, don't call API
    }
    // --- End of Predefined Credential Check ---


    // --- Original Login Logic (if not using predefined credentials) ---
    const result = loginSchema.safeParse(form)
    if (!result.success) return errorToast('Invalid credentials format') // More specific error

    try {
      console.log('Attempting API login for:', form.email); // Add log for clarity
      const res = await api.post('/auth/login', form)
      const user = res.data.user

      // Ensure user and user.role exist from API response
      if (!user || !user.role) {
          errorToast('Login failed: Invalid user data received.');
          return;
      }

      const redirectPath = redirectToDashboard(user.role)

      setShowSuccess(true)
      successToast('Login successful')
      setTimeout(() => {
        closeModal()
        router.push(redirectPath)
      }, 1800)
    } catch (err) {
      console.error("API Login Error:", err); // Log the full error
      if (err instanceof AxiosError && err.response?.data) {
        const apiError = err.response.data as { message: string }
        errorToast(apiError.message || "Login failed via API. Try again.");
    } else {
        errorToast('Login failed via API. Try again.');
    }

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
