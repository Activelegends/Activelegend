import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { commentService } from '../services/commentService';
import type { Comment, CommentFormData } from '../types/comments';

interface CommentsProps {
  gameId: string;
}

export const Comments: React.FC<CommentsProps> = ({ gameId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [showReplies, setShowReplies] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);

  const isAdmin = user?.email === 'active.legendss@gmail.com';

  useEffect(() => {
    loadComments();
    const subscription = commentService.subscribeToComments(gameId, handleCommentChange);
    return () => {
      subscription.unsubscribe();
    };
  }, [gameId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await commentService.getComments(gameId);
      setComments(data);
    } catch (err) {
      console.error('Error loading comments:', err);
      setError('خطا در بارگذاری نظرات. لطفاً صفحه را رفرش کنید.');
    } finally {
      setLoading(false);
    }
  };

  const handleCommentChange = async (payload: any) => {
    try {
      if (payload.eventType === 'INSERT') {
        const newComments = await commentService.getComments(gameId);
        setComments(newComments);
      } else if (payload.eventType === 'UPDATE') {
        const updatedComments = comments.map(comment =>
          comment.id === payload.new.id ? { ...comment, ...payload.new } : comment
        );
        setComments(updatedComments);
      } else if (payload.eventType === 'DELETE') {
        setComments(comments.filter(comment => comment.id !== payload.old.id));
      }
    } catch (err) {
      console.error('Error handling comment change:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim() || newComment.length < 5 || submitting) return;

    try {
      setSubmitting(true);
      setError(null);
      const commentData: CommentFormData = {
        content: newComment.trim(),
        game_id: gameId,
        parent_comment_id: replyingTo || undefined,
      };

      await commentService.addComment(commentData);
      setNewComment('');
      setReplyingTo(null);
      await loadComments();
    } catch (err) {
      console.error('Error submitting comment:', err);
      setError('خطا در ارسال نظر. لطفاً دوباره تلاش کنید.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (commentId: string) => {
    if (!user) return;
    try {
      await commentService.toggleLike(commentId, user.id);
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const handleToggleReplies = (commentId: string) => {
    setShowReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const handleAdminAction = async (
    action: 'pin' | 'approve' | 'delete',
    commentId: string
  ) => {
    if (!isAdmin) return;

    try {
      switch (action) {
        case 'pin':
          await commentService.togglePin(commentId);
          break;
        case 'approve':
          await commentService.toggleApproval(commentId);
          break;
        case 'delete':
          if (window.confirm('آیا از حذف این نظر اطمینان دارید؟')) {
            await commentService.deleteComment(commentId);
          }
          break;
      }
      await loadComments();
    } catch (err) {
      console.error('Error performing admin action:', err);
      setError('خطا در انجام عملیات. لطفاً دوباره تلاش کنید.');
    }
  };

  const renderComment = (comment: Comment, isReply = false) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`bg-gray-800 rounded-lg p-4 mb-4 ${isReply ? 'mr-8' : ''}`}
    >
      <div className="flex items-start gap-4">
        <img
          src={comment.user?.profile_image_url || '/default-avatar.png'}
          alt={comment.user?.display_name}
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold">{comment.user?.display_name}</span>
            {comment.user?.is_special && (
              <span className="text-green-500">✔️</span>
            )}
            {comment.is_pinned && (
              <span className="text-yellow-500 text-sm">📌</span>
            )}
            <span className="text-gray-400 text-sm">
              {new Date(comment.created_at).toLocaleDateString('fa-IR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
          <p className="text-gray-200 mb-2">{comment.content}</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleLike(comment.id)}
              className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
            >
              <span>❤️</span>
              <span>{comment.likes_count}</span>
            </button>
            {!isReply && (
              <button
                onClick={() => setReplyingTo(comment.id)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                پاسخ
              </button>
            )}
            {isAdmin && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleAdminAction('pin', comment.id)}
                  className="text-gray-400 hover:text-yellow-500 transition-colors"
                >
                  {comment.is_pinned ? 'برداشتن پین' : 'پین کردن'}
                </button>
                <button
                  onClick={() => handleAdminAction('approve', comment.id)}
                  className="text-gray-400 hover:text-green-500 transition-colors"
                >
                  {comment.is_approved ? 'عدم تایید' : 'تایید'}
                </button>
                <button
                  onClick={() => handleAdminAction('delete', comment.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  حذف
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
        <p className="mt-2 text-gray-400">در حال بارگذاری نظرات...</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-6">نظرات</h3>
      
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-4 mb-6">
          {error}
        </div>
      )}
      
      {user ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={replyingTo ? 'پاسخ خود را بنویسید...' : 'نظر خود را بنویسید...'}
            className="w-full bg-gray-800 text-white rounded-lg p-4 mb-2 resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
            rows={3}
            minLength={5}
            maxLength={500}
            disabled={submitting}
          />
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">
              {newComment.length}/500 کاراکتر
            </span>
            <div className="flex gap-2">
              {replyingTo && (
                <button
                  type="button"
                  onClick={() => setReplyingTo(null)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                  disabled={submitting}
                >
                  انصراف
                </button>
              )}
              <button
                type="submit"
                disabled={!newComment.trim() || newComment.length < 5 || submitting}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'در حال ارسال...' : 'ارسال نظر'}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="text-center py-4 text-gray-400 bg-gray-800/50 rounded-lg mb-8">
          برای ارسال نظر لطفاً وارد شوید.
        </div>
      )}

      <AnimatePresence>
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            هنوز نظری ثبت نشده است. اولین نظر را شما ثبت کنید!
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id}>
              {renderComment(comment)}
              {comment.replies && comment.replies.length > 0 && (
                <div className="mr-8">
                  {comment.replies.map((reply) => renderComment(reply, true))}
                </div>
              )}
            </div>
          ))
        )}
      </AnimatePresence>
    </div>
  );
}; 