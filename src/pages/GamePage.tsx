import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { CommentsSection } from '../components/Comments/CommentsSection';
import type { Game } from '../types/game';

export const GamePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const { data, error } = await supabase
          .from('games')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setGame(data);
      } catch (err) {
        setError('خطا در بارگذاری بازی');
        console.error('Error fetching game:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [id]);

  if (loading) {
    return <div className="text-center py-8">در حال بارگذاری...</div>;
  }

  if (error || !game) {
    return <div className="text-center text-red-500 py-8">{error || 'بازی یافت نشد'}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">{game.title}</h1>
        
        <div className="aspect-w-16 aspect-h-9 mb-8">
          <iframe
            src={game.embed_url}
            className="w-full h-full rounded-lg shadow-lg"
            allowFullScreen
          />
        </div>

        <div className="prose max-w-none mb-8">
          <p>{game.description}</p>
        </div>

        <div className="mt-12">
          <CommentsSection gameId={game.id} />
        </div>
      </div>
    </div>
  );
}; 