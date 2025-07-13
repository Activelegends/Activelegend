import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="footer bg-black/90 backdrop-blur-md border-t border-white/10">
      <div className="container mx-auto py-2">
        <p className="text-xs text-center text-gray-400 py-2">
          &copy; {new Date().getFullYear()} تمامی حقوق این وب‌سایت متعلق به <span className="font-bold text-white">محمد مهدی مولایاری</span> است. هرگونه کپی‌برداری پیگرد قانونی دارد.
        </p>
      </div>
    </footer>
  );
}; 