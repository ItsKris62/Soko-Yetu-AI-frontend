'use client';

import { useState, useEffect, useMemo } from 'react';
import ProductCard from '../../components/marketplace/ProductCard';
import ProductFilter from '../../components/marketplace/ProductFilter';
import { fetchMarketplaceData } from '../../utils/api';
import { Product, MarketplaceResponse, FilterParams } from '../../types/api';

export default function MarketplacePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [filters, setFilters] = useState<FilterParams>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMarketplaceData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response: MarketplaceResponse = await fetchMarketplaceData(page, limit, filters);
        setProducts(response.products || []); // Ensure products is always an array
        setTotal(response.total || 0);
      } catch (err) {
        setError('Failed to load marketplace data.');
        setProducts([]); // Set to empty array on error
      } finally {
        setLoading(false);
      }
    };
    loadMarketplaceData();
  }, [page, filters]);

  const handleFilterChange = (newFilters: FilterParams) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page on filter change
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Memoize the product list to prevent unnecessary re-renders
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
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Marketplace</h1>
        <p className="text-lg text-gray-600 mb-8">
          Explore a wide range of agricultural products from verified farmers.
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
    </div>
  );
}