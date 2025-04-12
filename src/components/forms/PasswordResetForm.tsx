'use client'

import { useState } from 'react'
import { api } from '@/lib/api'
import { resetSchema } from '@/lib/validators'
//import { z } from 'zod' // Removed unused import
import { errorToast, successToast } from '@/utils/toast'
import { useModalStore } from '@/store/modalStore'
import Lottie from 'lottie-react'
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
    <form onSubmit={handleSubmit} className="space-y-4 animate-slideIn">
      {step === 'email' && (
        <input
          name="email"
          type="email"
          placeholder="Enter your email"
          value={form.email}
          onChange={handleChange}
          className="input"
          required
        />
      )}

      {step === 'verify' && (
        <>
          <input
            name="name"
            type="text"
            placeholder="Your full name"
            value={form.name}
            onChange={handleChange}
            className="input"
            required
          />
          <input
            name="phone"
            type="tel"
            placeholder="Phone number"
            value={form.phone}
            onChange={handleChange}
            className="input"
            required
          />
        </>
      )}

      {step === 'reset' && (
        <div className="relative">
          <input
            name="newPassword"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter new password"
            value={form.newPassword}
            onChange={handleChange}
            className="input pr-10"
            required
          />
          <i
            onClick={() => setShowPassword(!showPassword)}
            className={`fas fa-${showPassword ? 'eye-slash' : 'eye'} absolute right-3 top-3 text-gray-500 cursor-pointer`}
          />
        </div>
      )}

      <button type="submit" className="btn-primary w-full">
        {step === 'email' ? 'Next' : step === 'verify' ? 'Verify' : 'Reset Password'}
      </button>
    </form>
  )
}
