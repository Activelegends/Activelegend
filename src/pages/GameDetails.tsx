import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gamesService } from '../services/gamesService';
import type { Game } from '../types/game';
import { useAuth } from '../contexts/AuthContext';

export default function GameDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadGame(id);
    }
  }, [id]);

  const loadGame = async (gameId: string) => {
    try {
      setLoading(true);
      const gameData = await gamesService.getGameById(gameId);
      setGame(gameData);
    } catch (err) {
      console.error('Error loading game:', err);
      setError('خطا در بارگذاری اطلاعات بازی');
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    // TODO: Implement game launch logic
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex justify-center items-center h-[calc(100vh-6rem)]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black pt-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="bg-red-50 border-r-4 border-red-500 text-red-700 px-6 py-4 rounded-lg flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-black pt-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-white text-center p-4">
            بازی مورد نظر یافت نشد
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-24">
      <div className="container mx-auto px-4 md:px-8">
        <div className="bg-gray-900 rounded-xl overflow-hidden shadow-xl">
          <div className="relative">
            <img
              src={game.cover_image}
              alt={game.title}
              className="w-full h-64 md:h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{game.title}</h1>
              <p className="text-gray-300">{game.description}</p>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">اطلاعات بازی</h2>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-300">
                    <span className="ml-2">دسته‌بندی:</span>
                    <span className="text-white">{game.category}</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <span className="ml-2">تعداد بازیکن:</span>
                    <span className="text-white">{game.player_count}</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <span className="ml-2">سطح دشواری:</span>
                    <span className="text-white">{game.difficulty}</span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white mb-4">راهنمای بازی</h2>
                <div className="prose prose-invert max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: game.instructions }} />
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={handlePlay}
                className="w-full md:w-auto px-8 py-3 bg-[#F4B744] text-black font-semibold rounded-lg hover:bg-[#E5A93D] transition-colors duration-200"
              >
                شروع بازی
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 