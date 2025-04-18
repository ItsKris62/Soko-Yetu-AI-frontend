'use client'

import React, { useEffect, useState } from 'react'
import ProfileBanner from '@/components/dashboard/ProfileBanner'
import OverviewPanel from '@/components/dashboard/OverviewPanel'
import StatsPanel from '@/components/dashboard/StatsPanel'
import PerformanceChart from '@/components/dashboard/PerformanceChart'
import TransactionsPanel from '@/components/dashboard/TransactionsPanel'
import { useAuth } from '@/hooks/useAuth'
import axios from 'axios'

export default function FarmerDashboard() {
  const { token, logout } = useAuth()

  // Dashboard data state
  const [stats, setStats] = useState<any>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [performance, setPerformance] = useState<{ labels: string[]; data: number[] }>({
    labels: [],
    data: [],
  })
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'settings'>('overview')

  // Fetch dashboard data once token is available
  useEffect(() => {
    if (!token) {
      logout()
      return
    }

    const backend = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'
    const config = {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    }

    async function fetchData() {
      try {
        // Parallel requests for stats, transactions, performance
        const [s, t, p] = await Promise.all([
          axios.get(`${backend}/api/users/stats`, config),
          axios.get(`${backend}/api/users/transactions`, config),
          axios.get(`${backend}/api/users/performance`, config),
        ])
        setStats(s.data)
        setTransactions(t.data)
        setPerformance(p.data)
      } catch (err) {
        console.error('Dashboard fetch error:', err)
      }
    }

    fetchData()
  }, [token, logout])

  return (
    <div>
      <ProfileBanner />

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 mt-12">
        <nav className="border-b mb-6 flex gap-6 text-sm font-medium text-gray-700">
          {(['overview', 'transactions', 'settings'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={
                activeTab === tab ? 'text-primary border-b-2 border-primary' : ''
              }
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>

        {/* Tab Content */}
        <div className="grid md:grid-cols-3 gap-6">
          {activeTab === 'overview' && (
            <>
              <div className="md:col-span-2 space-y-6">
                <OverviewPanel stats={stats} />
                <PerformanceChart labels={performance.labels} data={performance.data} />
              </div>
              <StatsPanel stats={stats} />
            </>
          )}

          {activeTab === 'transactions' && (
            <div className="md:col-span-3">
              <TransactionsPanel transactions={transactions} />
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="md:col-span-3 bg-white p-6 rounded shadow">
              ⚙️ Settings coming soon
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
