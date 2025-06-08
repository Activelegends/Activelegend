import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { commentService } from '../services/commentService';
import type { Comment, CommentState } from '../types/comment';
import { formatDate } from '../utils/date';

interface CommentsProps {
  gameId: string;
}

export const Comments: React.FC<CommentsProps> = ({ gameId }) => {
  const { user } = useAuth();
  const [state, setState] = useState<CommentState>({
    comments: [],
    loading: true,
    error: null,
    submitting: false
  });
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    loadComments();
    const subscription = commentService.subscribeToComments(gameId, handleRealtimeUpdate);
    return () => {
      subscription.unsubscribe();
    };
  }, [gameId]);

  const loadComments = async () => {
    try {
      const comments = await commentService.getComments(gameId);
      setState(prev => ({ ...prev, comments, loading: false }));
    } catch (error) {
      setState(prev => ({ ...prev, error: 'خطا در بارگذاری نظرات', loading: false }));
    }
  };

  const handleRealtimeUpdate = (payload: any) => {
    if (payload.eventType === 'INSERT') {
      setState(prev => ({
        ...prev,
        comments: [payload.new, ...prev.comments]
      }));
    } else if (payload.eventType === 'UPDATE') {
      setState(prev => ({
        ...prev,
        comments: prev.comments.map(comment =>
          comment.id === payload.new.id ? payload.new : comment
        )
      }));
    } else if (payload.eventType === 'DELETE') {
      setState(prev => ({
        ...prev,
        comments: prev.comments.filter(comment => comment.id !== payload.old.id)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || newComment.length < 5 || newComment.length > 500) return;

    setState(prev => ({ ...prev, submitting: true }));
    try {
      await commentService.addComment({
        content: newComment,
        game_id: gameId
      });
      setNewComment('');
    } catch (error) {
      setState(prev => ({ ...prev, error: 'خطا در ارسال نظر' }));
    } finally {
      setState(prev => ({ ...prev, submitting: false }));
    }
  };

  const handleLike = async (commentId: string) => {
    if (!user) return;
    try {
      await commentService.toggleLike(commentId);
    } catch (error) {
      setState(prev => ({ ...prev, error: 'خطا در ثبت لایک' }));
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!user || user.email !== 'active.legendss@gmail.com') return;
    try {
      await commentService.deleteComment(commentId);
    } catch (error) {
      setState(prev => ({ ...prev, error: 'خطا در حذف نظر' }));
    }
  };

  const handleHide = async (commentId: string) => {
    if (!user || user.email !== 'active.legendss@gmail.com') return;
    try {
      await commentService.hideComment(commentId);
    } catch (error) {
      setState(prev => ({ ...prev, error: 'خطا در مخفی کردن نظر' }));
    }
  };

  const handleApprove = async (commentId: string) => {
    if (!user || user.email !== 'active.legendss@gmail.com') return;
    try {
      await commentService.approveComment(commentId);
    } catch (error) {
      setState(prev => ({ ...prev, error: 'خطا در تایید نظر' }));
    }
  };

  if (state.loading) {
    return <div className="text-center p-4">در حال بارگذاری نظرات...</div>;
  }

  return (
    <div className="comments-section mt-8 bg-gray-50 p-6 rounded-lg">
      <h3 className="text-xl font-bold mb-4 text-gray-800">نظرات</h3>
      
      {user ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="نظر خود را بنویسید..."
            className="w-full p-3 border rounded-lg mb-2 font-vazirmatn bg-white text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-[#F4B744] focus:border-transparent"
            rows={3}
            minLength={5}
            maxLength={500}
          />
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {newComment.length}/500 کاراکتر
            </span>
            <button
              type="submit"
              disabled={state.submitting || newComment.length < 5}
              className="bg-[#F4B744] text-white px-4 py-2 rounded-lg hover:bg-[#e5a93d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ارسال نظر
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center p-4 bg-white rounded-lg mb-6 text-gray-700">
          برای ارسال نظر لطفاً وارد شوید.
        </div>
      )}

      <AnimatePresence>
        {state.comments.map((comment) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-gray-100"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center">
                <img
                  src={comment.user?.avatar_url || '/default-avatar.png'}
                  alt={comment.user?.display_name}
                  className="w-8 h-8 rounded-full mr-2"
                />
                <div>
                  <div className="font-bold text-gray-800">{comment.user?.display_name}</div>
                  <div className="text-sm text-gray-500">
                    {formatDate(comment.created_at)}
                  </div>
                </div>
              </div>
              {user?.email === 'active.legendss@gmail.com' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    حذف
                  </button>
                  <button
                    onClick={() => handleHide(comment.id)}
                    className="text-yellow-500 hover:text-yellow-700"
                  >
                    مخفی
                  </button>
                  {!comment.is_approved && (
                    <button
                      onClick={() => handleApprove(comment.id)}
                      className="text-green-500 hover:text-green-700"
                    >
                      تایید
                    </button>
                  )}
                </div>
              )}
            </div>
            <p className="text-gray-700 mb-2 whitespace-pre-wrap">{comment.content}</p>
            <button
              onClick={() => handleLike(comment.id)}
              disabled={!user}
              className="flex items-center text-gray-500 hover:text-[#F4B744] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                className="w-5 h-5 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              {comment.likes_count}
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      {state.error && (
        <div className="text-red-500 text-center p-4 bg-red-50 rounded-lg">{state.error}</div>
      )}

      {state.loading && (
        <div className="text-center p-4 text-gray-600">در حال بارگذاری نظرات...</div>
      )}
    </div>
  );
}; 