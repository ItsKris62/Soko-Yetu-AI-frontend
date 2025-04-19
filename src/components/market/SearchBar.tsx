import React from 'react'

interface SearchBarProps {
  value: string
  onChange: (v: string) => void
}

/**
 * Simple search input with icon
 */
export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="flex items-center border rounded overflow-hidden">
      <input
        type="text"
        placeholder="Search products..."
        value={value}
        onChange={e => onChange(e.target.value)}
        className="flex-1 px-4 py-2 focus:outline-none"
      />
      <button
        onClick={() => {}}
        className="px-4 bg-primary text-white"
        aria-label="Search"
      >
        <i className="fas fa-search"></i>
      </button>
    </div>
  )
}