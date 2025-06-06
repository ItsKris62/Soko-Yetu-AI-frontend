// src/components/community/ForumPostCard.tsx
import Link from 'next/link';
import { useState } from 'react';
import { ForumPost } from '@/types/api';
import useAuthStore from '@/stores/authStore';
import { upvotePost } from '@/utils/api';

interface ForumPostCardProps {
  post: ForumPost;
  onUpvoteSuccess?: (postId: string, newUpvoteCount: number) => void;
}

export default function ForumPostCard({ post, onUpvoteSuccess }: ForumPostCardProps) {
  const { isAuthenticated } = useAuthStore();
  const [upvoteCount, setUpvoteCount] = useState<number>(post.upvote_count);
  const [error, setError] = useState<string | null>(null);

  const handleUpvote = async () => {
    if (!isAuthenticated) {
      setError('Please log in to upvote.');
      return;
    }
    setError(null);
    try {
      const { upvote_count } = await upvotePost(post.id);
      setUpvoteCount(upvote_count);
      if (onUpvoteSuccess) {
        onUpvoteSuccess(post.id, upvote_count);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 mb-4">
      <Link href={`/community/post/${post.id}`}>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-[#278783] transition-colors">
            {post.title}
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-2">{post.content}</p>
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>
              By {post.first_name} {post.last_name} • {new Date(post.created_at).toLocaleDateString()}
            </span>
            <span className="bg-[#278783] text-white px-2 py-1 rounded-full">{post.category}</span>
          </div>
          <div className="mt-2 flex justify-between items-center text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleUpvote();
                }}
                className="flex items-center space-x-1 hover:text-[#278783] transition-colors"
                disabled={!isAuthenticated}
              >
                <span>👍</span>
                <span>{upvoteCount}</span>
              </button>
              {error && <span className="text-red-500 text-xs">{error}</span>}
            </div>
            <span>
              {post.reply_count} {post.reply_count === 1 ? 'Reply' : 'Replies'}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}