import React from 'react'

/**
 * Individual quality item
 */
interface QualityItem {
  name: string    // crop name
  score: number   // percentage 0–100
}

interface QualityAssessmentPanelProps {
  data: QualityItem[]
}

/**
 * Renders a series of progress bars indicating quality assessment scores.
 */
export default function QualityAssessmentPanel({ data = [] }: QualityAssessmentPanelProps) {
  return (
    <div className="bg-white p-6 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">Quality Assessment</h3>
      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.name}>
            <div className="flex justify-between mb-1">
              <span className="font-medium">{item.name}</span>
              <span className="text-sm font-medium">{item.score}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-primary"
                style={{ width: `${item.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}