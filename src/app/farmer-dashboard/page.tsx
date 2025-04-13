'use client'

import ProfileBanner from '@/components/dashboard/ProfileBanner'
import OverviewPanel from '@/components/dashboard/OverviewPanel'
import StatsPanel from '@/components/dashboard/StatsPanel'
import PerformanceChart from '@/components/dashboard/PerformanceChart'
import TransactionsPanel from '@/components/dashboard/TransactionsPanel'

export default function FarmerDashboard() {
  return (
    <div className="min-h-screen bg-neutral-100 pb-20">
      <ProfileBanner />

      <div className="max-w-7xl mx-auto px-4 mt-8 grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <OverviewPanel />
          <PerformanceChart />
        </div>
        <div className="space-y-6">
          <StatsPanel />
          <TransactionsPanel />
        </div>
      </div>
    </div>
  )
}
