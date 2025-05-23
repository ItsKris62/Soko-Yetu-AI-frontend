'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import ProductCard from '../marketplace/ProductCard';
import ProductFilter, { FilterParams } from '../marketplace/ProductFilter';
import { fetchProducts } from '../../utils/api';
import { Product } from '../../types/product';

export default function ProductSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentCategoryFilter, setCurrentCategoryFilter] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const { products: fetchedProducts } = await fetchProducts(1, 5, currentCategoryFilter);
        setProducts(fetchedProducts || []); // Ensure products is always an array
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        setProducts([]); // Reset to empty array on error
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [currentCategoryFilter]);

  const handleFilterChange = useCallback((filters: Partial<FilterParams>) => {
    setCurrentCategoryFilter(filters.category);
  }, []);

  if (loading) {
    return (
      <section className="py-12 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-2 slide-up">Featured Products</h2>
          <p className="text-lg text-gray-600 mb-8 slide-up">
            Discover high-quality agricultural products from verified farmers
          </p>
          <div className="text-center">Loading products...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-2 slide-up">Featured Products</h2>
          <p className="text-lg text-gray-600 mb-8 slide-up">
            Discover high-quality agricultural products from verified farmers
          </p>
          <div className="text-center text-red-500">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 slide-up">Featured Products</h2>
        <p className="text-lg text-gray-600 mb-8 slide-up">
          Discover high-quality agricultural products from verified farmers
        </p>
        <ProductFilter onFilterChange={handleFilterChange} />
        {products.length === 0 ? (
          <div className="text-center text-gray-600">No products found for the selected category.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
        <div className="mt-8 text-center">
          <Link href="/marketplace">
            <button className="px-6 py-3 bg-[#278783] text-white rounded-lg hover:bg-[#1f6b67] transition-colors">
              View All Products
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}