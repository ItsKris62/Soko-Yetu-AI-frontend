'use client'

import { Dialog } from '@headlessui/react'
import { useModalStore } from '../store/modalStore'

export default function LoginModal() {
  const { isOpen, closeModal } = useModalStore()

  return (
    <Dialog open={isOpen} onClose={closeModal} className="relative z-50">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center px-4">
        <Dialog.Panel className="w-full max-w-md bg-white p-6 rounded shadow-lg">
          <Dialog.Title className="text-xl font-heading font-bold mb-4">Join AgriConnect AI</Dialog.Title>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-3 py-2 border rounded text-sm"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              className="w-full px-3 py-2 border rounded text-sm"
            />
            <select className="w-full px-3 py-2 border rounded text-sm">
              <option>Select Role</option>
              <option value="farmer">Farmer</option>
              <option value="buyer">Buyer</option>
            </select>
            <button type="submit" className="bg-primary text-dark font-semibold px-4 py-2 rounded w-full">
              Join Now
            </button>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}
