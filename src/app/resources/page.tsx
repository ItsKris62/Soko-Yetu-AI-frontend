'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Search, Filter, Clock, Tag } from 'lucide-react';
import ResourceCard from '@/components/resources/ResourceCard';
import { fetchResources } from '@/utils/api';
import { Resource } from '@/types/api';
import useAuthStore from '@/stores/authStore';

export default function ResourcesPage() {
  const { user } = useAuthStore();
  const [resources, setResources] = useState<Resource[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(6);
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadResources = async (newPage: number, reset: boolean = false) => {
    setLoading(true);
    setError(null);
    try {
      const { resources: fetchedResources, total: fetchedTotal } = await fetchResources(
        newPage, 
        limit, 
        typeFilter || undefined
      );
      setResources((prev) => (reset ? fetchedResources : [...prev, ...fetchedResources]));
      setTotal(fetchedTotal);
    } catch (err) {
      console.error(err);
      setError('Failed to load resources. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    loadResources(1, true); // Reset resources on filter change
  }, [typeFilter]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadResources(nextPage);
  };

  // Client-side search filtering (for loaded resources)
  const filteredResources = resources.filter(resource => {
    const matchesSearch = !searchQuery || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const resourceCounts = {
    total: total,
    articles: resources.filter(r => r.type === 'article').length,
    videos: resources.filter(r => r.type === 'video').length,
    pdfs: resources.filter(r => r.type === 'pdf').length
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setTypeFilter('');
  };

  return (
    <>
      <Head>
        <title>Agricultural Resources for Farmers and Buyers</title>
        <meta name="description" content="Access articles, videos, and guides to improve your farming practices and market insights." />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#278783] via-[#2a9d97] to-[#278783] text-white">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-100 bg-clip-text text-transparent slide-up">
                Agricultural Resources
              </h1>
              <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto slide-up">
                Discover expert insights, practical guides, and cutting-edge techniques to enhance your farming practices and market knowledge
              </p>
              
              {/* Resource Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-2xl font-bold">{resourceCounts.total}</div>
                  <div className="text-sm text-green-100">Total Resources</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-2xl font-bold">{resourceCounts.articles}</div>
                  <div className="text-sm text-green-100">Articles</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-2xl font-bold">{resourceCounts.videos}</div>
                  <div className="text-sm text-green-100">Videos</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-2xl font-bold">{resourceCounts.pdfs}</div>
                  <div className="text-sm text-green-100">Guides</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Search and Filter Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search resources by title, description, or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#278783] focus:border-transparent transition-all"
                />
              </div>

              {/* Filter Dropdown */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  title="Resource Type Filter"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#278783] focus:border-transparent transition-all appearance-none bg-white min-w-[160px]"
                >
                  <option value="">All Types</option>
                  <option value="article">Articles</option>
                  <option value="video">Videos</option>
                  <option value="pdf">PDF Guides</option>
                </select>
              </div>
            </div>

            {/* Active Filters */}
            {(typeFilter || searchQuery) && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                <span className="text-sm text-gray-600">Active filters:</span>
                {typeFilter && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-[#278783] text-white">
                    Type: {typeFilter}
                    <button
                      onClick={() => setTypeFilter('')}
                      className="ml-2 hover:bg-white/20 rounded-full p-0.5"
                    >
                      ×
                    </button>
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                    Search: &quot;{searchQuery}&quot;
                    <button
                      onClick={() => setSearchQuery('')}
                      className="ml-2 hover:bg-blue-200 rounded-full p-0.5"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Results Info */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">
              Showing <span className="font-semibold text-gray-900">{filteredResources.length}</span> of <span className="font-semibold text-gray-900">{total}</span> resources
            </p>
          </div>

          {/* Error State */}
          {error && (
            <div className="text-center py-8">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-red-600">{error}</p>
                <button
                  onClick={() => loadResources(1, true)}
                  className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && resources.length === 0 && (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#278783]"></div>
              <span className="ml-3 text-gray-600">Loading resources...</span>
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredResources.length === 0 && !error && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
              <p className="text-gray-600 mb-4">
                {searchQuery || typeFilter 
                  ? "Try adjusting your search criteria or filters" 
                  : "No resources are available at the moment"
                }
              </p>
              {(searchQuery || typeFilter) && (
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-2 bg-[#278783] text-white rounded-lg hover:bg-[#1f6b67] transition-colors"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}

          {/* Resources Grid */}
          {filteredResources.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {filteredResources.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>

              {/* Load More Button */}
              {resources.length < total && !loading && (
                <div className="text-center">
                  <button 
                    onClick={handleLoadMore}
                    className="px-8 py-3 bg-white border-2 border-[#278783] text-[#278783] rounded-xl hover:bg-[#278783] hover:text-white transition-all duration-200 font-medium"
                  >
                    Load More Resources
                  </button>
                </div>
              )}

              {/* Loading More Indicator */}
              {loading && resources.length > 0 && (
                <div className="text-center mt-8">
                  <div className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-lg">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#278783] mr-2"></div>
                    <span className="text-gray-600">Loading more...</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}