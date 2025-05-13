'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '../../stores/authStore';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { Product } from '../../types/product';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { isAuthenticated } = useAuthStore();
  const [showModal, setShowModal] = useState(false);

  const handleContactClick = () => {
    if (!isAuthenticated) {
      setShowModal(true);
    } else {
      // Initiate contact with farmer (e.g., redirect to messages)
      window.location.href = `/messages?farmer_id=${product.farmer_id}`;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105">
      <img
        src={product.image_url || '/images/placeholder.jpg'}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
          <span className="text-sm bg-[#FFEBD0] text-[#278783] px-2 py-1 rounded">{product.category_name}</span>
        </div>
        <p className="text-sm text-gray-600 mb-2">{product.county_name}</p>
        <div className="flex justify-between items-center mb-2">
          <p className="text-lg font-bold text-gray-800">KSH {product.price}</p>
          {product.ai_suggested_price && (
            <p className="text-sm text-gray-600">
              AI Suggested: KSH {product.ai_suggested_price}{' '}
              {product.ai_suggested_price > product.price && <span className="text-green-500">↑</span>}
            </p>
          )}
        </div>
        {product.ai_quality_grade && (
          <div className="flex items-center mb-4">
            <span className="text-yellow-500">★★★★★</span>
            <span className="ml-2 text-sm text-gray-600">{product.ai_quality_grade}</span>
          </div>
        )}
        <div className="flex gap-2">
          <Button
            onClick={handleContactClick}
            className="flex-1 bg-[#278783] hover:bg-[#1f6b67] text-white transition-colors rounded-md"
          >
            Contact Seller
          </Button>
          <Link href={`/products/${product.id}`}>
            <Button className="flex-1 bg-transparent border border-[#278783] text-[#278783] hover:bg-[#278783] hover:text-white transition-colors rounded-md">
              Details
            </Button>
          </Link>
        </div>
      </div>

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <div className="p-6 text-center">
            <h3 className="text-xl font-semibold mb-4">Please Log In</h3>
            <p className="text-gray-600 mb-6">
              You need to be logged in to contact farmers. Please log in or sign up to continue.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/login">
                <Button className="bg-[#278783] hover:bg-[#1f6b67] text-white transition-colors">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-gray-200 hover:bg-gray-300 text-gray-800 transition-colors">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}