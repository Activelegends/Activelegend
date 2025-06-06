import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';

interface FavoriteButtonProps {
  gameId: string;
  className?: string;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({ gameId, className = '' }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkFavoriteStatus();
  }, [gameId]);

  const checkFavoriteStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('game_id', gameId)
        .eq('user_id', session.user.id)
        .single();

      if (error) throw error;
      setIsFavorite(!!data);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        // Redirect to login or show login modal
        return;
      }

      if (isFavorite) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('game_id', gameId)
          .eq('user_id', session.user.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert([
            { game_id: gameId, user_id: session.user.id }
          ]);

        if (error) throw error;
      }

      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleFavorite}
      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
        isFavorite
          ? 'bg-red-500 text-white hover:bg-red-600'
          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
      } ${className}`}
    >
      <motion.span
        animate={{ scale: isFavorite ? [1, 1.2, 1] : 1 }}
        transition={{ duration: 0.3 }}
      >
        ❤️
      </motion.span>
      <span className="text-sm font-medium">
        {isFavorite ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
      </span>
    </motion.button>
  );
}; 