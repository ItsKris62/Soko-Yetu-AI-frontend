'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { Menu, X } from 'lucide-react'
import clsx from 'clsx'

const navItems = [
  { label: 'Market', href: '/market', public: true },
  { label: 'My Products', href: '/my-products', public: false },
  { label: 'Insights', href: '/insights', public: false },
  { label: 'Messages', href: '/messages', public: false },
  { label: 'Resources', href: '/resources', public: true },
]

export default function MobileNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()

  const [open, setOpen] = useState(false)

  const filteredItems = navItems.filter(item => item.public || isAuthenticated)

  const handleNavigate = (href: string) => {
    router.push(href)
    setOpen(false)
  }

  return (
    <div className="md:hidden">
      <button
        className="text-dark"
        onClick={() => setOpen(!open)}
        aria-label="Toggle Mobile Navigation"
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {open && (
        <div className="absolute top-16 left-0 w-full bg-white border-t shadow-md z-40 p-4">
          <nav className="flex flex-col gap-4">
            {filteredItems.map(({ label, href }) => (
              <button
                key={label}
                onClick={() => handleNavigate(href)}
                className={clsx(
                  'text-left text-sm font-medium px-2 py-1',
                  pathname === href ? 'text-primary font-semibold' : 'text-dark'
                )}
              >
                {label}
              </button>
            ))}

            {!isAuthenticated && (
              <button
                onClick={() => {
                  router.push('/auth/login')
                  setOpen(false)
                }}
                className="mt-4 w-full bg-primary text-dark px-4 py-2 rounded text-sm font-semibold"
              >
                Get Started
              </button>
            )}
          </nav>
        </div>
      )}
    </div>
  )
}
