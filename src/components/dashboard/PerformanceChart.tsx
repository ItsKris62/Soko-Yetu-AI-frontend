'use client'

import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement)

export default function PerformanceChart({ labels = [], data = [] }) {
  return (
    <div className="bg-white p-6 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">Monthly Performance</h3>
      <Line
        data={{
          labels,
          datasets: [{
            label: 'Sales (KES)',
            data,
            fill: false,
            borderColor: '#297373',
            backgroundColor: '#85FFC7',
            tension: 0.4,
          }]
        }}
      />
    </div>
  )
}
