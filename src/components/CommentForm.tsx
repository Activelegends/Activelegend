import React, { useState } from 'react';
import type { CommentFormData } from '../types/comments';

interface CommentFormProps {
    onSubmit: (data: CommentFormData) => Promise<void>;
    gameId: string;
}

export const CommentForm: React.FC<CommentFormProps> = ({ onSubmit, gameId }) => {
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (content.length < 5) {
            setError('نظر شما باید حداقل ۵ کاراکتر باشد');
            return;
        }

        if (content.length > 500) {
            setError('نظر شما نمی‌تواند بیشتر از ۵۰۰ کاراکتر باشد');
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit({ content, game_id: gameId });
            setContent('');
        } catch (err) {
            setError('خطا در ارسال نظر. لطفاً دوباره تلاش کنید.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="نظر خود را بنویسید..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F4B744] focus:border-transparent resize-none"
                    rows={4}
                    disabled={isSubmitting}
                />
                <div className="flex justify-between items-center mt-1">
                    <span className="text-sm text-gray-500">
                        {content.length}/500
                    </span>
                    {error && (
                        <span className="text-sm text-red-500">{error}</span>
                    )}
                </div>
            </div>
            
            <button
                type="submit"
                disabled={isSubmitting || content.length < 5}
                className="w-full bg-[#F4B744] text-white py-2 px-4 rounded-lg hover:bg-[#e5a93d] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                {isSubmitting ? (
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span className="mr-2">در حال ارسال...</span>
                    </div>
                ) : (
                    'ارسال نظر'
                )}
            </button>
        </form>
    );
}; 