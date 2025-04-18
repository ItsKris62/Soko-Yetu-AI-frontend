// src/components/sections/InsightsDashboard.tsx
'use client'

import { useEffect, useState } from 'react'
import useSWR from 'swr'
import PriceTrendsChart from './charts/PriceTrendsChart'
import MarketDemandChart from './charts/MarketDemandChart'
import QualityAssessmentPanel from './panels/QualityAssessmentPanel'
import SeasonalForecastPanel from './panels/SeasonalForecastPanel'
import RegionalInsightsPanel from './panels/RegionalInsightsPanel'

// Generic data‐fetcher for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function InsightsDashboard() {
  // 1) Load the user’s saved location (lat/lng) from our /api/auth/me endpoint
  const { data: user } = useSWR('/api/auth/me', fetcher)
  const lat = user?.latitude
  const lng = user?.longitude

  // 2) Once we know lat/lng, fetch each insights endpoint
  const { data: priceTrends } = useSWR(
    () => (lat && lng ? `/api/insights/price-trends?lat=${lat}&lng=${lng}` : null),
    fetcher
  )
  const { data: marketDemand } = useSWR(
    () => (lat && lng ? `/api/insights/market-demand?lat=${lat}&lng=${lng}` : null),
    fetcher
  )
  const { data: quality } = useSWR(
    () => (lat && lng ? `/api/insights/quality-assessment?lat=${lat}&lng=${lng}` : null),
    fetcher
  )
  const { data: regional } = useSWR(
    () => (lat && lng ? `/api/insights/regional-insights?lat=${lat}&lng=${lng}` : null),
    fetcher
  )
  // 3) Seasonal forecast powered by Weatherbit
  const { data: seasonal } = useSWR(
    () => (lat && lng ? `/api/weather/seasonal-forecast?lat=${lat}&lng=${lng}` : null),
    fetcher
  )

  return (
    <section className="py-16 bg-neutral-100">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-heading font-bold text-center mb-2">AI-Powered Market Insights</h2>
        <p className="text-gray-600 text-center mb-8">
          Make data-driven decisions with our advanced analytics and predictive insights.
        </p>

        {/* Top row: two charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-lg text-center font-semibold mb-4">Price Trends</h3>
            {priceTrends ? (
              <PriceTrendsChart data={priceTrends} />
            ) : (
              <p>Loading chart…</p>
            )}
            <p className="mt-4 text-sm text-gray-500">
              Track price fluctuations over time to identify the best selling opportunities.
            </p>
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-lg text-center font-semibold mb-4">Market Demand</h3>
            {marketDemand ? (
              <MarketDemandChart data={marketDemand} />
            ) : (
              <p>Loading chart…</p>
            )}
            <p className="mt-4 text-sm text-gray-500">
              Understand current market demand to optimize your production planning.
            </p>
          </div>
        </div>

        {/* Bottom row: three panels */}
        <div className="grid lg:grid-cols-3 gap-6 mt-8">
          <QualityAssessmentPanel data={quality} />
          <SeasonalForecastPanel data={seasonal} />
          <RegionalInsightsPanel data={regional} />
        </div>
      </div>
    </section>
  )
}
