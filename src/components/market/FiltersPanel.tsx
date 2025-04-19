'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useFilterStore } from '@/store/filterStore'

interface County {
  county_id: number
  county_name: string
}

export default function FiltersPanel() {
  const [counties, setCounties] = useState<County[]>([])
  const { filters, setFilters, resetFilters } = useFilterStore()

  useEffect(() => {
    async function loadCounties() {
      try {
        const res = await axios.get<County[]>('/api/location/counties')
        setCounties(res.data)
      } catch (err) {
        console.error('Error fetching counties:', err)
      }
    }
    loadCounties()
  }, [])

  return (
    <div className="space-y-6 bg-white p-4 rounded-md shadow">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">Filters</h4>
        <button
          onClick={resetFilters}
          className="text-sm text-blue-600 hover:underline"
        >
          Clear All
        </button>
      </div>

      {/* Region Filter */}
      <div>
        <label htmlFor="region-select" className="block text-sm font-medium mb-1">Region</label>
        <select
          id="region-select"
          value={filters.county}
          onChange={(e) => setFilters({ county: e.target.value })}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All Regions</option>
          {counties.map((c) => (
            <option key={c.county_id} value={String(c.county_id)}>
              {c.county_name}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range Filter */}
            <div>
              <label htmlFor="price-range-select" className="block text-sm font-medium mb-1">Price Range</label>
              <select
                id="price-range-select"
                value={`${filters.min}-${filters.max}`}
                onChange={(e) => {
                  const [min, max] = e.target.value.split('-')
                  setFilters({ min, max })
                }}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="-">All Prices</option>
                <option value="0-50">0 - 50</option>
                <option value="50-100">50 - 100</option>
                <option value="100-">100+</option>
              </select>
            </div>
    </div>
  )
}
