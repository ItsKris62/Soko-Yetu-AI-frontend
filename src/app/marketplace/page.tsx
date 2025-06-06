'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import ProductCard from '../../components/marketplace/ProductCard';
import ProductFilter from '../../components/marketplace/ProductFilter';
import { fetchMarketplaceData } from '../../utils/api';
import { Product as ProductType, MarketplaceResponse, FilterParams } from '../../types/api';
import ProductForm from '../../components/products/ProductForm'; 
import Button from '../../components/common/Button';
import Modal from '@/components/common/Modal';
import useAuthStore from '../../stores/authStore';
import Link from 'next/link';

export default function MarketplacePage() {
  const { isAuthenticated } = useAuthStore();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [filters, setFilters] = useState<FilterParams>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

// Refetch function
  const fetchProducts = useCallback(async () => {
    if (products.length > 0) return;
    setLoading(true);
    setError(null);
    try {
      const response: MarketplaceResponse = await fetchMarketplaceData(page, limit, filters);
      setProducts(response.products || []);
      setTotal(response.total || 0);
    } catch {
      setError('Failed to load marketplace data. Please try again later.');
      console.error('Error fetching marketplace data');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [page, filters, limit]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFilterChange = (newFilters: FilterParams) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProductAdded = () => {
    fetchProducts(); // Refetch products after a new product is added
    setShowAddProductModal(false); // Close the modal
  };

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const productList = useMemo(() => {
    return products.map((product) => (
      <ProductCard key={product.id} product={product} />
    ));
  }, [products]);

  if (loading) {
    return <div className="pt-16 px-6 pb-12 text-center text-gray-600">Loading...</div>;
  }

  if (error) {
    return (
      <div className="pt-16 px-4 sm:px-6 lg:px-8 pb-12 bg-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="pt-16 px-4 sm:px-6 lg:px-8 pb-12 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Marketplace</h1>
            <p className="text-lg text-gray-600">
              Discover fresh agricultural products from verified farmers across Kenya.
            </p>
          </div>
          {isAuthenticated ? (
            <Button
              onClick={() => setShowAddProductModal(true)}
              className="bg-[#278783] hover:bg-[#1f6b67] text-white px-6 py-2 rounded-lg transition-colors duration-300 shadow-md"
            >
              Add Product
            </Button>
          ) : (
            <Link href="/login">
              <Button className="bg-[#278783] hover:bg-[#1f6b67] text-white px-6 py-2 rounded-lg transition-colors duration-300 shadow-md">
                Log In to Add Product
              </Button>
            </Link>
          )}
        </div>

        {!isAuthenticated && (
          <div className="mb-8 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded-lg">
            <p className="font-medium">
              You need to be logged in to place orders or contact sellers.{' '}
              <Link href="/login" className="underline hover:text-yellow-800">
                Log in now
              </Link>{' '}
              or{' '}
              <Link href="/register" className="underline hover:text-yellow-800">
                sign up
              </Link>{' '}
              to start shopping!
            </p>
          </div>
        )}

        <div className="mb-8">
          <ProductFilter onFilterChange={handleFilterChange} />
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#278783]"></div>
          </div>
        ) : products.length === 0 ? (
          <p className="text-gray-600 text-center py-12">No products found. Try adjusting your filters.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {productList}
          </div>
        )}

        {products.length > 0 && (
          <div className="mt-12 flex justify-center items-center gap-4">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="px-5 py-2 bg-[#278783] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 hover:bg-[#1f6b67]"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-700 font-medium">
              Page {page} of {Math.ceil(total / limit)}
            </span>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === Math.ceil(total / limit)}
              className="px-5 py-2 bg-[#278783] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 hover:bg-[#1f6b67]"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {showBackToTop && (
        <button
          onClick={handleBackToTop}
          className="fixed bottom-8 right-8 bg-[#278783] text-white p-4 rounded-full shadow-lg hover:bg-[#1f6b67] transition-colors duration-300"
        >
          ↑ Top
        </button>
      )}

      {showAddProductModal && isAuthenticated && (
        <Modal onClose={() => setShowAddProductModal(false)} show={showAddProductModal}>
          <ProductForm
            onSubmit={(data) => console.log('Product submitted:', data)}
            onClose={() => setShowAddProductModal(false)}
            onProductAdded={handleProductAdded}
          />
        </Modal>
      )}
    </div>
  );
}