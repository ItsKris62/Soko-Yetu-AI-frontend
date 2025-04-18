// wraps the dashboard in your AuthProvider

'use client'

import React from 'react'
import { AuthProvider } from '@/contexts/AuthContext'

/**
 * A component that wraps the dashboard in your AuthProvider, providing
 * authentication functionality to pages inside the dashboard.
 *
 * The dashboard is rendered inside a main element with a class of
 * "flex-grow container mx-auto px-4 py-8". This gives the dashboard
 * a basic layout with padding and makes it fill the available space
 * in the viewport.
 *
 * @param {{ children: React.ReactNode }} props
 * @returns {JSX.Element}
 */
export default function BuyerDashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
        <main className="min-h-screen bg-neutral-100 py-8 px-4 md:px-8 lg:px-16">
          {/* Dashboard content will render here, wrapped by AuthProvider */}
          {children}
        </main>
      </AuthProvider>
    )
  }