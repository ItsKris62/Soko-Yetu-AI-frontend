'use client';

import { useState } from 'react';
import Link from 'next/link';
import useAuthStore from '../../stores/authStore';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { Product } from '../../types/product';
import { placeOrder } from '../../utils/api';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { isAuthenticated, user } = useAuthStore();
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'login' | 'order-success' | null>(null);

  const handleContactClick = () => {
    if (!isAuthenticated) {
      setModalType('login');
      setShowModal(true);
    } else {
      window.location.href = `/messages?farmer_id=${product.farmer_id}`;
    }
  };

  const handleOrderClick = async () => {
    if (!isAuthenticated) {
      setModalType('login');
      setShowModal(true);
      return;
    }

    try {
      const orderData = {
        buyer_id: user?.id,
        product_id: product.id,
        quantity: 1,
        total_price: product.price * 1,
      };
      await placeOrder(orderData);
      setModalType('order-success');
      setShowModal(true);
    } catch (err) {
      console.error('Failed to place order:', err);
      alert('Failed to place order. Please try again.');
    }
  };

  return (
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 ease-out overflow-hidden border border-gray-100 hover:border-primary/20 transform hover:-translate-y-2">
      {/* Image Container with Overlay */}
      <div className="relative overflow-hidden">
        <img
          src={product.image_url || '/images/placeholder.jpg'}
          alt={product.product_name}
          className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Category Badge */}
        <div className="absolute top-4 right-4">
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium font-siptext bg-secondary/95 text-primary backdrop-blur-sm border border-primary/10">
            {product.category_name}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-gray-900 font-leonetta leading-tight group-hover:text-primary transition-colors duration-300">
            {product.product_name}
          </h3>
          <p className="text-sm text-gray-500 font-siptext flex items-center">
            <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {product.county_name}
          </p>
        </div>

        {/* Pricing Section */}
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900 font-navara">
              KSH {product.price.toLocaleString()}
            </p>
            {product.ai_suggested_price && (
              <div className="flex items-center space-x-2">
                <p className="text-sm text-gray-500 font-siptext">
                  AI Suggested: KSH {product.ai_suggested_price.toLocaleString()}
                </p>
                {product.ai_suggested_price > product.price && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                    </svg>
                    Better Deal
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Quality Rating */}
        {product.ai_quality_grade && (
          <div className="flex items-center space-x-2 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200/50">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <span className="text-sm font-medium text-gray-700 font-siptext">
              {product.ai_quality_grade} Quality
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button
            onClick={handleContactClick}
            className="group/btn relative flex items-center justify-center bg-primary hover:bg-primary/90 text-white py-3 px-4 rounded-xl font-medium font-siptext transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 active:scale-95"
          >
            <svg className="w-4 h-4 mr-2 transition-transform group-hover/btn:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Contact
          </Button>
          
          <Button
            onClick={handleOrderClick}
            className="group/btn relative flex items-center justify-center bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 px-4 rounded-xl font-medium font-siptext transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/25 active:scale-95"
          >
            <svg className="w-4 h-4 mr-2 transition-transform group-hover/btn:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8m-8 0v-5m8 5v-5" />
            </svg>
            Order
          </Button>
        </div>

        {/* Details Link */}
        <Link href={`/products/${product.id}`} className="block">
          <Button className="w-full bg-transparent border-2 border-primary/20 text-primary hover:bg-primary hover:text-white hover:border-primary py-3 px-4 rounded-xl font-medium font-siptext transition-all duration-300 hover:shadow-md active:scale-95">
            View Details
            <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </Link>
      </div>

      {/* Login Modal */}
      {showModal && modalType === 'login' && (
        <Modal onClose={() => setShowModal(false)} show={showModal}>
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-gray-900 font-leonetta">Welcome Back!</h3>
              <p className="text-gray-600 font-siptext max-w-sm mx-auto">
                Please log in to interact with products and connect with farmers.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/login">
                <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-medium font-siptext transition-all duration-300 hover:shadow-lg">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-800 px-8 py-3 rounded-xl font-medium font-siptext transition-all duration-300">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </Modal>
      )}

      {/* Success Modal */}
      {showModal && modalType === 'order-success' && (
        <Modal onClose={() => setShowModal(false)} show={showModal}>
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-gray-900 font-leonetta">Order Confirmed!</h3>
              <p className="text-gray-600 font-siptext max-w-sm mx-auto">
                Your order for <span className="font-medium text-gray-900">{product.product_name}</span> has been placed successfully.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/dashboard">
                <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-medium font-siptext transition-all duration-300 hover:shadow-lg">
                  Track Order
                </Button>
              </Link>
              <Button
                onClick={() => setShowModal(false)}
                className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-800 px-8 py-3 rounded-xl font-medium font-siptext transition-all duration-300"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}