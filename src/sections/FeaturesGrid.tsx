'use client'

const features = [
  {
    icon: '📊',
    title: 'AI Price Insights',
    description: 'Real-time price recommendations based on market trends.',
  },
  {
    icon: '⭐',
    title: 'Quality Assessment',
    description: 'AI-powered quality ratings to help buyers make decisions.',
  },
  {
    icon: '📍',
    title: 'Geolocation Matching',
    description: 'Match buyers and sellers nearby to reduce logistics costs.',
  },
  {
    icon: '📈',
    title: 'Market Analytics',
    description: 'Track market trends and production cycles effectively.',
  },
  {
    icon: '💬',
    title: 'Direct Messaging',
    description: 'Communicate directly with partners and buyers.',
  },
  {
    icon: '🧾',
    title: 'Transaction History',
    description: 'Build trust through visible trade records.',
  },
]

export default function FeatureGrid() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold font-heading text-center mb-4">
          Revolutionizing Agricultural Trade
        </h2>
        <p className="text-center text-gray-600 mb-10 max-w-3xl mx-auto">
          Our AI-powered platform helps farmers maximize profits and buyers source efficiently.
        </p>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div
              key={i}
              className="group rounded-xl p-6 text-center bg-neutral shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:bg-white"
            >
              <div className="flex justify-center mb-4">
                <div className="bg-primary text-dark w-16 h-16 flex items-center justify-center rounded-full text-3xl shadow-sm transition-all group-hover:scale-105">
                  {feature.icon}
                </div>
              </div>
              <h3 className="font-semibold text-xl mb-2 font-accent text-dark">{feature.title}</h3>
              <p className="text-sm text-gray-700">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
