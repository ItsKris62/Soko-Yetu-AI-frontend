'use client'

import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'

const testimonials = [
  {
    name: 'John Mwangi',
    role: 'Maize Farmer, Nakuru',
    text: 'AgriConnect AI transformed my business. I now get fair prices and plan better.',
  },
  {
    name: 'Sarah Wanjiku',
    role: 'Restaurant Owner, Nairobi',
    text: 'Reliable suppliers, fresh vegetables and market insights – game-changer!',
  },
  {
    name: 'David Omondi',
    role: 'Tomato Farmer, Kiambu',
    text: 'The AI price insights and buyer access changed my tomato farm completely.',
  },
]

export default function Testimonials() {
  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: {
      perView: 1,
      spacing: 20,
    },
  })

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-heading font-bold mb-6">Success Stories</h2>
        <div ref={sliderRef} className="keen-slider">
          {testimonials.map((t, i) => (
            <div key={i} className="keen-slider__slide bg-neutral p-6 rounded shadow text-left">
              <p className="italic text-gray-700 mb-4 font-accent">“{t.text}”</p>
              <div className="font-semibold">{t.name}</div>
              <div className="text-sm text-gray-600">{t.role}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
