'use client'

import { useModalStore } from '../store/modalStore'
import CountUp from 'react-countup'

const stats = [
  { label: 'Active Farmers', value: 5280 },
  { label: 'Products Listed', value: 12450 },
  { label: 'Successful Trades', value: 8740 },
]

export default function Hero() {
  const { openModal } = useModalStore()

  return (
    <section
      className="bg-cover bg-center py-24 text-white relative"
      style={{
        backgroundImage: `url('https://res.cloudinary.com/veriwoks-sokoyetu/image/upload/v1742489001/richard-bell-vpfEhvI5UE4-unsplash_cgffcz.jpg')`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 max-w-3xl leading-tight">
              Empowering Kenyan Farmers with AI-Driven Insights
            </h1>
            <p className="text-lg font-body max-w-2xl mb-6">
              Connect directly with buyers, get fair prices, and make data-driven decisions
              with our innovative agricultural marketplace.
            </p>
            <div className="flex gap-4 flex-wrap">
              <button 
                onClick={openModal} 
                className="bg-[#297373] text-dark font-semibold px-6 py-3 rounded-lg 
                transform transition-all duration-300 ease-in-out hover:scale-105 
                hover:bg-primary/90 hover:shadow-lg active:scale-95 
                border-2 border-transparent hover:border-primary/20"
              >
                List Your Produce
              </button>
              <button 
                onClick={openModal} 
                className="bg-[#297373] text-secondary font-semibold px-6 py-3 rounded-lg 
                transform transition-all duration-300 ease-in-out hover:scale-105 
                hover:bg-secondary/10 hover:shadow-lg active:scale-95 
                border-2 border-transparent hover:border-white/20"
              >
                Find Products
              </button>
            </div>
          </div>

          <div className="flex gap-6 flex-wrap justify-end items-end mt-12 md:mt-24">
            {stats.map((s) => (
              <div
                key={s.label}
                className="bg-white/20 text-white backdrop-blur p-4 rounded shadow-md text-center min-w-[150px]"
              >
                <div className="text-2xl font-bold">
                  <CountUp end={s.value} duration={2.5} separator="," />+
                </div>
                <div className="text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
