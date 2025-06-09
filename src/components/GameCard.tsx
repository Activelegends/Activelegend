import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { StatusBadge } from './StatusBadge';
import { CommentsSection } from './CommentsSection';

interface Game {
  id: string;
  slug: string;
  title: string;
  image_icon: string;
  status: 'in_progress' | 'released' | 'coming_soon';
  description: string;
}

interface GameCardProps {
  game: Game;
  onPlay: (game: Game) => void;
}

export const GameCard: React.FC<GameCardProps> = ({ game, onPlay }) => {
  const [showComments, setShowComments] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <StatusBadge status={game.status} />
      <motion.div
        whileHover={{ scale: 1.03, boxShadow: '0 10px 20px rgba(0,0,0,0.3)' }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <Link to={`/games/${game.slug}`}>
          <img
            src={game.image_icon}
            alt={game.title}
            className="rounded-2xl w-full h-auto object-cover"
          />
        </Link>
      </motion.div>

      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">{game.title}</h3>
        <p className="text-gray-600 mb-4">{game.description}</p>
        <div className="flex justify-between items-center">
          <button
            onClick={() => onPlay(game)}
            className="bg-[#F4B744] text-white px-4 py-2 rounded-lg hover:bg-[#e5a93d] transition-colors"
          >
            بازی کردن
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="text-gray-600 hover:text-[#F4B744] transition-colors"
          >
            {showComments ? 'بستن نظرات' : 'مشاهده نظرات'}
          </button>
        </div>
      </div>

      {showComments && (
        <div className="border-t border-gray-200">
          <CommentsSection gameId={game.id} />
        </div>
      )}
    </div>
  );
}; 