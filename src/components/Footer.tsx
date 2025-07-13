import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="footer bg-black/60 backdrop-blur-sm border-t border-white/10 pointer-events-none" style={{ minHeight: '0', height: '32px' }}>
      <div className="w-full flex justify-center items-center h-full">
        <p className="text-[10px] text-center text-gray-300 leading-tight m-0 p-0 select-none">
          &copy; {new Date().getFullYear()} تمامی حقوق این وب‌سایت متعلق به <span className="font-bold text-white">محمد مهدی مولایاری</span> است.
        </p>
      </div>
    </footer>
  );
}; 