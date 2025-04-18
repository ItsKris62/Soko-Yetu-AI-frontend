
'use client'

import React from 'react'
import { AuthProvider } from '@/contexts/AuthContext'

/**
 * FarmerDashboardLayout wraps all farmer dashboard pages in AuthProvider
 * and provides consistent padding/background styling.
 */
export default function FarmerDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <main className="min-h-screen bg-neutral-100 py-8 px-4 md:px-8 lg:px-16">
        {/* Dashboard content rendered here */}
        {children}
      </main>
    </AuthProvider>
  )
}