'use client'

import React, { useEffect, useState } from 'react'
import ProfileBanner from '@/components/dashboard/ProfileBanner'
import StatsPanel from '@/components/dashboard/StatsPanel'
import TransactionsPanel from '@/components/dashboard/TransactionsPanel'
import PerformanceChart from '@/components/dashboard/PerformanceChart'
import { useAuth } from '@/hooks/useAuth'
import axios from 'axios'

export default function BuyerDashboard() {
  const { token, logout } = useAuth()
  const [stats, setStats] = useState<any>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [performance, setPerformance] = useState<{ labels: string[]; data: number[] }>({ labels: [], data: [] })
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'settings'>('overview')


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

      {/* Tab Nav */}
      <div className="max-w-7xl mx-auto px-4 mt-12">
        <nav className="border-b mb-6 flex gap-6 text-sm font-medium text-gray-700">
          <button
            onClick={() => setActiveTab('overview')}
            className={ activeTab === 'overview' ? 'text-primary border-b-2 border-primary' : '' }
          >Overview</button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={ activeTab === 'transactions' ? 'text-primary border-b-2 border-primary' : '' }
          >Transactions</button>
          <button
            onClick={() => setActiveTab('settings')}
            className={ activeTab === 'settings' ? 'text-primary border-b-2 border-primary' : '' }
          >Settings</button>
        </nav>

        <div className="grid md:grid-cols-3 gap-6">
          {activeTab === 'overview' && (
            <>
              <div className="md:col-span-2 space-y-6">
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
            <div className="md:col-span-3 bg-white p-6 rounded shadow">⚙️ Settings coming soon</div>
          )}
        </div>
      </div>
    </div>
  )
}