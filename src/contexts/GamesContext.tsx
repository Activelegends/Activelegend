import React, { createContext, useContext, useState, useEffect } from 'react';
import { gamesService } from '../services/gamesService';
import type { Game } from '../types/game';

interface GamesContextType {
  games: Game[];
  loading: boolean;
  error: string | null;
  refreshGames: () => Promise<void>;
}

const GamesContext = createContext<GamesContextType | undefined>(undefined);

export const GamesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadGames = async () => {
    try {
      setLoading(true);
      const gamesList = await gamesService.getGames();
      setGames(gamesList);
      setError(null);
    } catch (err) {
      console.error('Error loading games:', err);
      setError('خطا در بارگذاری بازی‌ها');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGames();
  }, []);

  return (
    <GamesContext.Provider value={{ games, loading, error, refreshGames: loadGames }}>
      {children}
    </GamesContext.Provider>
  );
};

export const useGames = () => {
  const context = useContext(GamesContext);
  if (context === undefined) {
    throw new Error('useGames must be used within a GamesProvider');
  }
  return context;
}; 