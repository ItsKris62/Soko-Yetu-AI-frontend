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
  const [modalType, setModalType] = useState<'login' | 'order-success' | null>(null); // To handle different modal messages


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

    // If authenticated, proceed with placing the order
    try {
      const orderData = {
        buyer_id: user?.id, // From the authenticated user
        product_id: product.id,
        quantity: 1, // Default quantity; you can add a quantity selector later
        total_price: product.price * 1, // Calculate total price
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
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl duration-300">
      <img
        src={product.image_url || '/images/placeholder.jpg'}
        alt={product.product_name}
        className="w-full h-48 object-cover"
      />
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-gray-900">{product.product_name}</h3>
          <span className="text-sm bg-[#FFEBD0] text-[#278783] px-3 py-1 rounded-full font-medium">
            {product.category_name}
          </span>
        </div>
        <p className="text-sm text-gray-500 mb-3">{product.county_name}</p>
        <div className="flex justify-between items-center mb-4">
          <p className="text-xl font-bold text-gray-900">KSH {product.price}</p>
          {product.ai_suggested_price && (
            <p className="text-sm text-gray-600">
              AI Suggested: KSH {product.ai_suggested_price}{' '}
              {product.ai_suggested_price > product.price && <span className="text-green-500">↑</span>}
            </p>
          )}
        </div>
        {product.ai_quality_grade && (
          <div className="flex items-center mb-5">
            <span className="text-yellow-400">★★★★★</span>
            <span className="ml-2 text-sm text-gray-600">{product.ai_quality_grade}</span>
          </div>
        )}
        <div className="flex gap-3">
          <Button
            onClick={handleContactClick}
            className="flex-1 bg-[#278783] hover:bg-[#1f6b67] text-white py-2 rounded-lg transition-colors duration-300 font-medium"
          >
            Contact Seller
          </Button>
          <Button
            onClick={handleOrderClick}
            className="flex-1 bg-[#FF8C00] hover:bg-[#E07B00] text-white py-2 rounded-lg transition-colors duration-300 font-medium"
          >
            Order Now
          </Button>
          <Link href={`/products/${product.id}`}>
            <Button className="flex-1 bg-transparent border-2 border-[#278783] text-[#278783] hover:bg-[#278783] hover:text-white py-2 rounded-lg transition-colors duration-300 font-medium">
              Details
            </Button>
          </Link>
        </div>
      </div>

      {showModal && modalType === 'login' && (
        <Modal onClose={() => setShowModal(false)} show={showModal}>
          <div className="p-8 text-center">
            <h3 className="text-2xl font-semibold mb-4 text-gray-900">Please Log In</h3>
            <p className="text-gray-600 mb-6">
              You need to be logged in to interact with this product. Please log in or sign up to continue.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/login">
                <Button className="bg-[#278783] hover:bg-[#1f6b67] text-white px-6 py-2 rounded-lg transition-colors duration-300">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg transition-colors duration-300">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </Modal>
      )}

      {showModal && modalType === 'order-success' && (
        <Modal onClose={() => setShowModal(false)} show={showModal}>
          <div className="p-8 text-center">
            <h3 className="text-2xl font-semibold mb-4 text-gray-900">Order Placed Successfully!</h3>
            <p className="text-gray-600 mb-6">
              Your order for {product.product_name} has been placed. You can track your order in your dashboard.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/dashboard">
                <Button className="bg-[#278783] hover:bg-[#1f6b67] text-white px-6 py-2 rounded-lg transition-colors duration-300">
                  Go to Dashboard
                </Button>
              </Link>
              <Button
                onClick={() => setShowModal(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg transition-colors duration-300"
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