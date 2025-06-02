'use client';

import { useState, useEffect } from 'react';
import { fetchCategories, fetchCountries, fetchCounties } from '../../utils/api';
import { FilterParams } from '../../types/api';
import { useDebounce } from '../../hooks/useDebounce';

interface ProductFilterProps {
  onFilterChange: (filters: FilterParams) => void;
}

interface Category {
  id: string;
  name: string;
}

interface Country {
  id: number;
  name: string;
}

interface County {
  id: number;
  name: string;
  country_id?: string;
}

export default function ProductFilter({ onFilterChange }: ProductFilterProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [counties, setCounties] = useState<County[]>([]);
  const [filteredCounties, setFilteredCounties] = useState<County[]>([]); // Counties filtered by selected country
  const [filters, setFilters] = useState<FilterParams>({});
  const [searchInput, setSearchInput] = useState<string>('');
  const debouncedSearchQuery = useDebounce(searchInput, 500);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [fetchedCategories, fetchedCountries, fetchedCounties] = await Promise.all([
          fetchCategories(),
          fetchCountries(),
          fetchCounties(),
        ]);
        setCategories(fetchedCategories);
        setCountries(fetchedCountries);
        const convertedCounties = fetchedCounties.map((county: { id: number; name: string; country_id?: number }) => ({
          ...county,
          country_id: county.country_id?.toString(),
        }));
        setCounties(convertedCounties);
        setFilteredCounties(convertedCounties); // Initially, show all counties
      } catch (err) {
        console.error('Failed to load filter data:', err);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    handleFilterChange('searchQuery', debouncedSearchQuery);
  }, [debouncedSearchQuery]);

  const handleFilterChange = (key: keyof FilterParams, value: string | number | undefined) => {
    const newFilters = { ...filters, [key]: value };
    if (!value || value === '') {
      delete newFilters[key];
    }

    // If country changes, reset the county filter and filter the counties
    if (key === 'country_id') {
      if (value) {
        const filtered = counties.filter((county) => county.country_id === value);
        setFilteredCounties(filtered);
      } else {
        setFilteredCounties(counties); // Show all counties if no country is selected
      }
      // Reset county filter when country changes
      delete newFilters['county_id'];
    }

    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="mb-8 p-6 bg-white rounded-xl shadow-lg">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Filter Products</h3>
      <div className="space-y-6">
        {/* Search Bar */}
        <div>
          <label htmlFor="searchQuery" className="block text-sm font-medium text-gray-700 mb-2">
            Search Products
          </label>
          <input
            id="searchQuery"
            type="text"
            placeholder="Search by name or description..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#产278783] transition-colors duration-300"
          />
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Categories</h4>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleFilterChange('category', undefined)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                !filters.category
                  ? 'bg-[#278783] text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleFilterChange('category', category.name)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
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

        {/* Countries */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Countries</h4>
          <select
            aria-label="Countries"
            value={filters.country_id || ''}
            onChange={(e) => handleFilterChange('country_id', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#278783] transition-colors duration-300"
          >
            <option value="">All Countries</option>
            {countries.map((country) => (
              <option key={country.id} value={country.id}>
                {country.name}
              </option>
            ))}
          </select>
        </div>

        {/* Counties */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Counties</h4>
          <select
            title="Counties"
            value={filters.county_id || ''}
            onChange={(e) => handleFilterChange('county_id', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#278783] transition-colors duration-300"
            disabled={!filters.country_id} // Disable until a country is selected
          >
            <option value="">All Counties</option>
            {filteredCounties.map((county) => (
              <option key={county.id} value={county.id}>
                {county.name}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-2">
              Min Price (KSH)
            </label>
            <input
              id="minPrice"
              type="number"
              placeholder="Min Price"
              value={filters.minPrice || ''}
              onChange={(e) => handleFilterChange('minPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#278783] transition-colors duration-300"
            />
          </div>
          <div>
            <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-2">
              Max Price (KSH)
            </label>
            <input
              id="maxPrice"
              type="number"
              placeholder="Max Price"
              value={filters.maxPrice || ''}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#278783] transition-colors duration-300"
            />
          </div>
        </div>

        {/* Quality Rating */}
        <div>
          <label htmlFor="qualityRating" className="block text-sm font-medium text-gray-700 mb-2">
            Min Quality Rating
          </label>
          <select
            id="qualityRating"
            value={filters.qualityRating || ''}
            onChange={(e) => handleFilterChange('qualityRating', e.target.value ? parseFloat(e.target.value) : undefined)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#278783] transition-colors duration-300"
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