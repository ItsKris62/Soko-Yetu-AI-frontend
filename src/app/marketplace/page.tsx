'use client';

import { useState, useEffect } from 'react';
import ProductCard from '../../components/marketplace/ProductCard';
import ProductFilter from '../../components/marketplace/ProductFilter';
import { fetchMarketplaceData } from '../../utils/api';
import { Product } from '../../types/product';

interface FilterParams {
  category?: string;
  county?: string;
  minPrice?: number;
  maxPrice?: number;
  qualityRating?: number;
  search?: string;
}

export default function MarketplacePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [filters, setFilters] = useState<FilterParams>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMarketplaceData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchMarketplaceData(page, limit, filters);
        setProducts(data.products || []); // Ensure products is always an array
        setTotal(data.total || 0);
      } catch {
        setError('Failed to load marketplace data.');
        setProducts([]); // Set to empty array on error
      } finally {
        setLoading(false);
      }
    };
    loadMarketplaceData();
  }, [page, filters, limit]);

  const handleFilterChange = (newFilters: Partial<FilterParams>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(1); // Reset to first page when filters change
  };

  if (loading) {
    return <div className="py-12 px-6 text-center text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="py-12 px-6 text-center text-red-500">{error}</div>;
  }

  return (
    <section className="py-12 px-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 slide-up">Marketplace</h1>
        <p className="text-lg text-gray-600 mb-8 slide-up">
          Explore a wide range of agricultural products from verified farmers
        </p>
        <ProductFilter onFilterChange={handleFilterChange} />
        {products.length === 0 ? (
          <p className="text-gray-600 text-center">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-[#278783] text-white rounded-lg hover:bg-[#1f6b67] disabled:bg-gray-300 transition-colors"
          >
            Previous
          </button>
          <span className="py-2 text-gray-600">
            Page {page} of {Math.ceil(total / limit)}
          </span>
          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={page >= Math.ceil(total / limit)}
            className="px-4 py-2 bg-[#278783] text-white rounded-lg hover:bg-[#1f6b67] disabled:bg-gray-300 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}