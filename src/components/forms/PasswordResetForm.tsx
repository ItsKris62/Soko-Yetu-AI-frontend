'use client'

import { useState } from 'react'
import { api } from '@/lib/api'
import { resetSchema } from '@/lib/validators'
//import { z } from 'zod' // Removed unused import
import { errorToast, successToast } from '@/utils/toast'
import { useModalStore } from '@/store/modalStore'
import Lottie from '../ui/LottiePlayer'
import successAnim from '../../../public/lottie/Success-animation.json'
import { useRouter } from 'next/navigation'
import { AxiosError } from 'axios'

// Define a type for the form state
type FormState = {
  email: string;
  name: string;
  phone: string;
  newPassword: string;
};

// Define a more specific type for API errors
interface ApiError {
  message: string;
}

export default function PasswordResetForm({ modal = false }: { modal?: boolean }) {
  const [step, setStep] = useState<'email' | 'verify' | 'reset'>('email')
  const [form, setForm] = useState<FormState>({ // Use the FormState type
    email: '',
    name: '',
    phone: '',
    newPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const { closeModal } = useModalStore()
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (step === 'email') {
        if (!form.email || !form.email.includes('@')) return errorToast('Please enter a valid email')
        await api.post('/auth/reset/request', { email: form.email })
        successToast('Email found. Please verify identity')
        setStep('verify')
      }

      else if (step === 'verify') {
        if (!form.name || !form.phone) return errorToast('Please fill name and phone')
        await api.post('/auth/reset/verify', {
          email: form.email,
          name: form.name,
          phone: form.phone,
        })
        successToast('Identity verified')
        setStep('reset')
      }

      else if (step === 'reset') {
        // Use zod to parse and validate
        const result = resetSchema.safeParse(form);

        if (!result.success) {
          // Error handling from zod
          const errorMessages = result.error.issues.map(issue => issue.message).join(', ');
          return errorToast(errorMessages);
        }

        // Extract validated data from result.data
        const validatedData = result.data as FormState;

        await api.post('/auth/reset/final', {
          email: validatedData.email,
          newPassword: validatedData.newPassword,
        })

        setShowSuccess(true)
        successToast('Password updated successfully')

        setTimeout(() => {
          closeModal()
          if (!modal) router.push('/auth/login')
        }, 2000)
      }

    } catch (err) {
      // Improved error handling with specific type
      if (err instanceof AxiosError && err.response?.data) {
          const apiError = err.response.data as ApiError
          errorToast(apiError.message || "Something went wrong");
      } else {
          errorToast('Something went wrong');
      }
    }
  }

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-6">
        <Lottie animationData={successAnim} loop={false} className="w-32 h-32" />
        <p className="text-green-600 font-semibold mt-4">Password Reset Successful</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-slideIn px-2 py-4">
    {step === 'email' && (
      <div>
      <label className="block text-sm font-medium text-gray-700">Email</label>
      <div className="relative mt-1">
        <input
          name="email"
          type="email"
          placeholder="Enter your email"
          value={form.email}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 focus:ring-2 focus:ring-primary text-sm"
          required
        />
        <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 text-sm">
          <i className="fas fa-envelope"></i>
        </span>
      </div>
    </div>
    )}
  
    {step === 'verify' && (
<>
      <div>
      <label className="block text-sm font-medium text-gray-700">Full Name</label>
      <div className="relative mt-1">
        <input
          name="name"
          type="text"
          placeholder="Your full name"
          value={form.name}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 focus:ring-2 focus:ring-primary text-sm"
          required
        />
        <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 text-sm">
          <i className="fas fa-user"></i>
        </span>
      </div>
    </div>

        <div className="mt-4">
  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
  <div className="relative mt-1">
    <input
      name="phone"
      type="tel"
      placeholder="Phone number"
      value={form.phone}
      onChange={handleChange}
      className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 focus:ring-2 focus:ring-primary text-sm"
      required
    />
    <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 text-sm">
      <i className="fas fa-phone"></i>
    </span>
  </div>
</div>
</>
    )}
  
    {step === 'reset' && (
      <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
      <input
        name="newPassword"
        type={showPassword ? 'text' : 'password'}
        placeholder="Enter new password"
        value={form.newPassword}
        onChange={handleChange}
        className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 pr-10 focus:ring-2 focus:ring-primary text-sm"
        required
      />
      <span className="absolute left-3 top-2.5 text-gray-400">
        <i className="fas fa-lock"></i>
      </span>
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-2.5 text-gray-500 hover:text-primary"
        aria-label="Toggle Password"
      >
        <i className={`fas fa-${showPassword ? 'eye-slash' : 'eye'}`}></i>
      </button>
    </div>
    )}
  
    <button type="submit" className="btn-primary w-full">
      {step === 'email' ? 'Next' : step === 'verify' ? 'Verify' : 'Reset Password'}
    </button>
  </form>
  
  )
}
