'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from '../marketplace/ProductCard';
import ProductFilter from '../marketplace/ProductFilter';
import { fetchProducts } from '../../utils/api';
import { Product } from '../../types/product';

export default function ProductSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);

  useEffect(() => {
    const loadProducts = async () => {
      const { products: fetchedProducts } = await fetchProducts(1, 5, selectedCategory);
      setProducts(fetchedProducts);
    };
    loadProducts();
  }, [selectedCategory]);

  return (
    <section className="py-12 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 slide-up">Featured Products</h2>
        <p className="text-lg text-gray-600 mb-8 slide-up">
          Discover high-quality agricultural products from verified farmers
        </p>
        <ProductFilter onFilterChange={setSelectedCategory} />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
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