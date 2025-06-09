import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import type { CommentFormData } from '../types/comment';

interface CommentFormProps {
  gameId: string;
  parentId?: string;
  onSuccess: () => void;
}

export default function CommentForm({ gameId, parentId, onSuccess }: CommentFormProps) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('لطفا ابتدا وارد حساب کاربری خود شوید');

      const commentData = {
        content: content.trim(),
        game_id: gameId,
        user_id: user.id,
        ...(parentId && { parent_comment_id: parentId })
      };

      const { error: insertError } = await supabase
        .from('comments')
        .insert([commentData]);

      if (insertError) throw insertError;

      setContent('');
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در ثبت نظر');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="نظر خود را بنویسید..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
          disabled={loading}
        />
      </div>
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'در حال ثبت...' : 'ثبت نظر'}
        </button>
      </div>
    </form>
  );
} 