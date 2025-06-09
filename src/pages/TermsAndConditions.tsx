import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { termsService } from '../services/termsService';
import type { TermsAndConditions } from '../types/terms';
import DOMPurify from 'dompurify';

export default function TermsAndConditionsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [terms, setTerms] = useState<TermsAndConditions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadTerms();
  }, []);

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

  const handleScroll = () => {
    if (!contentRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
    setHasScrolledToBottom(isAtBottom);
  };

  const handleAccept = async () => {
    if (!user || !terms) return;

    try {
      setIsAccepting(true);
      await termsService.acceptTerms(user.id, terms.version);
      navigate('/');
    } catch (err) {
      console.error('Error accepting terms:', err);
      setError('خطا در ثبت پذیرش قوانین و مقررات');
    } finally {
      setIsAccepting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-center p-4">
          {error}
        </div>
      </div>
    );
  }

  if (!terms) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500 text-center p-4">
          قوانین و مقررات در دسترس نیست
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">{terms.title}</h1>
      
      <div
        ref={contentRef}
        onScroll={handleScroll}
        className="bg-white rounded-lg shadow-md p-6 mb-6 max-h-[60vh] overflow-y-auto"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(terms.content_html) }}
      />

      <div className="bg-white rounded-lg shadow-md p-6">
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

        <button
          onClick={handleAccept}
          disabled={!hasScrolledToBottom || !isAgreed || isAccepting}
          className={`w-full py-3 px-6 rounded-lg text-white font-semibold ${
            !hasScrolledToBottom || !isAgreed || isAccepting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-[#F4B744] hover:bg-[#E5A93D]'
          }`}
        >
          {isAccepting ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              در حال ثبت...
            </div>
          ) : (
            'پذیرش و ادامه'
          )}
        </button>

        {!hasScrolledToBottom && (
          <p className="text-yellow-600 text-center mt-2">
            لطفاً تمام قوانین و مقررات را مطالعه کنید
          </p>
        )}
      </div>
    </div>
  );
} 