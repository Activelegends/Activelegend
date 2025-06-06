import React from 'react';

type GameStatus = 'in_progress' | 'released' | 'coming_soon';

interface StatusBadgeProps {
  status: GameStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusConfig = (status: GameStatus) => {
    switch (status) {
      case 'in_progress':
        return {
          text: 'در حال ساخت',
          color: 'bg-yellow-500'
        };
      case 'released':
        return {
          text: 'ساخته شده',
          color: 'bg-green-500'
        };
      case 'coming_soon':
        return {
          text: 'به زودی',
          color: 'bg-blue-500'
        };
      default:
        return {
          text: '',
          color: ''
        };
    }
  };

  const { text, color } = getStatusConfig(status);

  if (!text) return null;

  return (
    <span 
      className={`absolute top-4 left-4 ${color} text-xs font-bold text-white px-2 py-1 rounded-full`}
      dir="rtl"
    >
      {text}
    </span>
  );
};

export default StatusBadge; 