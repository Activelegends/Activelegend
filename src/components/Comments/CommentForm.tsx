import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>;
  submitting: boolean;
  error: string | null;
}

export const CommentForm: React.FC<CommentFormProps> = ({
  onSubmit,
  submitting,
  error,
}) => {
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (content.length < 5 || content.length > 500) return;
    await onSubmit(content);
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="نظر خود را بنویسید..."
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={4}
          minLength={5}
          maxLength={500}
          disabled={submitting}
        />
        <div className="absolute bottom-2 left-2 text-sm text-gray-500">
          {content.length}/500
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-sm"
        >
          {error}
        </motion.div>
      )}

      <motion.button
        type="submit"
        disabled={submitting || content.length < 5 || content.length > 500}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`w-full py-3 px-6 rounded-lg text-white font-medium
          ${submitting || content.length < 5 || content.length > 500
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
          }`}
      >
        {submitting ? 'در حال ارسال...' : 'ارسال نظر'}
      </motion.button>
    </form>
  );
}; 