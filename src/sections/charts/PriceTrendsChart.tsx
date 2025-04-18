import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

/**
 * Props for price trends chart
 */
interface PriceTrend {
  month: string
  high: number    // e.g. max price for the month
  low: number     // e.g. min price for the month
}

interface PriceTrendsChartProps {
  data: PriceTrend[]
}

/**
 * Renders a line chart showing high and low price trends over time.
 */
export default function PriceTrendsChart({ data }: PriceTrendsChartProps) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend verticalAlign="top" height={36} />
        <Line
          type="monotone"
          dataKey="high"
          name="High Price"
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="low"
          name="Low Price"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}