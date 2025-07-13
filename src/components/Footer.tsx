import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="w-full flex justify-center items-center">
        <p className="text-[11px] text-gray-400 text-center py-1 px-2 bg-transparent shadow-none m-0">
          &copy; {new Date().getFullYear()} تمامی حقوق این وب‌سایت متعلق به <span className="font-bold text-white">محمد مهدی مولایاری</span> است. هرگونه کپی‌برداری پیگرد قانونی دارد.
        </p>
      </div>
    </footer>
  );
}; 