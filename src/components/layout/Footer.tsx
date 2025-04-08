'use client'

import { useAuthStore } from '../../store/authStore'
import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  const { isAuthenticated } = useAuthStore()

  return (
    <footer className="bg-[#297373] text-white py-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
        {/* Brand */}
        <div>
          <div className="text-2xl font-bold text-primary flex items-center mb-2">
            <Image 
              src="https://res.cloudinary.com/veriwoks-sokoyetu/image/upload/v1741705403/Home-images/sguubafg5gk2sbdtqd60.png"
              alt="SokoYetu AI Logo"
              width={32}
              height={32}
              className="object-contain mr-2"
            />
            SokoYetu AI
          </div>
          <p className="text-neutral-300 mb-4">
            Empowering Kenyan farmers with AI-driven insights and direct market access.
          </p>
          <div className="flex gap-4 text-neutral-400">
            <a href="#"><i className="fab fa-facebook"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-linkedin"></i></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold mb-2">Quick Links</h4>
          <ul className="space-y-1 text-neutral-300">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/how-it-works">How It Works</Link></li>
            {isAuthenticated && <li><Link href="/pricing">Pricing</Link></li>}
            <li><Link href="/contact">Contact Us</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className="font-semibold mb-2">Resources</h4>
          <ul className="space-y-1 text-neutral-300">
            <li><Link href="/tips">Farming Tips</Link></li>
            <li><Link href="/reports">Market Reports</Link></li>
            {isAuthenticated && <li><Link href="/success-stories">Success Stories</Link></li>}
            <li><Link href="/blog">Blog</Link></li>
            <li><Link href="/faq">FAQ</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold mb-2">Contact</h4>
          <ul className="space-y-1 text-neutral-300">
            <li>
              <span className="inline-block">📍</span> Nairobi Business Park, Ngong Road, Nairobi
            </li>
            <li>
              <span className="inline-block">📞</span> +254 712 345 678
            </li>
            <li>
              <span className="inline-block">📧</span> info@agriconnect.ai
            </li>
          </ul>
          <div className="mt-4">
            <h5 className="font-semibold mb-1">Payment Methods</h5>
            <div className="flex gap-2 text-neutral-400 text-lg">
              <i className="fab fa-cc-visa"></i>
              <i className="fab fa-cc-mastercard"></i>
              <i className="fab fa-cc-paypal"></i>
              <i className="fas fa-money-bill-wave"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="mt-10 border-t border-gray-700 pt-4 text-center text-xs text-neutral-400">
        <div className="mb-2">&copy; {new Date().getFullYear()} AgriConnect AI. All rights reserved.</div>
        <div className="space-x-4">
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
          <Link href="/cookies">Cookie Policy</Link>
        </div>
      </div>
    </footer>
  )
}
