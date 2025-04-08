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
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div key={i} className="border rounded-lg p-6 text-center shadow-sm bg-neutral">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="font-semibold text-xl mb-2 font-accent">{f.title}</h3>
                <p className="text-sm text-gray-700">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }
  