'use client';

import { useState, useEffect } from 'react';
import ProductCard from '../../components/marketplace/ProductCard';
import ProductFilter from '../../components/marketplace/ProductFilter';
import { fetchProducts } from '../../utils/api';
import { Product } from '../../types/product';

export default function MarketplacePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const limit = 10; // Products per page

  useEffect(() => {
    const loadProducts = async () => {
      const { products: fetchedProducts, total: fetchedTotal } = await fetchProducts(
        page,
        limit,
        selectedCategory
      );
      setProducts(fetchedProducts);
      setTotal(fetchedTotal);
    };
    loadProducts();
  }, [page, selectedCategory]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="py-12 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 slide-up">Marketplace</h2>
        <p className="text-lg text-gray-600 mb-8 slide-up">
          Explore a wide range of products from verified farmers
        </p>
        <ProductFilter onFilterChange={setSelectedCategory} />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-800">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}