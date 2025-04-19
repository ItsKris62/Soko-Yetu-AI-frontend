'use client'

import React from 'react'

export default function MarketLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-gray-50 py-4 px-4 md:px-6 lg:px-8">
      {/* Breadcrumbs will be rendered in page.tsx */}
      {children}
    </main>
  )
}