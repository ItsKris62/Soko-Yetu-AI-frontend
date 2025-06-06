// src/app/community/post/[postId]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { fetchForumPostById, fetchForumReplies, createForumReply, upvotePost } from '@/utils/api';
import { ForumPost, ForumReply } from '@/types/api';
import useAuthStore from '@/stores/authStore';

interface PostDetailPageProps {
  params: { postId: string };
}

export default function PostDetailPage({ params }: PostDetailPageProps) {
  const { postId } = params;
  const { isAuthenticated, user } = useAuthStore();
  const [post, setPost] = useState<ForumPost | null>(null);
  const [replies, setReplies] = useState<ForumReply[]>([]);
  const [totalReplies, setTotalReplies] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [newReply, setNewReply] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [upvoteCount, setUpvoteCount] = useState<number>(0);

  const loadPost = async () => {
    setLoading(true);
    setError(null);
    try {
      const postData = await fetchForumPostById(postId);
      setPost(postData);
      setUpvoteCount(postData.upvote_count);
    } catch (err) {
      setError('Failed to load post.');
    } finally {
      setLoading(false);
    }
  };

  const loadReplies = async (newPage: number, reset: boolean = false) => {
    setLoading(true);
    setError(null);
    try {
      const { replies: fetchedReplies, total: fetchedTotal } = await fetchForumReplies(postId, newPage, limit);
      setReplies((prev) => (reset ? fetchedReplies : [...prev, ...fetchedReplies]));
      setTotalReplies(fetchedTotal);
    } catch (err) {
      setError('Failed to load replies.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPost();
    loadReplies(1, true);
  }, [postId]);

  const handleLoadMoreReplies = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadReplies(nextPage);
  };

  const handleCreateReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReply.trim()) return;
    setSuccessMessage(null);
    setError(null);
    try {
      const createdReply = await createForumReply(postId, newReply);
      setReplies((prev) => [...prev, createdReply]);
      setNewReply('');
      setSuccessMessage('Reply added successfully!');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleUpvote = async () => {
    if (!isAuthenticated) {
      setError('Please log in to upvote.');
      return;
    }
    setError(null);
    try {
      const { upvote_count } = await upvotePost(postId);
      setUpvoteCount(upvote_count);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (!post) {
    return (
      <section className="py-12 px-6 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          {loading ? <div>Loading...</div> : <div>{error || 'Post not found.'}</div>}
        </div>
      </section>
    );
  }

  return (
    <>
      <Head>
        <title>{post.title} - Community Forum</title>
        <meta name="description" content={post.content.slice(0, 160)} />
      </Head>
      <section className="py-12 px-6 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <Link href="/community" className="text-[#278783] hover:underline mb-4 block">
            ← Back to Community
          </Link>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{post.title}</h1>
            <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
              <span>
                By {post.first_name} {post.last_name} • {new Date(post.created_at).toLocaleDateString()}
              </span>
              <span className="bg-[#278783] text-white px-2 py-1 rounded-full">{post.category}</span>
            </div>
            <p className="text-gray-700 mb-4">{post.content}</p>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <button
                onClick={handleUpvote}
                className="flex items-center space-x-1 hover:text-[#278783] transition-colors"
                disabled={!isAuthenticated}
              >
                <span>👍</span>
                <span>{upvoteCount}</span>
              </button>
              {error && <span className="text-red-500 text-xs">{error}</span>}
            </div>
          </div>

          {/* Replies Section */}
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Replies ({totalReplies})</h2>
          {replies.length === 0 && !loading && !error && (
            <div className="text-gray-600 mb-4">No replies yet. Be the first to reply!</div>
          )}
          {replies.map((reply) => (
            <div key={reply.id} className="bg-white rounded-lg shadow-md p-4 mb-4">
              <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
                <span>
                  By {reply.first_name} {reply.last_name} • {new Date(reply.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700">{reply.content}</p>
            </div>
          ))}

          {replies.length < totalReplies && !loading && !error && (
            <div className="mt-4 text-center">
              <button
                onClick={handleLoadMoreReplies}
                className="px-6 py-2 bg-[#278783] text-white rounded-lg hover:bg-[#1f6b67] transition-colors"
              >
                Load More Replies
              </button>
            </div>
          )}

          {/* Reply Form */}
          {isAuthenticated ? (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Add a Reply</h3>
              {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}
              {error && <div className="text-red-500 mb-4">{error}</div>}
              <form onSubmit={handleCreateReply}>
                <textarea
                  value={newReply}
                  onChange={(e) => setNewReply(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#278783] mb-4"
                  rows={3}
                  placeholder="Write your reply..."
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#278783] text-white rounded-lg hover:bg-[#1f6b67] transition-colors"
                >
                  Submit Reply
                </button>
              </form>
            </div>
          ) : (
            <div className="mt-6">
              <Link href="/auth/login" className="text-[#278783] hover:underline">
                Log in to add a reply
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}