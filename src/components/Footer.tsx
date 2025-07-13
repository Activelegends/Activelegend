import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="footer bg-black/90 backdrop-blur-md border-t border-white/10">
      <div className="container mx-auto py-1">
        <p className="text-[11px] text-center text-gray-400 py-1 leading-tight">
          &copy; {new Date().getFullYear()} تمامی حقوق این وب‌سایت متعلق به <span className="font-bold text-white">محمد مهدی مولایاری</span> است. هرگونه کپی‌برداری پیگرد قانونی دارد.
        </p>
      </div>
    </footer>
  );
}; 