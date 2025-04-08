'use client'

import { useModalStore } from '../store/modalStore'

const stats = [
  { label: 'Active Farmers', value: '5,280+' },
  { label: 'Products Listed', value: '12,450+' },
  { label: 'Successful Trades', value: '8,740+' },
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
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 max-w-3xl leading-tight">
          Empowering Kenyan Farmers with AI-Driven Insights
        </h1>
        <p className="text-lg font-body max-w-2xl mb-6">
          Connect directly with buyers, get fair prices, and make data-driven decisions
          with our innovative agricultural marketplace.
        </p>
        <div className="flex gap-4 flex-wrap">
          <button onClick={openModal} className="bg-primary text-dark font-semibold px-6 py-3 rounded">
            List Your Produce
          </button>
          <button onClick={openModal} className="bg-white text-secondary font-semibold px-6 py-3 rounded">
            Find Products
          </button>
        </div>

        <div className="flex gap-6 mt-12 flex-wrap">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-white/20 text-white backdrop-blur p-4 rounded shadow-md"
            >
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
