export default function InsightsDashboard() {
    return (
      <section className="py-16 bg-neutral">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold mb-6">AI-Powered Market Insights</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded shadow">📈 <strong>Price Trends</strong></div>
            <div className="bg-white p-4 rounded shadow">📊 <strong>Market Demand</strong></div>
            <div className="bg-white p-4 rounded shadow">🧪 <strong>Quality Assessment</strong></div>
            <div className="bg-white p-4 rounded shadow">🌦️ <strong>Seasonal Forecast</strong></div>
            <div className="bg-white p-4 rounded shadow">📌 <strong>Regional Insights</strong></div>
          </div>
        </div>
      </section>
    )
  }
  