import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { commentService } from '../services/commentService';
import type { Comment, CommentFormData } from '../types/comment';
import { useAuth } from '../contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { faThumbsUp, faTrash, faEyeSlash, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface CommentsProps {
  gameId: string;
}

export const Comments: React.FC<CommentsProps> = ({ gameId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadComments();

    const subscription = commentService.subscribeToComments(gameId, (payload) => {
      if (payload.eventType === 'INSERT') {
        setComments(prev => [payload.new as Comment, ...prev]);
      } else if (payload.eventType === 'DELETE') {
        setComments(prev => prev.filter(c => c.id !== payload.old.id));
      } else if (payload.eventType === 'UPDATE') {
        setComments(prev => prev.map(c => c.id === payload.new.id ? payload.new as Comment : c));
      }
    });

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
      setError('Failed to load comments. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    try {
      setSubmitting(true);
      setError(null);
      const commentData: CommentFormData = {
        content: newComment.trim(),
        game_id: gameId
      };

      const comment = await commentService.addComment(commentData);
      setComments(prev => [comment, ...prev]);
      setNewComment('');
    } catch (err) {
      console.error('Error submitting comment:', err);
      setError('Failed to submit comment. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (commentId: string) => {
    try {
      await commentService.toggleLike(commentId);
      await loadComments(); // Reload comments to get updated like count
    } catch (err) {
      console.error('Error toggling like:', err);
      setError('Failed to update like. Please try again later.');
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      await commentService.deleteComment(commentId);
      setComments(prev => prev.filter(c => c.id !== commentId));
    } catch (err) {
      console.error('Error deleting comment:', err);
      setError('Failed to delete comment. Please try again later.');
    }
  };

  const handleHide = async (commentId: string) => {
    try {
      await commentService.hideComment(commentId);
      setComments(prev => prev.filter(c => c.id !== commentId));
    } catch (err) {
      console.error('Error hiding comment:', err);
      setError('Failed to hide comment. Please try again later.');
    }
  };

  const handleApprove = async (commentId: string) => {
    try {
      await commentService.approveComment(commentId);
      await loadComments(); // Reload comments to get updated approval status
    } catch (err) {
      console.error('Error approving comment:', err);
      setError('Failed to approve comment. Please try again later.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {user && (
        <form onSubmit={handleSubmit} className="space-y-2">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            rows={3}
            disabled={submitting}
          />
          <button
            type="submit"
            disabled={!newComment.trim() || submitting}
            className={`px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors ${
              (!newComment.trim() || submitting) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      )}

      {comments.length === 0 ? (
        <div className="text-center text-gray-500 py-4">
          No comments yet. Be the first to comment!
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  {comment.user?.avatar_url ? (
                    <img
                      src={comment.user.avatar_url}
                      alt={comment.user.display_name}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500 text-sm">
                        {comment.user?.display_name?.[0]?.toUpperCase() || '?'}
                      </span>
                    </div>
                  )}
                  <div>
                    <div className="font-medium">{comment.user?.display_name || 'Anonymous'}</div>
                    <div className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                    </div>
                  </div>
                </div>
                {user && (user.id === comment.user_id || user.role === 'admin') && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleLike(comment.id)}
                      className="text-gray-500 hover:text-primary transition-colors"
                    >
                      <FontAwesomeIcon icon={faThumbsUp} /> {comment.likes_count}
                    </button>
                    {user.role === 'admin' && (
                      <>
                        <button
                          onClick={() => handleHide(comment.id)}
                          className="text-gray-500 hover:text-red-500 transition-colors"
                        >
                          <FontAwesomeIcon icon={faEyeSlash} />
                        </button>
                        {!comment.is_approved && (
                          <button
                            onClick={() => handleApprove(comment.id)}
                            className="text-gray-500 hover:text-green-500 transition-colors"
                          >
                            <FontAwesomeIcon icon={faCheck} />
                          </button>
                        )}
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="text-gray-500 hover:text-red-500 transition-colors"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                )}
              </div>
              <p className="mt-2 text-gray-700">{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 