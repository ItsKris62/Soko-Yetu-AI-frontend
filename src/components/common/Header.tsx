"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Modal from './Modal';
import LoginForm from '@/app/auth/login/page'; // Import the login form
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../stores/authStore';
import { fetchNotifications, fetchMessages, markMessageAsRead, markNotificationAsRead } from '../../utils/api';

// Icons for notifications and messages (using SVG for simplicity)
const BellIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
  </svg>
);

const MessageIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
  </svg>
);

const Header = () => {
  const { isAuthenticated, user, setUser, setIsAuthenticated } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [isScrolled, setIsScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [notifications, setNotifications] = useState<{ id: number; message: string; read: boolean; created_at: string }[]>([]);
  const [messages, setMessages] = useState<{ id: number; sender_id: number; sender_name: string; content: string; read: boolean; created_at: string }[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      const loadNotifications = async () => {
        const fetchedNotifications = await fetchNotifications(user.id);
        setNotifications(fetchedNotifications);
      };
      const loadMessages = async () => {
        const fetchedMessages = await fetchMessages(user.id);
        setMessages(fetchedMessages);
      };
      loadNotifications();
      loadMessages();
    }
  }, [isAuthenticated, user]);

  const handleAuthClick = () => {
    setActiveTab('login');
    setIsModalOpen(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setNotifications([]);
    setMessages([]);
  };

  const handleNotificationClick = async (notificationId: number) => {
    await markNotificationAsRead(notificationId);
    setNotifications((prev) => prev.map((n) => n.id === notificationId ? { ...n, read: true } : n));
  };

  const handleMessageClick = async (messageId: number) => {
    await markMessageAsRead(messageId);
    setMessages((prev) => prev.map((m) => m.id === messageId ? { ...m, read: true } : m));
  };

  const unreadNotifications = notifications.filter((n) => !n.read).length;
  const unreadMessages = messages.filter((m) => !m.read).length;

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
        {isAuthenticated && (
          <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
        )}
      </nav>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {isAuthenticated ? (
          <>
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative text-gray-700 hover:text-primary transition-colors"
              >
                <BellIcon />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </button>
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50"
                  >
                    <div className="p-4">
                      <h4 className="text-sm font-semibold text-gray-800 mb-2">Notifications</h4>
                      {notifications.length === 0 ? (
                        <p className="text-gray-600 text-sm">No notifications.</p>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            onClick={() => handleNotificationClick(notification.id)}
                            className={`p-2 text-sm rounded-lg cursor-pointer ${notification.read ? 'bg-gray-100' : 'bg-[#FFEBD0]'}`}
                          >
                            <p className="text-gray-800">{notification.message}</p>
                            <p className="text-gray-500 text-xs">{new Date(notification.created_at).toLocaleString()}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Messages */}
            <div className="relative">
              <button
                onClick={() => setShowMessages(!showMessages)}
                className="relative text-gray-700 hover:text-primary transition-colors"
              >
                <MessageIcon />
                {unreadMessages > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadMessages}
                  </span>
                )}
              </button>
              <AnimatePresence>
                {showMessages && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50"
                  >
                    <div className="p-4">
                      <h4 className="text-sm font-semibold text-gray-800 mb-2">Messages</h4>
                      {messages.length === 0 ? (
                        <p className="text-gray-600 text-sm">No messages.</p>
                      ) : (
                        messages.map((message) => (
                          <div
                            key={message.id}
                            onClick={() => handleMessageClick(message.id)}
                            className={`p-2 text-sm rounded-lg cursor-pointer ${message.read ? 'bg-gray-100' : 'bg-[#FFEBD0]'}`}
                          >
                            <p className="text-gray-800 font-semibold">{message.sender_name}</p>
                            <p className="text-gray-800">{message.content}</p>
                            <p className="text-gray-500 text-xs">{new Date(message.created_at).toLocaleString()}</p>
                          </div>
                        ))
                      )}
                      <Link href="/messages" className="block text-center text-primary text-sm mt-2 hover:underline">
                        View All Messages
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="bg-primary text-white px-4 py-1.5 rounded-full hover:bg-secondary transition-all text-sm font-medium"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={handleAuthClick}
            className="bg-primary text-white px-4 py-1.5 rounded-full hover:bg-secondary transition-all text-sm font-medium"
          >
            Login / Sign Up
          </button>
        )}
      </div>

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