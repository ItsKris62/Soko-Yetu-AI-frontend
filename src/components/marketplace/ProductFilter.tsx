// handles category filtering


'use client';

import { useState, useEffect } from 'react';
import { fetchCategories } from '../../utils/api';

interface ProductFilterProps {
  onFilterChange: (category: string | undefined) => void;
}

export default function ProductFilter({ onFilterChange }: ProductFilterProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);

  useEffect(() => {
    const loadCategories = async () => {
      const fetchedCategories = await fetchCategories();
      setCategories(fetchedCategories);
    };
    loadCategories();
  }, []);

  const handleCategoryChange = (category: string | undefined) => {
    setSelectedCategory(category);
    onFilterChange(category);
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Categories</h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleCategoryChange(undefined)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            !selectedCategory ? 'bg-[#278783] text-white' : 'bg-gray-200 text-gray-800'
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === category ? 'bg-[#278783] text-white' : 'bg-gray-200 text-gray-800'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}