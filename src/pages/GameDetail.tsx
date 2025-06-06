import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { HiPencil } from 'react-icons/hi';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Game, GameFormData } from '../types/game';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaEdit, FaTimes } from 'react-icons/fa';

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

export default function GameDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.email === 'active.legendss@gmail.com';

  const [game, setGame] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
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

    fetchGame();
  }, [slug, navigate]);

  const handleSave = async (formData: GameFormData) => {
    if (!game) return;

    try {
      const { error } = await supabase
        .from('games')
        .update(formData)
        .eq('id', game.id);

      if (error) throw error;
      setGame({ ...game, ...formData });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating game:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!game) return null;

  return (
    <div className="min-h-screen bg-black py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {isAdmin && (
          <div className="flex justify-end mb-8">
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-2 bg-[#F4B744] text-black px-4 py-2 rounded-lg hover:bg-[#F4B744]/90"
            >
              <FaEdit />
              <span className="font-vazirmatn">ویرایش</span>
            </button>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 rounded-lg overflow-hidden"
        >
          <div className="aspect-video relative">
            <img
              src={game.image_icon}
              alt={game.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-8">
            <h1 className="text-4xl font-bold mb-4 font-vazirmatn">{game.title}</h1>
            <p className="text-gray-400 mb-8 font-vazirmatn">{game.description}</p>

            {game.image_gallery.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 font-vazirmatn">گالری تصاویر</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {game.image_gallery.map((image, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="aspect-video relative rounded-lg overflow-hidden"
                    >
                      <img
                        src={image}
                        alt={`Gallery image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {game.video_urls.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 font-vazirmatn">ویدیوها</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {game.video_urls.map((url, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="aspect-video relative rounded-lg overflow-hidden"
                    >
                      <iframe
                        src={url}
                        title={`Video ${index + 1}`}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {game.download_url && (
              <motion.a
                href={game.download_url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-block bg-[#F4B744] text-black px-6 py-3 rounded-lg font-medium hover:bg-[#F4B744]/90 transition-colors font-vazirmatn"
              >
                دانلود بازی
              </motion.a>
            )}
          </div>
        </motion.div>
      </div>

      {isEditing && (
        <GameForm
          game={game}
          onClose={() => setIsEditing(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
} 