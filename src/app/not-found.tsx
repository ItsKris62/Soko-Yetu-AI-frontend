'use client'

import Lottie from '../components/ui/LottiePlayer'
import notFoundAnim from '../../public/lottie/Error-404-animation.json'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <Lottie animationData={notFoundAnim} loop autoPlay className="w-72 h-72" />
      <h2 className="text-3xl font-bold text-dark mt-4">Page Not Found</h2>
      <p className="text-gray-600 mt-2 mb-6">
        Sorry, the page you’re looking for doesn’t exist.
      </p>
      <Link
        href="/"
        className="bg-primary text-white px-6 py-2 rounded hover:bg-secondary transition"
      >
        Go Back Home
      </Link>
    </div>
  )
}
