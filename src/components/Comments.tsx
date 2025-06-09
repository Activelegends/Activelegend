import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Comment, LikeState } from '../types/comment';
import CommentForm from './CommentForm';

interface CommentsProps {
  gameId: string;
}

export default function Comments({ gameId }: CommentsProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [likeStates, setLikeStates] = useState<Record<string, LikeState>>({});

  const loadComments = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('comments')
        .select(`
          *,
          user:user_id (
            id,
            email,
            user_metadata
          ),
          likes:likes (
            user_id
          )
        `)
        .eq('game_id', gameId)
        .is('parent_comment_id', null)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      // Load replies for each comment
      const commentsWithReplies = await Promise.all(
        data.map(async (comment) => {
          const { data: replies } = await supabase
            .from('comments')
            .select(`
              *,
              user:user_id (
                id,
                email,
                user_metadata
              ),
              likes:likes (
                user_id
              )
            `)
            .eq('parent_comment_id', comment.id)
            .order('created_at', { ascending: true });

          return {
            ...comment,
            replies: replies || []
          };
        })
      );

      setComments(commentsWithReplies);

      // Initialize like states
      const newLikeStates: Record<string, LikeState> = {};
      [...commentsWithReplies, ...commentsWithReplies.flatMap(c => c.replies || [])].forEach(comment => {
        newLikeStates[comment.id] = {
          liked: comment.likes?.some(like => like.user_id === user?.id) || false,
          loading: false,
          count: comment.likes_count || 0
        };
      });
      setLikeStates(newLikeStates);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در بارگذاری نظرات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [gameId, user?.id]);

  const handleLike = async (commentId: string) => {
    if (!user) {
      setError('لطفا ابتدا وارد حساب کاربری خود شوید');
      return;
    }

    setLikeStates(prev => ({
      ...prev,
      [commentId]: {
        ...prev[commentId],
        loading: true
      }
    }));

    try {
      const isLiked = likeStates[commentId]?.liked;
      if (isLiked) {
        const { error: deleteError } = await supabase
          .from('likes')
          .delete()
          .match({ comment_id: commentId, user_id: user.id });

        if (deleteError) throw deleteError;
      } else {
        const { error: insertError } = await supabase
          .from('likes')
          .insert([{ comment_id: commentId, user_id: user.id }]);

        if (insertError) throw insertError;
      }

      setLikeStates(prev => ({
        ...prev,
        [commentId]: {
          liked: !isLiked,
          loading: false,
          count: prev[commentId].count + (isLiked ? -1 : 1)
        }
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در ثبت لایک');
      setLikeStates(prev => ({
        ...prev,
        [commentId]: {
          ...prev[commentId],
          loading: false
        }
      }));
    }
  };

  const handlePin = async (commentId: string) => {
    try {
      const comment = comments.find(c => c.id === commentId);
      if (!comment) return;

      const { error: updateError } = await supabase
        .from('comments')
        .update({ is_pinned: !comment.is_pinned })
        .eq('id', commentId);

      if (updateError) throw updateError;

      setComments(prev =>
        prev.map(c =>
          c.id === commentId
            ? { ...c, is_pinned: !c.is_pinned }
            : c
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در پین کردن نظر');
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm('آیا از حذف این نظر اطمینان دارید؟')) return;

    try {
      const { error: deleteError } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (deleteError) throw deleteError;

      setComments(prev =>
        prev.filter(c => c.id !== commentId)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در حذف نظر');
    }
  };

  const renderComment = (comment: Comment) => {
    const name = comment.user.user_metadata?.full_name || comment.user.email?.split('@')[0] || 'ناشناس';
    const profileImage = comment.user.user_metadata?.picture || '/default-avatar.png';

    return (
      <div key={comment.id} className={`mb-4 ${comment.is_pinned ? 'bg-yellow-50 border-yellow-200' : ''}`}>
        <div className="flex items-start space-x-3 rtl:space-x-reverse">
          <img
            src={profileImage}
            alt={name}
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <span className="font-semibold">{name}</span>
                {comment.is_pinned && (
                  <span className="text-yellow-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 4.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V4.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.616a1 1 0 01.894-1.79l1.599.8L9 4.323V3a1 1 0 011-1z" />
                    </svg>
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <button
                  onClick={() => handleLike(comment.id)}
                  className={`text-gray-500 hover:text-red-500 ${likeStates[comment.id]?.liked ? 'text-red-500' : ''}`}
                  disabled={likeStates[comment.id]?.loading}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                  </svg>
                </button>
                <span className="text-sm text-gray-500">{likeStates[comment.id]?.count || 0}</span>
                {user?.id === comment.user_id && (
                  <>
                    <button
                      onClick={() => handlePin(comment.id)}
                      className="text-gray-500 hover:text-yellow-500"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 4.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V4.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.616a1 1 0 01.894-1.79l1.599.8L9 4.323V3a1 1 0 011-1z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            </div>
            <p className="mt-1 text-gray-700">{comment.content}</p>
            <div className="mt-2">
              <button
                onClick={() => setReplyingTo(comment.id)}
                className="text-sm text-gray-500 hover:text-blue-500"
              >
                پاسخ
              </button>
            </div>
            {replyingTo === comment.id && (
              <div className="mt-2">
                <CommentForm
                  gameId={gameId}
                  parentId={comment.id}
                  onSuccess={() => {
                    setReplyingTo(null);
                    loadComments();
                  }}
                />
              </div>
            )}
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-4 mr-8 space-y-4">
                {comment.replies.map(reply => renderComment(reply))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="text-center py-4">در حال بارگذاری...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <CommentForm
        gameId={gameId}
        onSuccess={loadComments}
      />
      <div className="space-y-4">
        {comments.map(comment => renderComment(comment))}
      </div>
    </div>
  );
} 