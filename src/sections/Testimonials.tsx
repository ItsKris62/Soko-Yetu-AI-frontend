'use client'

import { useEffect, useState } from 'react'
import RatingStars from '../components/ui/RatingStars'

type Testimonial = {
  id: number
  name: string
  initials: string
  role: string
  county: string
  quote: string
  rating: number
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'John Mwangi',
    initials: 'JM',
    role: 'Maize Farmer',
    county: 'Nakuru',
    quote: `AgriConnect AI has transformed my farming business. I now get fair prices for my maize and can plan my harvests based on market insights. My income has increased by 40% in just six months!`,
    rating: 5,
  },
  {
    id: 2,
    name: 'Sarah Wanjiku',
    initials: 'SW',
    role: 'Restaurant Owner',
    county: 'Nairobi',
    quote: `As a restaurant owner, finding reliable suppliers was always a challenge. With AgriConnect AI, I can source fresh vegetables directly from farmers near Nairobi. The quality assessment feature ensures I always get the best produce.`,
    rating: 4,
  },
  {
    id: 3,
    name: 'David Omondi',
    initials: 'DO',
    role: 'Tomato Farmer',
    county: 'Kiambu',
    quote: `The AI price insights have been a game-changer for my tomato farm. I now know exactly when to sell for maximum profit. The platform has connected me with buyers I never had access to before.`,
    rating: 4,
  },
]

export default function TestimonialsCarousel() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length)
    }, 7000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="bg-[#f9fafb] py-20">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-2">Success Stories</h2>
        <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
          Hear from farmers and buyers who have transformed their agricultural business with AgriConnect AI.
        </p>

        <div className="grid md:grid-cols-3 gap-6 transition-all overflow-x-auto pb-4">
          {testimonials.map((t, idx) => (
            <div
              key={t.id}
              className={`rounded-lg bg-white p-6 text-left shadow-lg hover:shadow-xl transition-all duration-500 ${
                idx === current ? 'opacity-100 scale-100' : 'md:opacity-50 md:scale-95'
              }`}
            >
              <RatingStars rating={t.rating} />
              <blockquote className="italic text-gray-800 mt-3 mb-6">
                “{t.quote}”
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="bg-neutral w-10 h-10 flex items-center justify-center rounded-full font-semibold text-sm text-secondary">
                  {t.initials}
                </div>
                <div>
                  <div className="font-bold">{t.name}</div>
                  <div className="text-sm text-gray-500">{t.role}, {t.county}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Indicators */}
        <div className="mt-6 flex justify-center gap-2">
          {testimonials.map((_, idx) => (
            <div
              key={idx}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                idx === current ? 'bg-primary' : 'bg-gray-300'
              }`}
            ></div>
          ))}
        </div>
      </div>
    </section>
  )
}
