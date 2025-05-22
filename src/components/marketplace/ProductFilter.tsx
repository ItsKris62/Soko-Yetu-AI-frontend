// handles category filtering
'use client';

import { useState, useEffect } from 'react';
import { fetchCategories, fetchCounties } from '../../utils/api';

interface FilterParams {
  category?: string;
  county?: string;
  minPrice?: number;
  maxPrice?: number;
  qualityRating?: number;
  search?: string;
}

interface ProductFilterProps {
  onFilterChange: (filters: Partial<FilterParams>) => void;
}

export default function ProductFilter({ onFilterChange }: ProductFilterProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const [counties, setCounties] = useState<{ id: number; name: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [selectedCounty, setSelectedCounty] = useState<string | undefined>(undefined);
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [qualityRating, setQualityRating] = useState<number | undefined>(undefined);
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    const loadData = async () => {
      const fetchedCategories = await fetchCategories();
      const fetchedCounties = await fetchCounties();
      setCategories(fetchedCategories);
      setCounties(fetchedCounties);
    };
    loadData();
  }, []);

  const handleFilterChange = () => {
    onFilterChange({
      category: selectedCategory,
      county: selectedCounty,
      minPrice,
      maxPrice,
      qualityRating,
      search: search || undefined,
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleFilterChange();
  };

  return (
    <div className="mb-6 space-y-4">
      {/* Search Bar */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Search Products</h3>
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or description..."
            className="w-full p-2 border border-gray-300 rounded input-focus"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#278783] text-white rounded-lg hover:bg-[#1f6b67] transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Category Filter */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Categories</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setSelectedCategory(undefined);
              handleFilterChange();
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              !selectedCategory ? 'bg-[#278783] text-white' : 'bg-gray-200 text-gray-800'
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                handleFilterChange();
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category ? 'bg-[#278783] text-white' : 'bg-gray-200 text-gray-800'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* County Filter */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Counties</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setSelectedCounty(undefined);
              handleFilterChange();
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              !selectedCounty ? 'bg-[#278783] text-white' : 'bg-gray-200 text-gray-800'
            }`}
          >
            All
          </button>
          {counties.map((county) => (
            <button
              key={county.id}
              onClick={() => {
                setSelectedCounty(county.name);
                handleFilterChange();
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCounty === county.name ? 'bg-[#278783] text-white' : 'bg-gray-200 text-gray-800'
              }`}
            >
              {county.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Price Range (KSH)</h3>
        <div className="flex gap-2">
          <input
            type="number"
            value={minPrice || ''}
            onChange={(e) => {
              const value = e.target.value ? parseFloat(e.target.value) : undefined;
              setMinPrice(value);
              handleFilterChange();
            }}
            placeholder="Min Price"
            className="w-full p-2 border border-gray-300 rounded input-focus"
          />
          <input
            type="number"
            value={maxPrice || ''}
            onChange={(e) => {
              const value = e.target.value ? parseFloat(e.target.value) : undefined;
              setMaxPrice(value);
              handleFilterChange();
            }}
            placeholder="Max Price"
            className="w-full p-2 border border-gray-300 rounded input-focus"
          />
        </div>
      </div>

      {/* Quality Rating Filter */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Quality Rating (1-5)</h3>
        <input
          type="number"
          min="1"
          max="5"
          step="0.1"
          value={qualityRating || ''}
          onChange={(e) => {
            const value = e.target.value ? parseFloat(e.target.value) : undefined;
            setQualityRating(value);
            handleFilterChange();
          }}
          placeholder="Min Rating"
          className="w-full p-2 border border-gray-300 rounded input-focus"
        />
      </div>
    </div>
  );
}