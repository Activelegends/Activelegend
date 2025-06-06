import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { HiUser, HiCog, HiLogout } from 'react-icons/hi';

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-gray-100 hover:text-yellow-400 transition-colors"
        aria-label="User menu"
      >
        <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold">
          {user?.email?.[0].toUpperCase() || 'U'}
        </div>
        <span className="hidden md:inline text-sm">{user?.email}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-[#222222] rounded-lg shadow-lg py-2 z-50">
          <Link
            to="/profile"
            className="flex items-center gap-2 px-4 py-2 text-gray-100 hover:bg-gray-700 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <HiUser className="w-5 h-5" />
            <span>پروفایل</span>
          </Link>
          <Link
            to="/settings"
            className="flex items-center gap-2 px-4 py-2 text-gray-100 hover:bg-gray-700 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <HiCog className="w-5 h-5" />
            <span>تنظیمات</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-gray-100 hover:bg-gray-700 transition-colors text-right"
          >
            <HiLogout className="w-5 h-5" />
            <span>خروج</span>
          </button>
        </div>
      )}
    </div>
  );
}