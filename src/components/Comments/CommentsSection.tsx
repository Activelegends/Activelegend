import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { commentService } from '../../services/commentService';
import type { Comment, CommentState } from '../../types/comments';
import { CommentForm } from './CommentForm';
import { CommentCard } from './CommentCard';
import { formatDate } from '../../utils/date';

interface CommentsSectionProps {
  gameId: string;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({ gameId }) => {
  const { user } = useAuth();
  const [state, setState] = useState<CommentState>({
    comments: [],
    loading: true,
    error: null,
    submitting: false,
    submittingError: null,
  });

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
        comments: [payload.new, ...prev.comments],
      }));
    } else if (payload.eventType === 'UPDATE') {
      setState(prev => ({
        ...prev,
        comments: prev.comments.map(comment =>
          comment.id === payload.new.id ? payload.new : comment
        ),
      }));
    } else if (payload.eventType === 'DELETE') {
      setState(prev => ({
        ...prev,
        comments: prev.comments.filter(comment => comment.id !== payload.old.id),
      }));
    }
  };

  const handleSubmit = async (content: string, parentId?: string) => {
    if (!user) return;

    setState(prev => ({ ...prev, submitting: true, submittingError: null }));
    try {
      await commentService.addComment({
        content,
        game_id: gameId,
        parent_comment_id: parentId,
      });
      setState(prev => ({ ...prev, submitting: false }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        submitting: false,
        submittingError: 'خطا در ارسال نظر',
      }));
    }
  };

  const handleLike = async (commentId: string) => {
    if (!user) return;
    try {
      await commentService.toggleLike(commentId, user.id);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const renderComments = (comments: Comment[], parentId: string | null = null) => {
    return comments
      .filter(comment => comment.parent_comment_id === parentId)
      .map(comment => (
        <motion.div
          key={comment.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <CommentCard
            comment={comment}
            onLike={() => handleLike(comment.id)}
            onReply={(content) => handleSubmit(content, comment.id)}
            isAdmin={user?.email === 'active.legendss@gmail.com'}
          />
          {comment.parent_comment_id === null && (
            <div className="mr-8 mt-4 space-y-4">
              {renderComments(comments, comment.id)}
            </div>
          )}
        </motion.div>
      ));
  };

  if (state.loading) {
    return <div className="text-center py-8">در حال بارگذاری نظرات...</div>;
  }

  if (state.error) {
    return <div className="text-center text-red-500 py-8">{state.error}</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">نظرات</h2>
      
      {user ? (
        <CommentForm
          onSubmit={handleSubmit}
          submitting={state.submitting}
          error={state.submittingError}
        />
      ) : (
        <div className="text-center py-4 text-gray-600">
          برای ارسال نظر لطفاً وارد شوید.
        </div>
      )}

      <div className="space-y-6">
        <AnimatePresence>
          {renderComments(state.comments)}
        </AnimatePresence>
      </div>
    </div>
  );
}; 