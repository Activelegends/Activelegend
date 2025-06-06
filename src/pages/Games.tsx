import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import type { Game } from '../types/game';
import LoadingSpinner from '../components/LoadingSpinner';
import GameCard from '../components/GameCard';
import AddGameModal from '../components/AddGameModal';

const Games: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAdmin(session?.user?.email === 'active.legendss@gmail.com');
    };

    const fetchGames = async () => {
      try {
        const { data, error } = await supabase
          .from('games')
          .select('*')
          .eq('is_visible', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setGames(data || []);
      } catch (error) {
        console.error('Error fetching games:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdmin();
    fetchGames();
  }, []);

  const handleGameAdded = async () => {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('is_visible', true)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setGames(data);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F4B744]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-12 text-center font-vazirmatn"
        >
          بازی‌های ما
        </motion.h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {games.map(game => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>

        {games.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-400 mt-8 font-vazirmatn"
          >
            در حال حاضر بازی‌ای موجود نیست
          </motion.p>
        )}
      </div>

      {isAdmin && (
        <button
          onClick={() => setShowAddModal(true)}
          className="fixed bottom-8 left-8 bg-green-600 text-white px-5 py-3 rounded-full shadow-lg hover:bg-green-700 transition-all"
        >
          افزودن بازی جدید
        </button>
      )}

      <AddGameModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleGameAdded}
      />
    </div>
  );
};

export default Games; 