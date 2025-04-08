'use client'

import { useModalStore } from '../store/modalStore'

export default function CTASection() {
  const { openModal } = useModalStore()

  return (
    <section className="bg-secondary text-white py-16">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-heading font-bold mb-4">Ready to Transform Your Agricultural Business?</h2>
        <p className="mb-6">Join thousands already benefiting from our AI-powered platform.</p>
        <button
          onClick={openModal}
          className="bg-white text-secondary px-6 py-3 font-semibold rounded shadow"
        >
          Create Free Account
        </button>
      </div>
    </section>
  )
}
