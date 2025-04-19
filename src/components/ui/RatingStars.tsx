// components/ui/RatingStars.tsx
'use client'

import React from 'react'

interface RatingStarsProps {
  rating: number      // e.g. 3.5, 4, etc.
  maxStars?: number   // default 5
  className?: string
}

export default function RatingStars({
  rating,
  maxStars = 5,
  className = '',
}: RatingStarsProps) {
  const stars = Array.from({ length: maxStars }, (_, i) => {
    const idx = i + 1
    if (rating >= idx) {
      return 'fas fa-star'           // full star
    } else if (rating >= idx - 0.5) {
      return 'fas fa-star-half-alt'  // half star
    } else {
      return 'far fa-star'           // empty star
    }
  })

  return (
    <div className={`flex space-x-1 text-yellow-500 ${className}`}>
      {stars.map((icon, i) => (
        <i key={i} className={`${icon} text-sm`} />
      ))}
    </div>
  )
}
