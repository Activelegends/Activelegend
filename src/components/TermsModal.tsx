import React, { useState, useEffect } from 'react';
import { termsService } from '../services/termsService';
import type { TermsAndConditions } from '../types/terms';
import DOMPurify from 'dompurify';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

export default function TermsModal({ isOpen, onClose, onAccept }: TermsModalProps) {
  const [terms, setTerms] = useState<TermsAndConditions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadTerms();
    }
  }, [isOpen]);

  const loadTerms = async () => {
    try {
      setLoading(true);
      const activeTerms = await termsService.getActiveTerms();
      setTerms(activeTerms);
    } catch (err) {
      console.error('Error loading terms:', err);
      setError('خطا در بارگذاری قوانین و مقررات');
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
    setHasScrolledToBottom(isAtBottom);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold text-center">
            {terms?.title || 'قوانین و مقررات'}
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center p-4">{error}</div>
          ) : terms ? (
            <div
              onScroll={handleScroll}
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(terms.content_html) }}
            />
          ) : (
            <div className="text-gray-500 text-center p-4">
              قوانین و مقررات در دسترس نیست
            </div>
          )}
        </div>

        <div className="p-4 border-t">
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="agree"
              checked={isAgreed}
              onChange={(e) => setIsAgreed(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="agree" className="mr-2 text-gray-700">
              من قوانین و مقررات بالا را مطالعه کرده و با آن‌ها موافقم
            </label>
          </div>

          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              انصراف
            </button>
            <button
              onClick={onAccept}
              disabled={!hasScrolledToBottom || !isAgreed}
              className={`px-4 py-2 rounded-lg text-white font-semibold ${
                !hasScrolledToBottom || !isAgreed
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#F4B744] hover:bg-[#E5A93D]'
              }`}
            >
              پذیرش و ادامه
            </button>
          </div>

          {!hasScrolledToBottom && (
            <p className="text-yellow-600 text-center mt-2">
              لطفاً تمام قوانین و مقررات را مطالعه کنید
            </p>
          )}
        </div>
      </div>
    </div>
  );
} 