'use client';

import { useState, useEffect } from 'react';
import { fetchCategories, fetchCounties } from '../../utils/api';
import { FilterParams } from '../../types/api';
import { useDebounce } from '../../hooks/useDebounce';

interface ProductFilterProps {
  onFilterChange: (filters: FilterParams) => void;
}

interface Category {
  id: string;
  name: string;
}

interface County {
  id: number;
  name: string;
}

export default function ProductFilter({ onFilterChange }: ProductFilterProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [counties, setCounties] = useState<County[]>([]);
  const [filters, setFilters] = useState<FilterParams>({});
  const [searchInput, setSearchInput] = useState<string>(''); // Local state for search input
  const debouncedSearchQuery = useDebounce(searchInput, 500); // Debounce the search input

  useEffect(() => {
    const loadData = async () => {
      try {
        const fetchedCategories = await fetchCategories();
        const fetchedCounties = await fetchCounties();
        setCategories(fetchedCategories);
        setCounties(fetchedCounties);
      } catch (err) {
        console.error('Failed to load filter data:', err);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    // Update filters with debounced search query
    handleFilterChange('searchQuery', debouncedSearchQuery);
  }, [debouncedSearchQuery]);

  const handleFilterChange = (key: keyof FilterParams, value: string | number | undefined) => {
    const newFilters = { ...filters, [key]: value };
    if (!value || value === '') {
      delete newFilters[key];
    }
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter Products</h3>
      <div className="space-y-4">
        {/* Search Bar */}
        <div>
          <label htmlFor="searchQuery" className="block text-sm font-medium text-gray-700 mb-1">
            Search Products
          </label>
          <input
            id="searchQuery"
            type="text"
            placeholder="Search by name or description..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#278783] transition-colors"
          />
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Categories</h4>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleFilterChange('category', undefined)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                !filters.category
                  ? 'bg-[#278783] text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.id} // Use category.id as the key
                onClick={() => handleFilterChange('category', category.name)} // Use category.name for filtering
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  filters.category === category.name
                    ? 'bg-[#278783] text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Counties */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Counties</h4>
          <select
            value={filters.county || ''}
            onChange={(e) => handleFilterChange('county', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#278783] transition-colors"
          >
            <option value="">All Counties</option>
            {counties.map((county) => (
              <option key={county.id} value={county.name}>
                {county.name}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-1">
              Min Price (KSH)
            </label>
            <input
              id="minPrice"
              type="number"
              placeholder="Min Price"
              value={filters.minPrice || ''}
              onChange={(e) => handleFilterChange('minPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#278783] transition-colors"
            />
          </div>
          <div>
            <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-1">
              Max Price (KSH)
            </label>
            <input
              id="maxPrice"
              type="number"
              placeholder="Max Price"
              value={filters.maxPrice || ''}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#278783] transition-colors"
            />
          </div>
        </div>

        {/* Quality Rating */}
        <div>
          <label htmlFor="qualityRating" className="block text-sm font-medium text-gray-700 mb-1">
            Min Quality Rating
          </label>
          <select
            id="qualityRating"
            value={filters.qualityRating || ''}
            onChange={(e) => handleFilterChange('qualityRating', e.target.value ? parseFloat(e.target.value) : undefined)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#278783] transition-colors"
          >
            <option value="">Any Rating</option>
            <option value="4.0">4.0+</option>
            <option value="4.5">4.5+</option>
            <option value="4.8">4.8+</option>
          </select>
        </div>
      </div>
    </div>
  );
}