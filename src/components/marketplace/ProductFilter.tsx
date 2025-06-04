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
  const [filteredCounties, setFilteredCounties] = useState<County[]>([]);
  const [filters, setFilters] = useState<FilterParams>({});
  const [searchInput, setSearchInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const debouncedSearchQuery = useDebounce(searchInput, 500);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setLoading(true);
      setError(null);
       setIsDataFetched(true);

      try {
        const [fetchedCategories, fetchedCountries, fetchedCounties] = await Promise.all([
          fetchCategories(),
          fetchCountries(),
          fetchCounties(),
        ]);

        if (isMounted) {
          setCategories(fetchedCategories);
          setCountries(fetchedCountries);
          const convertedCounties = fetchedCounties.map((county: { id: number; name: string; country_id?: number }) => ({
            ...county,
            country_id: county.country_id?.toString(),
          }));
          setCounties(convertedCounties);
          setFilteredCounties(convertedCounties);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Failed to load filter data:', err);
          setError('Failed to load filter data. Please try again later.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    if (isDataFetched) return; // Check if data has already been fetched
    loadData();

    return () => {
      isMounted = false;
    };
  }, [isDataFetched]);

  useEffect(() => {
    handleFilterChange('searchQuery', debouncedSearchQuery);
  }, [debouncedSearchQuery]);

  const handleFilterChange = (key: keyof FilterParams, value: string | number | undefined) => {
    const newFilters = { ...filters, [key]: value };
    if (!value || value === '') {
      delete newFilters[key];
    }

    if (key === 'country_id') {
      if (value) {
        const filtered = counties.filter((county) => county.country_id === value);
        setFilteredCounties(filtered);
      } else {
        setFilteredCounties(counties);
      }
      delete newFilters['county_id'];
    }

    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    setFilters({});
    setSearchInput('');
    setFilteredCounties(counties);
    onFilterChange({});
  };

  const activeFiltersCount = Object.keys(filters).length - (filters.searchQuery ? 1 : 0);

  if (loading) {
    return (
      <div className="mb-6 p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent"></div>
          <span className="text-sm font-siptext text-gray-600">Loading filters...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-6 p-4 bg-red-50 rounded-2xl border border-red-200">
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-siptext text-red-700">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header Section - Always Visible */}
      <div className="p-4 sm:p-6 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              id="searchQuery"
              type="text"
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 font-siptext text-sm placeholder-gray-400"
            />
          </div>

          {/* Filter Toggle & Clear */}
          <div className="flex items-center space-x-3">
            {activeFiltersCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-sm font-siptext text-gray-500 hover:text-red-500 transition-colors duration-200 flex items-center space-x-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Clear all</span>
              </button>
            )}
            
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center space-x-2 px-4 py-2.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl transition-all duration-300 font-siptext text-sm font-medium"
            >
              <svg className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
              </svg>
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full min-w-[20px] h-5 flex items-center justify-center font-medium">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Active Filters Pills */}
        {activeFiltersCount > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {filters.category && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium font-siptext bg-secondary text-primary">
                Category: {filters.category}
                <button aria-label="Clear category filter" onClick={() => handleFilterChange('category', undefined)} className="ml-2 hover:text-primary/70">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            {(filters.minPrice || filters.maxPrice) && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium font-siptext bg-secondary text-primary">
                Price: {filters.minPrice || 0} - {filters.maxPrice || '∞'} KSH
                <button title="Clear price filters" onClick={() => { handleFilterChange('minPrice', undefined); handleFilterChange('maxPrice', undefined); }} className="ml-2 hover:text-primary/70">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Expandable Filter Section */}
      <div className={`transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
        <div className="p-4 sm:p-6 space-y-6">
          {/* Categories */}
          <div>
            <h4 className="text-sm font-medium font-leonetta text-gray-800 mb-3 flex items-center">
              <svg className="w-4 h-4 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Categories
            </h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleFilterChange('category', undefined)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium font-siptext transition-all duration-300 ${
                  !filters.category
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleFilterChange('category', category.name)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium font-siptext transition-all duration-300 ${
                    filters.category === category.name
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Location & Price Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Location Section */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium font-leonetta text-gray-800 flex items-center">
                <svg className="w-4 h-4 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                Location
              </h4>
              
              <div className="space-y-3">
                <select
                  aria-label="Countries"
                  value={filters.country_id || ''}
                  onChange={(e) => handleFilterChange('country_id', e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 font-siptext bg-white"
                >
                  <option value="">All Countries</option>
                  {countries.map((country) => (
                    <option key={country.id} value={country.id}>
                      {country.name}
                    </option>
                  ))}
                </select>

                <select
                  title="Counties"
                  value={filters.county_id || ''}
                  onChange={(e) => handleFilterChange('county_id', e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 font-siptext bg-white disabled:bg-gray-50 disabled:text-gray-400"
                  disabled={!filters.country_id}
                >
                  <option value="">All Counties</option>
                  {filteredCounties.map((county) => (
                    <option key={county.id} value={county.id}>
                      {county.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price & Quality Section */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium font-leonetta text-gray-800 flex items-center">
                <svg className="w-4 h-4 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                Price & Quality
              </h4>
              
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    id="minPrice"
                    type="number"
                    placeholder="Min (KSH)"
                    value={filters.minPrice || ''}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 font-siptext placeholder-gray-400"
                  />
                  <input
                    id="maxPrice"
                    type="number"
                    placeholder="Max (KSH)"
                    value={filters.maxPrice || ''}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 font-siptext placeholder-gray-400"
                  />
                </div>

                <select
                  id="qualityRating"
                  aria-label="Quality Rating"
                  value={filters.qualityRating || ''}
                  onChange={(e) => handleFilterChange('qualityRating', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 font-siptext bg-white"
                >
                  <option value="">Any Quality Rating</option>
                  <option value="4.0">⭐ 4.0+ Stars</option>
                  <option value="4.5">⭐ 4.5+ Stars</option>
                  <option value="4.8">⭐ 4.8+ Premium</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}