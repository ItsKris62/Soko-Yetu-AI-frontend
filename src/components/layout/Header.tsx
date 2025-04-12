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
  const [language, setLanguage] = useState('English')
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)
  const pathname = usePathname()

  const filteredLinks = navItems.filter(
    (item) => item.public || isAuthenticated
  )

  const toggleLanguage = () => {
    setLanguage(language === 'English' ? 'Kiswahili' : 'English')
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
          <Link href="/" className="text-xl font-bold text-secondary flex items-center gap-1">
            <Image 
              src="https://res.cloudinary.com/veriwoks-sokoyetu/image/upload/v1741705403/Home-images/sguubafg5gk2sbdtqd60.png"
              alt="SokoYetu AI Logo"
              width={40}
              height={40}
              className="object-contain"
            />
            <span className="font-heading">SokoYetu AI</span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center justify-center gap-6 text-sm font-medium w-2/4">
          {filteredLinks.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`hover:text-[#85FFC7] transition-colors duration-300 ${
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
          <div className="relative">
            <button 
              className="text-dark flex items-center gap-1 hover:text-primary transition-colors duration-300"
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              aria-label="Toggle language"
            >
              <i className="fas fa-globe"></i>
              <span>{language}</span>
              <i className={`fas fa-chevron-down text-xs ml-1 transition-transform duration-300 ${showLanguageDropdown ? 'rotate-180' : ''}`}></i>
            </button>
            {/* Language options dropdown */}
            {showLanguageDropdown && (
              <div className="absolute right-0 top-full mt-2 bg-white shadow-lg border rounded-md min-w-[120px] z-10">
                <button 
                  className={`block px-4 py-2 hover:bg-neutral w-full text-left flex items-center gap-2 ${language === 'English' ? 'text-primary font-medium' : ''}`}
                  onClick={() => selectLanguage('English')}
                >
                  <i className="fas fa-globe"></i>
                  <span>English</span>
                </button>
                <button 
                  className={`block px-4 py-2 hover:bg-neutral w-full text-left flex items-center gap-2 ${language === 'Kiswahili' ? 'text-primary font-medium' : ''}`}
                  onClick={() => selectLanguage('Kiswahili')}
                >
                  <i className="fas fa-globe"></i>
                  <span>Kiswahili</span>
                </button>
              </div>
            )}
          </div>

          {isAuthenticated ? (
            <>
              <button className="text-dark hover:text-primary transition-colors duration-300" aria-label="Notifications">
                <i className="fas fa-bell"></i>
              </button>
              <Link href="/profile" className="text-dark hover:text-primary transition-colors duration-300">
                <i className="fas fa-user-circle text-lg"></i>
              </Link>
            </>
          ) : (
            <button
  onClick={() => openModal('login')}
  className="px-4 py-2 rounded-full bg-gradient-to-r from-[#297373] to-[#85FFC7] text-white text-sm font-bold shadow-lg hover:shadow-xl hover:from-[#85FFC7] hover:to-[#297373] transition-all duration-300 transform hover:scale-110"
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
                className={`hover:text-[#85FFC7] transition-colors duration-300 ${
                  pathname === item.href ? 'text-primary' : 'text-dark'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="mt-3 border-t pt-3 flex justify-between">
              <span>Language</span>
              <button className="text-dark flex items-center gap-1 hover:text-primary transition-colors duration-300">
                <i className="fas fa-globe"></i>
                <span>Swahili</span>
              </button>
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
    openModal('login')
    setMobileOpen(false)
  }}
  className="mt-4 w-full bg-primary text-dark px-4 py-2 rounded-md hover:bg-[#85FFC7] hover:shadow-md transition-all duration-300 transform hover:scale-105"
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
