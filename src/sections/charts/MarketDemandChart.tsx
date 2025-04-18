import React from 'react'
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

/**
 * Props for market demand pie chart
 */
interface MarketDemandData {
  name: string   // crop name
  value: number  // demand metric
}

interface MarketDemandChartProps {
  data: MarketDemandData[]
}

// A small palette for chart slices
const COLORS = ['#297373', '#85FFC7', '#FF8552', '#E6E6E6', '#1A1A1A']

/**
 * Renders a donut chart showing market demand by category.
 */
export default function MarketDemandChart({ data }: MarketDemandChartProps) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={50}
          outerRadius={80}
          label
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend layout="vertical" verticalAlign="middle" align="right" />
      </PieChart>
    </ResponsiveContainer>
  )
}