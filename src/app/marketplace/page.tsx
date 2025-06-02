'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import ProductCard from '../../components/marketplace/ProductCard';
import ProductFilter from '../../components/marketplace/ProductFilter';
import { fetchMarketplaceData } from '../../utils/api';
import { Product, MarketplaceResponse, FilterParams } from '../../types/api';
import ProductForm from '../../components/products/ProductForm'; 
import Button from '../../components/common/Button';
import Modal from '@/components/common/Modal';

export default function MarketplacePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [filters, setFilters] = useState<FilterParams>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddProductModal, setShowAddProductModal] = useState(false);

// Refetch function
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response: MarketplaceResponse = await fetchMarketplaceData(page, limit, filters);
      setProducts(response.products || []);
      setTotal(response.total || 0);
    } catch {
      setError('Failed to load marketplace data.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [page, filters, limit]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleFilterChange = (newFilters: FilterParams) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleProductAdded = () => {
    fetchProducts(); // Refetch products after a new product is added
    setShowAddProductModal(false); // Close the modal
  };

  const productList = useMemo(() => {
    return products.map((product) => (
      <ProductCard key={product.id} product={product} />
    ));
  }, [products]);

  if (loading) {
    return <div className="py-12 px-6 text-center text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="py-12 px-6 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="py-12 px-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Marketplace</h1>
            <p className="text-lg text-gray-600">
              Explore a wide range of agricultural products from verified farmers.
            </p>
          </div>
          <Button
            onClick={() => setShowAddProductModal(true)}
            className="bg-[#278783] hover:bg-[#1f6b67] text-white px-6 py-2 rounded-lg transition-colors"
          >
            Add Product
          </Button>
        </div>
        <ProductFilter onFilterChange={handleFilterChange} />
        {products.length === 0 ? (
          <p className="text-gray-600 text-center">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {productList}
          </div>
        )}
        <div className="mt-8 flex justify-center gap-2">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {page} of {Math.ceil(total / limit)}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === Math.ceil(total / limit)}
            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal for Adding Product */}
      {showAddProductModal && (
        <Modal onClose={() => setShowAddProductModal(false)} show={showAddProductModal}>
          <ProductForm
            onSubmit={(data) => console.log('Product submitted:', data)} // Optional: Handle submission
            onClose={() => setShowAddProductModal(false)}
            onProductAdded={handleProductAdded} // Pass the refetch callback
          />
        </Modal>
      )}
    </div>
  );
}