import React from 'react'

interface RegionInsight {
  region: string
  status: string   // e.g. "High Demand", "Stable Prices", "Price Rising"
}

interface RegionalInsightsPanelProps {
  data?: RegionInsight[]
}

/**
 * Displays a list of regions with status badges.
 */
export default function RegionalInsightsPanel({ data = [] }: RegionalInsightsPanelProps) {
  const statusClasses: Record<string, string> = {
    'High Demand': 'bg-green-100 text-green-800',
    'Stable Prices': 'bg-blue-100 text-blue-800',
    'Price Rising': 'bg-orange-100 text-orange-800',
    'Price Falling': 'bg-red-100 text-red-800',
  }

  return (
    <div className="bg-white p-6 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">Regional Insights</h3>
      <ul className="space-y-3">
        {data.map((item) => (
          <li key={item.region} className="flex justify-between items-center">
            <span>{item.region}</span>
            <span
              className={`px-2 py-1 rounded text-sm font-medium ${
                statusClasses[item.status] || 'bg-gray-100 text-gray-800'
              }`}
            >
              {item.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
