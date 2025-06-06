import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { HiPencil } from 'react-icons/hi';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import type { Game, GameFormData, ContentBlock as ContentBlockType } from '../types/game';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaEdit, FaTimes } from 'react-icons/fa';
import ContentBlock from '../components/ContentBlock';
import EditGameModal from '../components/EditGameModal';

const GameForm = ({ game, onClose, onSave }: {
  game: Game;
  onClose: () => void;
  onSave: (data: GameFormData) => Promise<void>;
}) => {
  const [formData, setFormData] = useState<GameFormData>({
    slug: game.slug,
    title: game.title,
    description: game.description,
    image_icon: game.image_icon,
    image_gallery: game.image_gallery,
    video_urls: game.video_urls,
    download_url: game.download_url,
    is_visible: game.is_visible,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-900 rounded-lg p-6 w-full max-w-2xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold font-vazirmatn">ویرایش بازی</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <FaTimes size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1 font-vazirmatn">Slug</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1 font-vazirmatn">عنوان</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1 font-vazirmatn">توضیحات</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white h-32"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1 font-vazirmatn">لینک تصویر آیکون</label>
            <input
              type="url"
              value={formData.image_icon}
              onChange={(e) => setFormData({ ...formData, image_icon: e.target.value })}
              className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1 font-vazirmatn">لینک‌های گالری (هر خط یک لینک)</label>
            <textarea
              value={formData.image_gallery.join('\n')}
              onChange={(e) => setFormData({ ...formData, image_gallery: e.target.value.split('\n') })}
              className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white h-32"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1 font-vazirmatn">لینک‌های ویدیو (هر خط یک لینک)</label>
            <textarea
              value={formData.video_urls.join('\n')}
              onChange={(e) => setFormData({ ...formData, video_urls: e.target.value.split('\n') })}
              className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white h-32"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1 font-vazirmatn">لینک دانلود</label>
            <input
              type="url"
              value={formData.download_url}
              onChange={(e) => setFormData({ ...formData, download_url: e.target.value })}
              className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.is_visible}
              onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
              className="mr-2"
            />
            <label className="text-gray-400 font-vazirmatn">نمایش در سایت</label>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#F4B744] text-black rounded-lg hover:bg-[#F4B744]/90"
            >
              ذخیره تغییرات
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const GameDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [game, setGame] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAdmin(session?.user?.email === 'active.legendss@gmail.com');
    };

    const fetchGame = async () => {
      try {
        const { data, error } = await supabase
          .from('games')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) throw error;
        if (!data || !data.is_visible) {
          navigate('/404');
          return;
        }

        setGame(data);
      } catch (error) {
        console.error('Error fetching game:', error);
        navigate('/404');
      } finally {
        setIsLoading(false);
      }
    };

    checkAdmin();
    fetchGame();
  }, [slug, navigate]);

  const handleGameUpdated = async () => {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('slug', slug)
      .single();

    if (!error && data) {
      setGame(data);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F4B744]"></div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-500 mb-4">۴۰۴</h1>
          <p className="text-lg text-gray-400">بازی یافت نشد یا در دسترس نیست.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto p-4 md:p-8" dir="rtl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-white">{game.title}</h1>
          {isAdmin && (
            <button
              onClick={() => setShowEditModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
            >
              ویرایش بازی
            </button>
          )}
        </div>

        <p className="text-base font-medium text-gray-300 mb-6">{game.description}</p>

        <a
          href={game.download_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-[#F4B744] text-black font-bold px-6 py-3 rounded-2xl hover:scale-105 transition-all duration-200 mb-8"
        >
          دانلود بازی
        </a>

        <div className="mt-8 space-y-8">
          {game.content_blocks.map((block: ContentBlockType, index: number) => (
            <ContentBlock key={index} block={block} index={index} />
          ))}
        </div>
      </div>

      <EditGameModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleGameUpdated}
        game={game}
      />
    </div>
  );
};

export default GameDetail; 