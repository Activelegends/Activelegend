import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPlus, HiPencil, HiTrash, HiEye, HiEyeOff } from 'react-icons/hi';
import { supabase } from '../lib/supabaseClient';
import type { Game, GameFormData } from '../types/game';
import { useAuth } from '../contexts/AuthContext';

const GameCard = ({ game, onEdit, onDelete, onToggleVisibility, isAdmin }: {
  game: Game;
  onEdit: (game: Game) => void;
  onDelete: (id: string) => void;
  onToggleVisibility: (id: string, currentVisibility: boolean) => void;
  isAdmin: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95 }}
    whileHover={{ scale: 1.02 }}
    className="bg-black/50 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg border border-white/10"
  >
    <div className="relative aspect-video">
      <img
        src={game.image_url}
        alt={game.title}
        className="w-full h-full object-cover"
      />
      {isAdmin && (
        <div className="absolute top-2 left-2 flex gap-2">
          <button
            onClick={() => onToggleVisibility(game.id, game.is_visible)}
            className="p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
          >
            {game.is_visible ? (
              <HiEye className="w-5 h-5 text-white" />
            ) : (
              <HiEyeOff className="w-5 h-5 text-white" />
            )}
          </button>
          <button
            onClick={() => onEdit(game)}
            className="p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
          >
            <HiPencil className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={() => onDelete(game.id)}
            className="p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
          >
            <HiTrash className="w-5 h-5 text-white" />
          </button>
        </div>
      )}
    </div>
    <div className="p-4">
      <h3 className="font-bold text-lg mb-2 font-vazirmatn">{game.title}</h3>
      <p className="text-gray-300 text-sm mb-4 font-vazirmatn">{game.description}</p>
      <a
        href={game.download_url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-[#F4B744] text-black px-4 py-2 rounded-lg font-medium hover:bg-[#F4B744]/90 transition-colors"
      >
        دانلود
      </a>
    </div>
  </motion.div>
);

const GameForm = ({ game, onSubmit, onClose }: {
  game?: Game;
  onSubmit: (data: GameFormData) => void;
  onClose: () => void;
}) => {
  const [formData, setFormData] = useState<GameFormData>({
    title: game?.title || '',
    description: game?.description || '',
    image_url: game?.image_url || '',
    download_url: game?.download_url || '',
    is_visible: game?.is_visible ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <div className="bg-black border border-white/10 rounded-2xl p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4 font-vazirmatn">
          {game ? 'ویرایش بازی' : 'افزودن بازی جدید'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 font-vazirmatn">عنوان بازی</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 font-vazirmatn">توضیح کوتاه</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
              rows={3}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 font-vazirmatn">لینک تصویر</label>
            <input
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 font-vazirmatn">لینک دانلود</label>
            <input
              type="url"
              value={formData.download_url}
              onChange={(e) => setFormData({ ...formData, download_url: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
              required
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_visible"
              checked={formData.is_visible}
              onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
              className="rounded border-white/10"
            />
            <label htmlFor="is_visible" className="text-sm font-vazirmatn">نمایش/مخفی</label>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#F4B744] text-black rounded-lg hover:bg-[#F4B744]/90 transition-colors"
            >
              ذخیره
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default function GamesSection() {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | undefined>();
  const { user } = useAuth();
  const isAdmin = user?.email === 'active.legendss@gmail.com';

  const fetchGames = async () => {
    try {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGames(data || []);
    } catch (error) {
      console.error('Error fetching games:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const handleSubmit = async (formData: GameFormData) => {
    try {
      if (selectedGame) {
        const { error } = await supabase
          .from('games')
          .update(formData)
          .eq('id', selectedGame.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('games')
          .insert([formData]);
        if (error) throw error;
      }
      await fetchGames();
      setShowForm(false);
      setSelectedGame(undefined);
    } catch (error) {
      console.error('Error saving game:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('آیا از حذف این بازی اطمینان دارید؟')) return;
    
    try {
      const { error } = await supabase
        .from('games')
        .delete()
        .eq('id', id);
      if (error) throw error;
      await fetchGames();
    } catch (error) {
      console.error('Error deleting game:', error);
    }
  };

  const handleToggleVisibility = async (id: string, currentVisibility: boolean) => {
    try {
      const { error } = await supabase
        .from('games')
        .update({ is_visible: !currentVisibility })
        .eq('id', id);
      if (error) throw error;
      await fetchGames();
    } catch (error) {
      console.error('Error toggling visibility:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F4B744]"></div>
      </div>
    );
  }

  return (
    <section className="py-16 px-4 relative">
      <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5"></div>
      <div className="max-w-7xl mx-auto relative">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold font-vazirmatn">بازی‌ها</h2>
          {isAdmin && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-[#F4B744] text-black px-4 py-2 rounded-lg hover:bg-[#F4B744]/90 transition-colors"
            >
              <HiPlus className="w-5 h-5" />
              افزودن بازی جدید
            </button>
          )}
        </div>

        {games.length === 0 ? (
          <div className="text-center py-16 text-gray-400 font-vazirmatn">
            بازی‌ای برای نمایش وجود ندارد. به زودی…
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {games.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  onEdit={(game) => {
                    setSelectedGame(game);
                    setShowForm(true);
                  }}
                  onDelete={handleDelete}
                  onToggleVisibility={handleToggleVisibility}
                  isAdmin={isAdmin}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <GameForm
            game={selectedGame}
            onSubmit={handleSubmit}
            onClose={() => {
              setShowForm(false);
              setSelectedGame(undefined);
            }}
          />
        )}
      </AnimatePresence>
    </section>
  );
} 