import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { commentService } from '../services/commentService';
import type { Comment, CommentFormData, LikeState } from '../types/comments';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ThumbsUp, Pin, MessageSquare, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface CommentsProps {
  gameId: string;
}

export default function Comments({ gameId }: CommentsProps) {
  const { user, session } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [showReplies, setShowReplies] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [likeStates, setLikeStates] = useState<Record<string, LikeState>>({});

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
      console.log('Loaded comments:', data);
      setComments(data);
      
      // Load like states for each comment
      if (session?.user?.id) {
        const likeStates: Record<string, LikeState> = {};
        for (const comment of data) {
          try {
            const hasLiked = await commentService.hasLiked(comment.id, session.user.id);
            likeStates[comment.id] = {
              liked: hasLiked,
              count: comment.likes_count || 0,
              loading: false
            };
          } catch (err) {
            console.error(`Error checking like status for comment ${comment.id}:`, err);
            likeStates[comment.id] = {
              liked: false,
              count: comment.likes_count || 0,
              loading: false
            };
          }
        }
        setLikeStates(likeStates);
      }
    } catch (err) {
      console.error('Error loading comments:', err);
      setError('خطا در بارگذاری نظرات. لطفاً صفحه را رفرش کنید.');
    } finally {
      setLoading(false);
    }
  };

  const handleCommentChange = async (payload: any) => {
    console.log('Comment change payload:', payload);
    try {
      if (payload.eventType === 'INSERT') {
        await loadComments();
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

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    try {
      const commentData: CommentFormData = {
        content: newComment.trim(),
        game_id: gameId,
        user_id: user.id
      };

      await commentService.addComment(commentData);
      setNewComment('');
      toast.success('نظر شما با موفقیت ثبت شد');
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast.error('خطا در ثبت نظر');
    }
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !replyingTo || !replyContent.trim()) return;

    try {
      const replyData: CommentFormData = {
        content: replyContent.trim(),
        game_id: gameId,
        parent_id: replyingTo,
        user_id: user.id
      };

      await commentService.addComment(replyData);
      setReplyContent('');
      setReplyingTo(null);
      toast.success('پاسخ شما با موفقیت ثبت شد');
    } catch (error) {
      console.error('Error submitting reply:', error);
      toast.error('خطا در ثبت پاسخ');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!user) return;

    try {
      await commentService.deleteComment(commentId);
      toast.success('نظر با موفقیت حذف شد');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('خطا در حذف نظر');
    }
  };

  const handleToggleLike = async (commentId: string) => {
    if (!user) {
      toast.error('لطفاً ابتدا وارد حساب کاربری خود شوید');
      return;
    }

    const currentState = likeStates[commentId];
    if (currentState.loading) return;

    try {
      setLikeStates(prev => ({
        ...prev,
        [commentId]: { ...currentState, loading: true }
      }));

      await commentService.toggleLike(commentId, user.id);
      const hasLiked = await commentService.hasLiked(commentId, user.id);
      const { count } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('comment_id', commentId);

      setLikeStates(prev => ({
        ...prev,
        [commentId]: {
          liked: hasLiked,
          count: count || 0,
          loading: false
        }
      }));
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('خطا در ثبت لایک');
      setLikeStates(prev => ({
        ...prev,
        [commentId]: { ...currentState, loading: false }
      }));
    }
  };

  const handleTogglePin = async (commentId: string) => {
    if (!user) return;

    try {
      await commentService.togglePin(commentId);
      toast.success('وضعیت پین با موفقیت تغییر کرد');
    } catch (error) {
      console.error('Error toggling pin:', error);
      toast.error('خطا در تغییر وضعیت پین');
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

  const getAvatarUrl = (user: any) => {
    if (user?.profile_image_url) {
      return user.profile_image_url;
    }
    return '/AE-logo.png';
  };

  const renderComment = (comment: Comment, isReply = false) => {
    const likeState = likeStates[comment.id] || { liked: false, count: 0, loading: false };
    const displayName = comment.user.display_name || comment.user.email?.split('@')[0] || 'ناشناس';

    return (
      <div key={comment.id} className={`space-y-4 ${isReply ? 'ml-8 mt-2' : ''}`}>
        <div className="flex items-start space-x-4 rtl:space-x-reverse">
          <Avatar className="h-10 w-10">
            <AvatarImage src={getAvatarUrl(comment.user)} />
            <AvatarFallback>{displayName[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <span className="font-medium">{displayName}</span>
                {comment.is_pinned && (
                  <Pin className="h-4 w-4 text-yellow-500" />
                )}
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                {user && user.id === comment.user_id && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleTogglePin(comment.id)}
                    >
                      <Pin className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">{comment.content}</p>
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleToggleLike(comment.id)}
                disabled={likeState.loading}
              >
                <ThumbsUp className={`h-4 w-4 ${likeState.liked ? 'text-blue-500' : ''}`} />
                <span className="mr-1">{likeState.count}</span>
              </Button>
              {!isReply && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReplyingTo(comment.id)}
                >
                  <MessageSquare className="h-4 w-4" />
                  <span className="mr-1">پاسخ</span>
                </Button>
              )}
            </div>
            {replyingTo === comment.id && (
              <form onSubmit={handleSubmitReply} className="mt-2">
                <Textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="پاسخ خود را بنویسید..."
                  className="mb-2"
                />
                <div className="flex justify-end space-x-2 rtl:space-x-reverse">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setReplyingTo(null);
                      setReplyContent('');
                    }}
                  >
                    انصراف
                  </Button>
                  <Button type="submit" disabled={!replyContent.trim()}>
                    ارسال پاسخ
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
        {comment.replies?.map(reply => renderComment(reply, true))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {user ? (
        <form onSubmit={handleSubmitComment} className="space-y-4">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="نظر خود را بنویسید..."
            className="min-h-[100px]"
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={!newComment.trim()}>
              ارسال نظر
            </Button>
          </div>
        </form>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400">
          برای ثبت نظر، لطفاً وارد حساب کاربری خود شوید
        </p>
      )}
      <div className="space-y-6">
        {comments.map(comment => renderComment(comment))}
      </div>
    </div>
  );
} 