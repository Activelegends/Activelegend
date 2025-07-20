import React from 'react';

interface PlayerProps {
  x: number;
  y: number;
  color: string;
  name: string;
  isMe?: boolean;
}

const Player: React.FC<PlayerProps> = ({ x, y, color, name, isMe }) => {
  return (
    <div
      className="absolute flex flex-col items-center"
      style={{ left: x, top: y }}
    >
      <div
        className={`w-10 h-10 rounded-full shadow-lg border-2 flex items-center justify-center transition-all duration-200 ${isMe ? 'border-yellow-400 scale-110' : 'border-white/30'}`}
        style={{ background: color }}
      >
        {/* Optionally, add an icon or emoji here */}
      </div>
      <span className="mt-1 text-xs font-bold text-white drop-shadow-sm bg-black/40 px-2 py-0.5 rounded-lg">
        {name}
      </span>
    </div>
  );
};

export default Player; 