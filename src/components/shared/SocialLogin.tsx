'use client'

import { useRouter } from 'next/navigation'
import { FaGoogle, FaFacebook, FaApple } from 'react-icons/fa'

const BACKEND_URL = 'http://localhost:8000' // or your prod endpoint

export default function SocialLogin() {
  const router = useRouter()

  const handleOAuth = (provider: string) => {
    window.location.href = `${BACKEND_URL}/auth/${provider}`
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4 justify-between">
        <button
          onClick={() => handleOAuth('google')}
          className="w-full flex items-center justify-center gap-2 py-2 rounded border border-gray-300 hover:bg-gray-100 transition"
        >
          <FaGoogle className="text-[#DB4437]" /> Sign in with Google
        </button>

        <button
          onClick={() => handleOAuth('facebook')}
          className="w-full flex items-center justify-center gap-2 py-2 rounded border border-gray-300 hover:bg-gray-100 transition"
        >
          <FaFacebook className="text-[#4267B2]" /> Facebook
        </button>
      </div>

      <button
        onClick={() => handleOAuth('apple')}
        className="w-full flex items-center justify-center gap-2 py-2 rounded border border-gray-300 hover:bg-gray-100 transition"
      >
        <FaApple className="text-black" /> Continue with Apple
      </button>
    </div>
  )
}
