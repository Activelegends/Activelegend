import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { commentService } from '../services/commentService';
import type { Comment, CommentState } from '../types/comment';
import { formatDate } from '../utils/date';
import { formatDistanceToNow } from 'date-fns';
import { faThumbsUp, faTrash, faEyeSlash, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
      setState(prev => ({ ...prev, loading: true, error: null }));
      const comments = await commentService.getComments(gameId);
      setState(prev => ({ ...prev, comments, loading: false }));
    } catch (error) {
      console.error('Error loading comments:', error);
      setState(prev => ({
        ...prev,
        error: 'خطا در بارگذاری نظرات. لطفاً صفحه را رفرش کنید.',
        loading: false
      }));
    }
  };

  const handleRealtimeUpdate = (payload: any) => {
    try {
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
    } catch (error) {
      console.error('Error handling realtime update:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || newComment.length < 5 || newComment.length > 500) return;

    try {
      setState(prev => ({ ...prev, submitting: true, error: null }));
      await commentService.addComment({
        content: newComment,
        game_id: gameId
      });
      setNewComment('');
    } catch (error) {
      console.error('Error submitting comment:', error);
      setState(prev => ({
        ...prev,
        error: 'خطا در ارسال نظر. لطفاً دوباره تلاش کنید.'
      }));
    } finally {
      setState(prev => ({ ...prev, submitting: false }));
    }
  };

  const handleLike = async (commentId: string) => {
    if (!user) return;
    try {
      await commentService.toggleLike(commentId);
      await loadComments();
    } catch (error) {
      console.error('Error toggling like:', error);
      setState(prev => ({
        ...prev,
        error: 'خطا در ثبت لایک. لطفاً دوباره تلاش کنید.'
      }));
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!user || user.email !== 'active.legendss@gmail.com') return;
    if (!window.confirm('آیا از حذف این نظر مطمئن هستید؟')) return;
    try {
      await commentService.deleteComment(commentId);
      setState(prev => ({
        ...prev,
        comments: prev.comments.filter(comment => comment.id !== commentId)
      }));
    } catch (error) {
      console.error('Error deleting comment:', error);
      setState(prev => ({
        ...prev,
        error: 'خطا در حذف نظر. لطفاً دوباره تلاش کنید.'
      }));
    }
  };

  const handleHide = async (commentId: string) => {
    if (!user || user.email !== 'active.legendss@gmail.com') return;
    try {
      await commentService.hideComment(commentId);
      setState(prev => ({
        ...prev,
        comments: prev.comments.filter(comment => comment.id !== commentId)
      }));
    } catch (error) {
      console.error('Error hiding comment:', error);
      setState(prev => ({
        ...prev,
        error: 'خطا در مخفی کردن نظر. لطفاً دوباره تلاش کنید.'
      }));
    }
  };

  const handleApprove = async (commentId: string) => {
    if (!user || user.email !== 'active.legendss@gmail.com') return;
    try {
      await commentService.approveComment(commentId);
      await loadComments();
    } catch (error) {
      console.error('Error approving comment:', error);
      setState(prev => ({
        ...prev,
        error: 'خطا در تایید نظر. لطفاً دوباره تلاش کنید.'
      }));
    }
  };

  if (state.loading) {
    return (
      <div className="comments-section mt-8 bg-gray-50 p-6 rounded-lg">
        <div className="text-center p-4 text-gray-600">در حال بارگذاری نظرات...</div>
      </div>
    );
  }

  return (
    <div className="comments-section mt-8 bg-gray-50 p-6 rounded-lg">
      <h3 className="text-xl font-bold mb-4 text-gray-800">نظرات</h3>
      
      {state.error && (
        <div className="text-red-500 text-center p-4 bg-red-50 rounded-lg mb-4">
          {state.error}
        </div>
      )}
      
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
              {state.submitting ? 'در حال ارسال...' : 'ارسال نظر'}
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
                  alt={comment.user?.display_name || 'کاربر'}
                  className="w-8 h-8 rounded-full mr-2"
                />
                <div>
                  <div className="font-bold text-gray-800">
                    {comment.user?.display_name || 'کاربر ناشناس'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                  </div>
                </div>
              </div>
              {user?.email === 'active.legendss@gmail.com' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                  <button
                    onClick={() => handleHide(comment.id)}
                    className="text-yellow-500 hover:text-yellow-700"
                  >
                    <FontAwesomeIcon icon={faEyeSlash} />
                  </button>
                  {!comment.is_approved && (
                    <button
                      onClick={() => handleApprove(comment.id)}
                      className="text-green-500 hover:text-green-700"
                    >
                      <FontAwesomeIcon icon={faCheck} />
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
              <FontAwesomeIcon icon={faThumbsUp} />
              {comment.likes_count}
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      {state.comments.length === 0 && !state.loading && (
        <div className="text-center p-4 text-gray-500">
          هنوز نظری ثبت نشده است. اولین نظر را شما ثبت کنید!
        </div>
      )}
    </div>
  );
}; 