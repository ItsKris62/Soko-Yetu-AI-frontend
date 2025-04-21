'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { useModalStore } from '@/store/modalStore'
import { useAuthStore } from '@/store/authStore'
import { Menu, X, Bell } from 'lucide-react'
import Image from 'next/image'
import SearchBar from '@/components/market/SearchBar'

// Navigation items: public=true always visible; public=false only when authenticated
const navItems = [
  { name: 'Marketplace', href: '/market', public: true },
  { name: 'Resources',   href: '/resources', public: true },
  { name: 'Community',    href: '/community', public: true },
  { name: 'My Products',  href: '/dashboard', public: false },
  { name: 'AI Insights',  href: '/insights', public: false },
  { name: 'Messages',     href: '/messages', public: false },
]

export default function Header() {
  const { openModal } = useModalStore()
  const { isAuthenticated } = useAuthStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [language, setLanguage] = useState('English')
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)
  const pathname = usePathname()

  // filter nav items based on authentication
  const filteredLinks = navItems.filter(
    (item) => item.public || isAuthenticated
  )

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'English' ? 'Kiswahili' : 'English'))
    setShowLanguageDropdown(false)
  }

  const selectLanguage = (lang: string) => {
    setLanguage(lang)
    setShowLanguageDropdown(false)
  }

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center">
        {/* Logo */}
        <div className="w-1/4">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="https://res.cloudinary.com/veriwoks-sokoyetu/image/upload/v1741705403/Home-images/sguubafg5gk2sbdtqd60.png"
              alt="SokoYetu AI Logo"
              width={40}
              height={40}
              className="object-contain"
            />
            <span className="text-xl font-bold text-secondary font-heading">
              SokoYetu AI
            </span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center justify-center gap-6 text-sm font-medium w-2/4">
          {filteredLinks.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`transition duration-300 ease-in-out hover:text-primary hover:text-[#85FFC7] transition-colors duration-300 ${
                pathname === item.href ? 'text-primary' : 'text-dark'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Right section */}
        <div className="w-1/4 flex items-center justify-end gap-4">
          {/* Show search & notifications when authenticated */}
          {isAuthenticated && (
            <>
              <div className="hidden sm:block w-48">
                <SearchBar value="" onChange={() => {}} />
              </div>
              <button className="text-dark hover:text-primary transition duration-300" aria-label="Notifications">
                <Bell size={20} />
              </button>
            </>
          )}

          {/* Language selector */}
          <div className="relative">
            <button
              onClick={() => setShowLanguageDropdown((o) => !o)}
              className="flex items-center gap-1 text-dark hover:text-primary transition duration-300"
              aria-label="Toggle language"
            >
              <i className="fas fa-globe" />
              <span>{language}</span>
              <i
                className={`fa-solid fa-chevron-down text-xs transition-transform duration-300 ${
                  showLanguageDropdown ? 'rotate-180' : ''
                }`}
              />
            </button>
            {showLanguageDropdown && (
              <div className="absolute right-0 top-full mt-2 w-32 bg-white shadow-lg border rounded-md z-10">
                {['English', 'Kiswahili'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => selectLanguage(lang)}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 ${
                      language === lang ? 'text-primary font-medium' : ''
                    }`}
                  >
                    <i className="fa-solid fa-globe" />
                    <span>{lang}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Auth / Login button */}
          {!isAuthenticated && (
            <button
              onClick={() => openModal('login')}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-[#297373] to-[#85FFC7] text-white text-sm font-bold shadow-lg hover:shadow-xl transition-transform duration-300 hover:scale-105"
            >
              Get Started
            </button>
          )}
        </div>

        {/* Mobile toggle */}
        <div className="md:hidden">
          <button onClick={() => setMobileOpen((o) => !o)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t px-4 pb-4">
          <nav className="flex flex-col gap-3 mt-4 text-sm font-medium">
            {filteredLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`transition duration-300 ease-in-out hover:text-primary hover:text-primary hover:text-[#85FFC7] transition-colors duration-300 ${
                  pathname === item.href ? 'text-primary' : 'text-dark'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="mt-3 border-t pt-3 flex justify-between">
              <span>Language</span>
              <button
                onClick={toggleLanguage}
                className="text-dark hover:text-primary transition duration-300 flex items-center gap-1"
              >
                <i className="fas fa-globe" />
                <span>{language}</span>
              </button>
            </div>
            {!isAuthenticated && (
              <button
                onClick={() => {
                  openModal('login')
                  setMobileOpen(false)
                }}
                className="mt-4 w-full bg-primary text-white px-4 py-2 rounded-md hover:bg-[#85FFC7] transition-transform duration-300 hover:scale-105"
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
