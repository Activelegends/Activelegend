import React, { useState, useEffect } from 'react';
import { termsService } from '../../services/termsService';
import type { TermsAndConditions } from '../../types/terms';
import DOMPurify from 'dompurify';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function TermsManagement() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [terms, setTerms] = useState<TermsAndConditions[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newTerms, setNewTerms] = useState({
    title: '',
    content_html: '',
    version: 1
  });

  useEffect(() => {
    if (user?.email !== 'active.legendss@gmail.com') {
      navigate('/');
      return;
    }
    loadTerms();
  }, [user, navigate]);

  const loadTerms = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('terms_and_conditions')
        .select('*')
        .order('version', { ascending: false });

      if (error) throw error;
      setTerms((data || []) as unknown as TermsAndConditions[]);
    } catch (err) {
      console.error('Error loading terms:', err);
      setError('خطا در بارگذاری قوانین و مقررات');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTerms = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await termsService.createNewTerms({
        ...newTerms,
        is_active: true
      });
      setIsCreating(false);
      setNewTerms({
        title: '',
        content_html: '',
        version: terms.length > 0 ? Math.max(...terms.map(t => t.version)) + 1 : 1
      });
      await loadTerms();
    } catch (err) {
      console.error('Error creating terms:', err);
      setError('خطا در ایجاد قوانین و مقررات جدید');
    } finally {
      setLoading(false);
    }
  };

  const handleActivateTerms = async (termsId: string) => {
    try {
      setLoading(true);
      await termsService.updateTerms(termsId, { is_active: true });
      await loadTerms();
    } catch (err) {
      console.error('Error activating terms:', err);
      setError('خطا در فعال‌سازی قوانین و مقررات');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="admin-page-container max-w-4xl mx-auto p-4 pt-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">مدیریت قوانین و مقررات</h1>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-[#F4B744] hover:bg-[#E5A93D] text-white px-4 py-2 rounded-lg"
        >
          ایجاد قوانین جدید
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {isCreating && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">ایجاد قوانین جدید</h2>
          <form onSubmit={handleCreateTerms} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                عنوان
              </label>
              <input
                type="text"
                id="title"
                value={newTerms.title}
                onChange={(e) => setNewTerms({ ...newTerms, title: e.target.value })}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                محتوا
              </label>
              <textarea
                id="content"
                value={newTerms.content_html}
                onChange={(e) => setNewTerms({ ...newTerms, content_html: e.target.value })}
                required
                rows={10}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                انصراف
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 rounded-lg text-white font-semibold ${
                  loading ? 'bg-gray-400' : 'bg-[#F4B744] hover:bg-[#E5A93D]'
                }`}
              >
                {loading ? 'در حال ایجاد...' : 'ایجاد'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {terms.map((term) => (
          <div
            key={term.id}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{term.title}</h3>
                <p className="text-sm text-gray-500">
                  نسخه {term.version} - {new Date(term.created_at).toLocaleDateString('fa-IR')}
                </p>
              </div>
              {!term.is_active && (
                <button
                  onClick={() => handleActivateTerms(term.id)}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                >
                  فعال‌سازی
                </button>
              )}
            </div>

            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(term.content_html) }}
            />

            {term.is_active && (
              <div className="mt-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  فعال
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 