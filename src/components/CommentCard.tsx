import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Comment } from '../types/comments';
import { formatDate } from '../utils/date';

interface CommentCardProps {
    comment: Comment;
    isAdmin: boolean;
    currentUserId?: string;
}

export const CommentCard: React.FC<CommentCardProps> = ({
    comment,
    isAdmin,
    currentUserId
}) => {
    const [likesCount, setLikesCount] = useState(comment.likes_count);
    const [isLiked, setIsLiked] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleLike = async () => {
        if (!currentUserId) return;

        try {
            const newLikesCount = isLiked ? likesCount - 1 : likesCount + 1;
            const { error } = await supabase
                .from('comments')
                .update({ likes_count: newLikesCount })
                .eq('id', comment.id);

            if (error) throw error;

            setLikesCount(newLikesCount);
            setIsLiked(!isLiked);
        } catch (err) {
            console.error('Error updating likes:', err);
        }
    };

    const handleDelete = async () => {
        if (!isAdmin) return;

        if (!window.confirm('آیا از حذف این نظر اطمینان دارید؟')) return;

        setIsDeleting(true);
        try {
            const { error } = await supabase
                .from('comments')
                .delete()
                .eq('id', comment.id);

            if (error) throw error;
        } catch (err) {
            console.error('Error deleting comment:', err);
            setIsDeleting(false);
        }
    };

    const handleHide = async () => {
        if (!isAdmin) return;

        try {
            const { error } = await supabase
                .from('comments')
                .update({ status: 'hidden' })
                .eq('id', comment.id);

            if (error) throw error;
        } catch (err) {
            console.error('Error hiding comment:', err);
        }
    };

    return (
        <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="font-semibold">{comment.user?.display_name}</span>
                    <span className="text-gray-500 text-sm">
                        {formatDate(comment.created_at)}
                    </span>
                </div>
                {isAdmin && (
                    <div className="flex space-x-2 space-x-reverse">
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="text-red-500 hover:text-red-700 disabled:opacity-50"
                        >
                            {isDeleting ? 'در حال حذف...' : 'حذف'}
                        </button>
                        <button
                            onClick={handleHide}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            مخفی کردن
                        </button>
                    </div>
                )}
            </div>
            
            <p className="text-gray-800 mb-3">{comment.content}</p>
            
            <div className="flex items-center space-x-2 space-x-reverse">
                <button
                    onClick={handleLike}
                    disabled={!currentUserId}
                    className={`flex items-center space-x-1 space-x-reverse ${
                        currentUserId ? 'hover:text-[#F4B744]' : 'opacity-50 cursor-not-allowed'
                    }`}
                >
                    <svg
                        className={`w-5 h-5 ${isLiked ? 'text-[#F4B744]' : 'text-gray-400'}`}
                        fill={isLiked ? 'currentColor' : 'none'}
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
                    <span>{likesCount}</span>
                </button>
            </div>
        </div>
    );
}; 