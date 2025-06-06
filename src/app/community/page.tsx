// src/app/community/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import ForumPostCard from '@/components/community/ForumPostCard';
import { fetchForumPosts, createForumPost } from '@/utils/api';
import { ForumPost } from '@/types/api';
import useAuthStore from '@/stores/authStore';
import { useDebounce } from '@/hooks/useDebounce';

export default function CommunityPage() {
  const { isAuthenticated, user } = useAuthStore();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newPost, setNewPost] = useState<{ title: string; content: string; category: string }>({
    title: '',
    content: '',
    category: '',
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadPosts = async (newPage: number, reset: boolean = false) => {
    setLoading(true);
    setError(null);
    try {
      const { posts: fetchedPosts, total: fetchedTotal } = await fetchForumPosts(
        newPage,
        limit,
        categoryFilter,
        debouncedSearchQuery
      );
      setPosts((prev) => (reset ? fetchedPosts : [...prev, ...fetchedPosts]));
      setTotal(fetchedTotal);
    } catch (err) {
      setError('Failed to load posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    loadPosts(1, true); // Reset posts on filter or search change
  }, [categoryFilter, debouncedSearchQuery]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadPosts(nextPage);
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setError(null);
    try {
      const createdPost = await createForumPost(newPost);
      setPosts((prev) => [createdPost, ...prev]);
      setShowCreateModal(false);
      setNewPost({ title: '', content: '', category: '' });
      setSuccessMessage('Post created successfully!');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleUpvoteSuccess = (postId: string, newUpvoteCount: number) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, upvote_count: newUpvoteCount } : post
      )
    );
  };

  return (
    <>
      <Head>
        <title>Community Forum - Share Farming Tips and Market Insights</title>
        <meta name="description" content="Join our community to share knowledge, ask questions, and discuss farming and market trends." />
      </Head>
      <section className="py-12 px-6 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 slide-up">Community Forum</h1>
          <p className="text-lg text-gray-600 mb-8 slide-up">
            Share knowledge, ask questions, and connect with other farmers and buyers.
          </p>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="w-full sm:w-1/2">
              <input
                type="text"
                placeholder="Search posts (e.g., maize farming)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#278783] transition-colors"
              />
            </div>
            <div className="flex space-x-4">
              <div>
                <label htmlFor="categoryFilter" className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Category
                </label>
                <select
                  id="categoryFilter"
                  value={categoryFilter || ''}
                  onChange={(e) => setCategoryFilter(e.target.value || undefined)}
                  className="w-full sm:w-48 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#278783] transition-colors"
                >
                  <option value="">All Categories</option>
                  <option value="Farming Tips">Farming Tips</option>
                  <option value="Market Insights">Market Insights</option>
                  <option value="Platform Support">Platform Support</option>
                  <option value="General Discussion">General Discussion</option>
                </select>
              </div>
              {isAuthenticated ? (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-6 py-2 bg-[#278783] text-white rounded-lg hover:bg-[#1f6b67] transition-colors self-end"
                >
                  Create Post
                </button>
              ) : (
                <Link href="/auth/login">
                  <span className="text-[#278783] hover:underline self-end">
                    Log in to create a post
                  </span>
                </Link>
              )}
            </div>
          </div>

          {/* Success/Error Messages */}
          {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}
          {error && <div className="text-red-500 mb-4">{error}</div>}

          {/* Posts List */}
          {posts.length === 0 && !loading && !error && (
            <div className="text-center text-gray-600">No posts found.</div>
          )}
          {posts.map((post) => (
            <ForumPostCard key={post.id} post={post} onUpvoteSuccess={handleUpvoteSuccess} />
          ))}

          {/* Load More Button */}
          {posts.length < total && !loading && !error && (
            <div className="mt-8 text-center">
              <button
                onClick={handleLoadMore}
                className="px-6 py-3 bg-[#278783] text-white rounded-lg hover:bg-[#1f6b67] transition-colors"
              >
                Load More
              </button>
            </div>
          )}

          {loading && (
            <div className="text-center mt-8">
              <span className="text-gray-600">Loading...</span>
            </div>
          )}
        </div>

        {/* Create Post Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Create a New Post</h2>
              <form onSubmit={handleCreatePost}>
                <div className="mb-4">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#278783]"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                    Content
                  </label>
                  <textarea
                    id="content"
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#278783]"
                    rows={4}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    id="category"
                    value={newPost.category}
                    onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#278783]"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="Farming Tips">Farming Tips</option>
                    <option value="Market Insights">Market Insights</option>
                    <option value="Platform Support">Platform Support</option>
                    <option value="General Discussion">General Discussion</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#278783] text-white rounded-lg hover:bg-[#1f6b67] transition-colors"
                  >
                    Create Post
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>
    </>
  );
}