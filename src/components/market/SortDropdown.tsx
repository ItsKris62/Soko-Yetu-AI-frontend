'use client'

import React from 'react'

// 1. Define the valid sort options
export type SortOption = 'newest' | 'priceAsc' | 'priceDesc'

// 2. Props for the SortDropdown component
interface SortDropdownProps {
  /**
   * Currently selected sort option
   */
  value: SortOption
  /**
   * Called when user selects a new option
   */
  onChange: (option: SortOption) => void
  /**
   * Optional additional classes for styling
   */
  className?: string
}

// 3. Human‑readable labels mapped to values
const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { value: 'newest',    label: 'Newest' },
  { value: 'priceAsc',  label: 'Price: Low → High' },
  { value: 'priceDesc', label: 'Price: High → Low' },
]

/**
 * A reusable dropdown for selecting product sort order.
 *
 * Example usage:
 * ```tsx
 * import SortDropdown, { SortOption } from '@/components/market/SortDropdown'
 *
 * const [sortOption, setSortOption] = useState<SortOption>('newest')
 *
 * <SortDropdown
 *   value={sortOption}
 *   onChange={setSortOption}
 *   className="w-48"
 * />
 * ```
 */
export default function SortDropdown({
  value,
  onChange,
  className = '',
}: SortDropdownProps) {
  return (
    <div className={`${className} relative inline-block`}>  
      <select
        aria-label="Sort options"
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="block w-full appearance-none bg-white border border-gray-300 py-2 px-4 pr-8 rounded focus:outline-none focus:ring-2 focus:ring-primary"
      >
        {SORT_OPTIONS.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      {/* Chevron icon */}
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  )
}