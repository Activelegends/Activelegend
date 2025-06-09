import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { StatusBadge } from './StatusBadge';

interface Game {
  id: string;
  slug: string;
  title: string;
  image_icon: string;
  status: 'in_progress' | 'released' | 'coming_soon';
}

interface GameCardProps {
  game: Game;
}

export const GameCard: React.FC<GameCardProps> = ({ game }) => {
  return (
    <div className="relative">
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
    </div>
  );
}; 