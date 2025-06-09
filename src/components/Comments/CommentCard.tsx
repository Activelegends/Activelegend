import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { formatDate } from '../../utils/date';
import { commentService } from '../../services/commentService';
import type { Comment } from '../../types/comments';

interface CommentCardProps {
  comment: Comment;
  onLike: () => void;
  onReply: (content: string) => void;
  isAdmin: boolean;
}

export const CommentCard: React.FC<CommentCardProps> = ({
  comment,
  onLike,
  onReply,
  isAdmin,
}) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (replyContent.length < 5 || replyContent.length > 500) return;
    await onReply(replyContent);
    setReplyContent('');
    setIsReplying(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-start space-x-4 space-x-reverse">
        <img
          src={comment.user?.profile_image_url || '/default-avatar.png'}
          alt={comment.user?.display_name || 'کاربر'}
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1">
          <div className="flex items-center space-x-2 space-x-reverse">
            <span className="font-medium">{comment.user?.display_name || 'کاربر'}</span>
            {comment.user?.is_special && (
              <span className="text-green-500">✔️</span>
            )}
            {comment.is_pinned && (
              <span className="text-sm text-gray-500">📌 پین شده</span>
            )}
          </div>
          <p className="text-gray-600 mt-1">{comment.content}</p>
          <div className="flex items-center space-x-4 space-x-reverse mt-2 text-sm text-gray-500">
            <span>{formatDate(comment.created_at)}</span>
            <button
              onClick={onLike}
              className="flex items-center space-x-1 space-x-reverse hover:text-blue-600"
            >
              <motion.span
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ❤️
              </motion.span>
              <span>{comment.likes_count}</span>
            </button>
            <button
              onClick={() => setIsReplying(!isReplying)}
              className="hover:text-blue-600"
            >
              پاسخ
            </button>
          </div>

          {isReplying && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleReply}
              className="mt-4"
            >
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="پاسخ خود را بنویسید..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
                minLength={5}
                maxLength={500}
              />
              <div className="flex justify-end space-x-2 space-x-reverse mt-2">
                <button
                  type="button"
                  onClick={() => setIsReplying(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={replyContent.length < 5 || replyContent.length > 500}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  ارسال پاسخ
                </button>
              </div>
            </motion.form>
          )}

          {isAdmin && (
            <div className="flex items-center space-x-4 space-x-reverse mt-4 pt-4 border-t">
              <button
                onClick={() => commentService.updateComment(comment.id, { is_pinned: !comment.is_pinned })}
                className="text-sm text-gray-600 hover:text-blue-600"
              >
                {comment.is_pinned ? 'حذف پین' : 'پین کردن'}
              </button>
              <button
                onClick={() => commentService.updateComment(comment.id, { is_approved: !comment.is_approved })}
                className="text-sm text-gray-600 hover:text-blue-600"
              >
                {comment.is_approved ? 'عدم تایید' : 'تایید'}
              </button>
              <button
                onClick={() => {
                  if (window.confirm('آیا از حذف این نظر اطمینان دارید؟')) {
                    commentService.deleteComment(comment.id);
                  }
                }}
                className="text-sm text-red-600 hover:text-red-700"
              >
                حذف
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 