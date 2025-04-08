'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { useModalStore } from '@/store/modalStore'
import { useAuthStore } from '../../store/authStore'
import { Menu, X } from 'lucide-react'
import Image from 'next/image'

const navItems = [
  { name: 'Marketplace', href: '/market', public: true },
  { name: 'My Products', href: '/dashboard', public: false },
  { name: 'AI Insights', href: '/insights', public: false },
  { name: 'Messages', href: '/messages', public: false },
]

export default function Header() {
  const { openModal } = useModalStore()
  const { isAuthenticated } = useAuthStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  const filteredLinks = navItems.filter(
    (item) => item.public || isAuthenticated
  )

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center">
        {/* Logo */}
        <div className="w-1/4">
          <Link href="/" className="text-xl font-bold text-secondary flex items-center gap-1">
            <Image 
              src="https://res.cloudinary.com/veriwoks-sokoyetu/image/upload/v1741705403/Home-images/sguubafg5gk2sbdtqd60.png"
              alt="AgriConnect AI Logo"
              width={32}
              height={32}
              className="object-contain"
            />
            <span className="font-heading">AgriConnect AI</span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center justify-center gap-6 text-sm font-medium w-2/4">
          {filteredLinks.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`hover:text-primary transition ${
                pathname === item.href ? 'text-primary' : 'text-dark'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Right section with language, notifications, and auth */}
        <div className="w-1/4 flex items-center justify-end gap-4">
          {/* Language Dropdown */}
          <div className="relative group">
            <button className="text-dark">English ⌄</button>
            {/* Placeholder dropdown */}
            <div className="absolute right-0 top-full mt-2 bg-white shadow-lg border rounded hidden group-hover:block">
              <button className="block px-4 py-2 hover:bg-neutral w-full text-left">Swahili</button>
            </div>
          </div>

          {isAuthenticated ? (
            <>
              <button className="text-dark">
                <i className="fas fa-bell"></i>
              </button>
              <Link href="/profile" className="text-dark">
                <i className="fas fa-user-circle text-lg"></i>
              </Link>
            </>
          ) : (
            <button
              onClick={openModal}
              className="px-4 py-2 bg-primary text-dark font-semibold rounded"
            >
              Get Started
            </button>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden">
          <button onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t px-4 pb-4">
          <nav className="flex flex-col gap-3 mt-4 text-sm font-medium">
            {filteredLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`hover:text-primary ${
                  pathname === item.href ? 'text-primary' : 'text-dark'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="mt-3 border-t pt-3 flex justify-between">
              <span>Language</span>
              <button className="text-dark">Swahili</button>
            </div>

            {isAuthenticated ? (
              <>
                <Link href="/profile" onClick={() => setMobileOpen(false)}>
                  My Profile
                </Link>
                <Link href="/notifications">Notifications</Link>
              </>
            ) : (
              <button
                onClick={() => {
                  openModal()
                  setMobileOpen(false)
                }}
                className="mt-4 w-full bg-primary text-dark px-4 py-2 rounded"
              >
                Get Started
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
