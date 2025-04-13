'use client'

import { useEffect, useState } from 'react'
import ProfileBanner from '@/components/dashboard/ProfileBanner'
import StatsPanel from '@/components/dashboard/StatsPanel'
import TransactionsPanel from '@/components/dashboard/TransactionsPanel'
import PerformanceChart from '@/components/dashboard/PerformanceChart'
import { useAuth } from '../../hooks/useAuth'
import axios from 'axios'

export default function BuyerDashboard() {
  const { user, token } = useAuth()
  const [stats, setStats] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [performance, setPerformance] = useState({ labels: [], data: [] })
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'settings'>('overview')

  useEffect(() => {
    const backend = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'
    const headers = { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }

    async function fetchData() {
      try {
        const [s, t, p] = await Promise.all([
          axios.get(`${backend}/api/users/stats`, headers),
          axios.get(`${backend}/api/users/transactions`, headers),
          axios.get(`${backend}/api/users/performance`, headers),
        ])
        setStats(s.data)
        setTransactions(t.data)
        setPerformance(p.data)
      } catch (err) {
        console.error('Dashboard fetch error:', err)
      }
    }

    if (token) fetchData()
  }, [token])

  return (
    <div className="min-h-screen bg-neutral-100 pb-20">
      <ProfileBanner />

      <div className="max-w-7xl mx-auto px-4 mt-12">
        <div className="border-b mb-6 flex gap-6 text-sm font-medium text-gray-700">
          <button onClick={() => setActiveTab('overview')} className={activeTab === 'overview' ? 'text-primary border-b-2 border-primary' : ''}>Overview</button>
          <button onClick={() => setActiveTab('transactions')} className={activeTab === 'transactions' ? 'text-primary border-b-2 border-primary' : ''}>Transactions</button>
          <button onClick={() => setActiveTab('settings')} className={activeTab === 'settings' ? 'text-primary border-b-2 border-primary' : ''}>Settings</button>
        </div>

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
