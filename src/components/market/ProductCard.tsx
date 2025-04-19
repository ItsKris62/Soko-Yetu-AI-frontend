'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Heart, MessageSquare, ShoppingCart } from 'lucide-react'
import RatingStars from '@/components/ui/RatingStars'
import { useAuthStore } from '@/store/authStore'

interface ProductProps {
  product: {
    id: string
    name: string
    category: string
    price: number
    imageUrl: string
    verified: boolean
    county: string
    subCounty: string
    sellerName: string
    rating: number
  }
}

export default function ProductCard({ product }: ProductProps) {
  const { isAuthenticated } = useAuthStore()
  const [showChat, setShowChat] = useState(false)

  const handleChat = () => {
    if (!isAuthenticated) {
      window.dispatchEvent(new CustomEvent('openLoginModal'))
      return
    }
    setShowChat(true)
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden flex flex-col">
      <div className="relative h-48">
        <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
      </div>
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-md">{product.category}</span>
            {product.verified && <span className="px-2 py-1 bg-green-100 text-green-600 rounded-md">Verified</span>}
          </div>
          <h3 className="mt-2 font-semibold text-lg">{product.name}</h3>
          <p className="text-sm text-gray-600 mt-1">{product.county}, {product.subCounty}</p>
          <p className="text-sm text-gray-600">Seller: {product.sellerName}</p>
          <RatingStars rating={product.rating} className="mt-2" />
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="font-bold text-teal-700">${product.price.toFixed(2)}</span>
          <div className="flex space-x-3 text-gray-500">
            <button title="Favorite" aria-label="Favorite"><Heart size={18} /></button>
            <button onClick={handleChat} title="Chat" aria-label="Chat"><MessageSquare size={18} /></button>
            <button title="Add to cart" aria-label="Add to cart"><ShoppingCart size={18} /></button>
          </div>
        </div>
      </div>
      {showChat && (
        <div className="border-t p-4 bg-gray-50">
          {/* Implement your chat UI here */}
          <p>Chat with {product.sellerName}</p>
          </div>
      )}
    </div>
  )
}