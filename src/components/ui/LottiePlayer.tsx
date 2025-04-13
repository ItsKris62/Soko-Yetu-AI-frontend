'use client'

import dynamic from 'next/dynamic'

const Lottie = dynamic(() => import('lottie-react'), {
  ssr: false,
  loading: () => <div className="text-center">Loading animation...</div>,
})

export default Lottie
