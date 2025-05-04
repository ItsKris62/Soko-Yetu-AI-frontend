"use client";

import Image from 'next/image';
import Link from 'next/link';

const Footer = () => (
  <footer className="bg-[#297373] text-white">
    <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
      {/* Logo and Description */}
      <div>
        <Image
          src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1741705403/Home-images/sguubafg5gk2sbdtqd60.png`}
          alt="Soko Yetu Logo"
          width={60}
          height={20}
        />
        <p className="mt-4 text-gray-400">
          Connecting farmers and buyers across East Africa with AI-driven insights.
        </p>
      </div>

      {/* Marketplace Links */}
      <div>
        <h3 className="font-bold mb-4">Marketplace</h3>
        <ul className="space-y-2">
          <li><Link href="/marketplace" className="hover:text-green-400">Browse Products</Link></li>
          <li><Link href="/sell" className="hover:text-green-400">Sell Products</Link></li>
          <li><Link href="/featured" className="hover:text-green-400">Featured Listings</Link></li>
        </ul>
      </div>

      {/* Resources Links */}
      <div>
        <h3 className="font-bold mb-4">Resources</h3>
        <ul className="space-y-2">
          <li><Link href="/resources/trends" className="hover:text-green-400">Market Trends</Link></li>
          <li><Link href="/resources/guides" className="hover:text-green-400">Guides</Link></li>
          <li><Link href="/resources/stories" className="hover:text-green-400">Success Stories</Link></li>
        </ul>
      </div>

      {/* Company Links */}
      <div>
        <h3 className="font-bold mb-4">Company</h3>
        <ul className="space-y-2">
          <li><Link href="/about" className="hover:text-green-400">About Us</Link></li>
          <li><Link href="/contact" className="hover:text-green-400">Contact</Link></li>
          <li><Link href="/privacy" className="hover:text-green-400">Privacy Policy</Link></li>
          <li><Link href="/terms" className="hover:text-green-400">Terms of Service</Link></li>
        </ul>
      </div>
    </div>
    <div className="mt-8 text-center text-gray-400">
      © {new Date().getFullYear()} Soko Yetu. All rights reserved.
    </div>
  </footer>
);

export default Footer;