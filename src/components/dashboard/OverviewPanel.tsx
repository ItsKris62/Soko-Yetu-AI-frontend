import React from 'react'

// Props: stats is a record of metric names to values
type OverviewPanelProps = {
  stats: Record<string, any>
}

/**
 * OverviewPanel displays key farmer statistics in a grid layout.
 * @param stats - An object where keys are metric identifiers and values are the corresponding metrics.
 */
export default function OverviewPanel({ stats }: OverviewPanelProps) {
  // Show loading state if stats haven't been fetched yet
  if (!stats) {
    return (
      <div className="bg-white p-6 rounded shadow">
        <p className="text-gray-500">Loading overview...</p>
      </div>
    )
  }

  // Convert snake_case or camelCase keys to Title Case labels
  const formatLabel = (key: string) => {
    return key
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
  }

  return (
    <div className="bg-white p-6 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">Overview</h3>
      <div className="grid md:grid-cols-2 gap-6">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key}>
            <p className="font-semibold text-gray-700">{formatLabel(key)}</p>
            <p className="text-gray-900">{value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
  