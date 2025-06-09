import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { GameCard } from '../components/GameCard';
import { AddGameModal } from '../components/AddGameModal';

interface Game {
  id: string;
  slug: string;
  title: string;
  description: string;
  image_icon: string;
  download_url: string;
  status: 'in_progress' | 'released' | 'coming_soon';
  is_visible: boolean;
  content_blocks: Array<{
    type: 'image' | 'video' | 'text';
    src?: string;
    alt?: string;
    caption?: string;
    content?: string;
  }>;
}

export const Games: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
          .eq('is_visible', true);

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

  const handleAddGame = async (newGame: Omit<Game, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('games')
        .insert([newGame])
        .select()
        .single();

      if (error) throw error;
      setGames([...games, data]);
    } catch (error) {
      console.error('Error adding game:', error);
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">در حال بارگذاری...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>

        {isAdmin && (
          <>
            <button
              onClick={() => setShowAddModal(true)}
              className="fixed bottom-8 left-8 bg-green-600 text-white px-5 py-3 rounded-full shadow-lg hover:bg-green-700 transition-all"
            >
              افزودن بازی جدید
            </button>

            <AddGameModal
              isOpen={showAddModal}
              onClose={() => setShowAddModal(false)}
              onSave={handleAddGame}
            />
          </>
        )}
      </div>
    </div>
  );
}; 