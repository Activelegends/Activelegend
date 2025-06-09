import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Comment, CommentFormData } from '../types/comments';
import { CommentCard } from './CommentCard';
import { CommentForm } from './CommentForm';
import { AuthPrompt } from './AuthPrompt';
import { useAuth } from '../hooks/useAuth';
import { formatDate } from '../utils/date';

interface CommentsSectionProps {
    gameId: string;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({ gameId }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user, isAdmin } = useAuth();

    useEffect(() => {
        fetchComments();
        subscribeToComments();
    }, [gameId]);

    const fetchComments = async () => {
        try {
            const { data, error } = await supabase
                .from('comments')
                .select(`
                    *,
                    user:user_id (
                        display_name,
                        email
                    )
                `)
                .eq('game_id', gameId)
                .eq('status', 'approved')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setComments(data || []);
        } catch (err) {
            setError('خطا در بارگذاری نظرات');
            console.error('Error fetching comments:', err);
        } finally {
            setLoading(false);
        }
    };

    const subscribeToComments = () => {
        const subscription = supabase
            .channel('comments_changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'comments',
                    filter: `game_id=eq.${gameId}`
                },
                (payload) => {
                    if (payload.eventType === 'INSERT' && payload.new.status === 'approved') {
                        setComments(prev => [payload.new as Comment, ...prev]);
                    } else if (payload.eventType === 'UPDATE') {
                        setComments(prev =>
                            prev.map(comment =>
                                comment.id === payload.new.id ? payload.new as Comment : comment
                            )
                        );
                    } else if (payload.eventType === 'DELETE') {
                        setComments(prev =>
                            prev.filter(comment => comment.id !== payload.old.id)
                        );
                    }
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    };

    const handleCommentSubmit = async (formData: CommentFormData) => {
        try {
            const { error } = await supabase
                .from('comments')
                .insert([{
                    ...formData,
                    user_id: user?.id,
                    status: 'pending'
                }]);

            if (error) throw error;
        } catch (err) {
            console.error('Error submitting comment:', err);
            throw new Error('خطا در ارسال نظر');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F4B744]"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500 text-center p-4">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-6 p-4">
            <h2 className="text-2xl font-bold text-right">نظرات</h2>
            
            {user ? (
                <CommentForm
                    onSubmit={handleCommentSubmit}
                    gameId={gameId}
                />
            ) : (
                <AuthPrompt />
            )}

            <div className="space-y-4">
                {comments.map(comment => (
                    <CommentCard
                        key={comment.id}
                        comment={comment}
                        isAdmin={isAdmin}
                        currentUserId={user?.id}
                    />
                ))}
            </div>
        </div>
    );
}; 