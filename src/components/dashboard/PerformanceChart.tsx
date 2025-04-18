'use client'

import React from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface PerformanceChartProps {
  labels: string[]
  data: number[]
}

export default function PerformanceChart({ labels, data }: PerformanceChartProps) {
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Sales (KES)',
        data,
        fill: false,
        borderColor: 'rgba(41,115,115,1)',
        tension: 0.4,
      },
    ],
  }

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Monthly Performance',
        font: { size: 16, weight: 600 },
      },
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true },
    },
  }

  return (
    <div className="w-full h-64 md:h-80 lg:h-96">
      <Line data={chartData} options={options} />
    </div>
  )
}
