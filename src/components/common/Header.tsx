"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Modal from './Modal';
import LoginForm from '@/app/auth/login/page'; // Import the login form
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAuthClick = () => {
    setActiveTab('login');
    setIsModalOpen(true);
  };

  return (
    <header 
      className={`
        flex justify-between items-center fixed top-0 w-full z-40
        transition-all duration-300 ease-in-out 
        px-4 md:px-8
        ${isScrolled
          ? 'py-2 bg-white/80 backdrop-blur-md shadow-md'
          : 'py-3 bg-white'
        }
      `}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center">
        <Image
          src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1741705403/Home-images/sguubafg5gk2sbdtqd60.png`}
          alt="Soko Yetu Logo"
          width={50}
          height={17}
          priority
          className="h-auto"
        />
      </Link>

      {/* Menu Links */}
      <nav className="hidden md:flex space-x-6 text-gray-700">
        <Link href="/" className="hover:text-primary transition-colors">Homepage</Link>
        <Link href="/marketplace" className="hover:text-primary transition-colors">Marketplace</Link>
        <Link href="/community" className="hover:text-primary transition-colors">Community</Link>
        <Link href="/resources" className="hover:text-primary transition-colors">Resources</Link>
        <Link href="/ai-insights" className="hover:text-primary transition-colors">AI Insights</Link>
      </nav>

      {/* Login/Sign Up Button */}
      <button
        onClick={handleAuthClick}
        className="bg-primary text-white px-4 py-1.5 rounded-full hover:bg-secondary transition-all text-sm font-medium"
      >
        Login / Sign Up
      </button>

      {/* Auth Modal */}
      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-6">
          {/* Tab Selector */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`px-4 py-2 font-medium text-sm ${activeTab === 'login' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
              onClick={() => setActiveTab('login')}
            >
              Login
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm ${activeTab === 'signup' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
              onClick={() => setActiveTab('signup')}
            >
              Sign Up
            </button>
          </div>

          {/* Animated Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: activeTab === 'login' ? -10 : 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: activeTab === 'login' ? -10 : 10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'login' ? (
                <LoginForm onSuccess={() => setIsModalOpen(false)} />
              ) : (
                <div className="text-center py-8">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Create an Account</h3>
                  <p className="text-gray-600 mb-6">Join our community of farmers and buyers</p>
                  <Link 
                    href="/auth/register" 
                    onClick={() => setIsModalOpen(false)}
                    className="inline-block bg-primary text-white px-6 py-2 rounded-full hover:bg-secondary transition-colors"
                  >
                    Go to Sign Up Page
                  </Link>
                  <p className="text-sm text-gray-500 mt-4">
                    Already have an account?{' '}
                    <button 
                      className="text-primary hover:underline"
                      onClick={() => setActiveTab('login')}
                    >
                      Sign in
                    </button>
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </Modal>
    </header>
  );
};

export default Header;