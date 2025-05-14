'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

// Dynamically import Lottie to avoid SSR issues, similar to your other forms
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });


import notFoundAnimationData from '@/../public/animations/error-404-animation.json';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-sky-100 flex flex-col items-center justify-center p-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full max-w-md"
      >
        {notFoundAnimationData && (
          <div className="w-64 h-64 md:w-80 md:h-80 mx-auto">
            <Lottie animationData={notFoundAnimationData} loop={true} />
          </div>
        )}
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-4xl md:text-5xl font-bold text-slate-700 mt-8 mb-4"
      >
        Oops! Page Not Found
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="text-lg text-slate-600 mb-8 max-w-sm"
      >
        It seems like the page you were looking for does not exist or has been moved.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.7, type: 'spring', stiffness: 120 }}
      >
        <Link
          href="/"
          className="px-8 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-dark transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
        >
          Go Back to Homepage
        </Link>
      </motion.div>
    </div>
  );
}