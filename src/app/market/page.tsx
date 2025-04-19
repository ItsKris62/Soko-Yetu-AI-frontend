'use client'

import React, { useEffect, useState } from 'react'
// import Image from 'next/image'
import axios from 'axios'
// import Link from 'next/link'
import SearchBar from '@/components/market/SearchBar'
import SortDropDown, { SortOption } from '@/components/market/SortDropdown'
import FilterPanel from '@/components/market/FiltersPanel'
import ProductCard from '@/components/market/ProductCard'
import { useAuthStore } from '@/store/authStore'

interface Product {
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

export default function MarketPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOption, setSortOption] = useState<SortOption>('newest')
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await axios.get(`/api/products?page=${page}`)
        setProducts(res.data.items)
        setTotalPages(res.data.totalPages)
      } catch (err) {
        console.error('Failed to fetch products', err)
      }
    }
    fetchProducts()
  }, [page])

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  //function setSort(option: SortOption): void {
    // setSortOption(option)
  //}

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative h-96 -mt-8">
  {/* full‑bleed background image */}
  <div className="absolute inset-0">
    <img
      src="https://res.cloudinary.com/veriwoks-sokoyetu/image/upload/v1741199721/Home-images/dtwbwp8dufdo8ze3fyqf.jpg"
      alt="Fresh agricultural produce"
      className="w-full h-full object-cover"
    />
    {/* white → transparent fade over left 37.5% */}
    <div
      className="absolute inset-y-0 left-0"
      style={{ width: '37.5%' }}
    >
      <div className="h-full bg-gradient-to-r from-white to-transparent" />
    </div>
  </div>

  {/* your CTA content */}
  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between h-full px-6 md:px-12">
    <div className="space-y-4 max-w-xl text-center md:text-left">
      <h1 className="text-4xl md:text-5xl font-bold">Agricultural Marketplace</h1>
      <p className="text-lg md:text-xl">
        Connect with farmers, discover fresh produce, and quality
        equipment across Kenya.
      </p>
    </div>
    <button
            onClick={() => isAuthenticated ? window.location.href = '/market/post' : window.dispatchEvent(new CustomEvent('openLoginModal'))}
            className="mt-4 md:mt-0 bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-lg font-semibold shadow-lg transform hover:scale-105 transition"
          >
            Post Your Product
          </button>
        </div>
      </section>

      {/* Controls & Filters */}
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="hidden lg:block lg:w-1/4 sticky top-24">
          <FilterPanel />
        </aside>
        <div className="flex-1 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <SearchBar value={searchTerm} onChange={setSearchTerm} />
            <SortDropDown value={sortOption} onChange={setSortOption} />
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.length > 0 ? (
              products.map(p => <ProductCard key={p.id} product={p} />)
            ) : (
              <p className="col-span-full text-center text-gray-500 py-12">No products found.</p>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="flex justify-center">
              <ul className="inline-flex -space-x-px">
                <li>
                  <button
                    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-white border rounded-l-md hover:bg-gray-100 disabled:opacity-50"
                  >Prev</button>
                </li>
                {pages.map(num => (
                  <li key={num}>
                    <button
                      onClick={() => setPage(num)}
                      className={`px-4 py-2 border-t border-b hover:bg-gray-100 ${num === page ? 'bg-primary text-white font-semibold' : 'bg-white'}`}
                    >{num}</button>
                  </li>
                ))}
                <li>
                  <button
                    onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={page === totalPages}
                    className="px-4 py-2 bg-white border rounded-r-md hover:bg-gray-100 disabled:opacity-50"
                  >Next</button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>
    </div>
  )
}
