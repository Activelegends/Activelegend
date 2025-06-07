import { useState } from 'react';
import { UserAvatar } from './UserAvatar';
import { FaBars, FaTimes } from 'react-icons/fa';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full bg-[#111111] text-gray-100 z-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and navigation */}
          <div className="flex items-center">
            <a href="/" className="text-xl font-bold text-white hover:text-amber-500 transition-colors">
              Active Legends
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 space-x-reverse">
            <a href="/" className="text-gray-300 hover:text-amber-500 transition-colors">خانه</a>
            <a href="/games" className="text-gray-300 hover:text-amber-500 transition-colors">بازی‌ها</a>
            <a href="/contact" className="text-gray-300 hover:text-amber-500 transition-colors">تماس</a>
          </nav>

          {/* User section */}
          <div className="flex items-center gap-4">
            <UserAvatar size="medium" className="hover:opacity-80 transition-opacity" />
            
            {/* Mobile menu button */}
            <button
              className="md:hidden text-gray-300 hover:text-amber-500 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden absolute top-full right-0 w-full bg-[#222222] shadow-lg transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
          }`}
        >
          <nav className="px-4 py-2 space-y-2">
            <a
              href="/"
              className="block py-2 text-gray-300 hover:text-amber-500 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              خانه
            </a>
            <a
              href="/games"
              className="block py-2 text-gray-300 hover:text-amber-500 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              بازی‌ها
            </a>
            <a
              href="/contact"
              className="block py-2 text-gray-300 hover:text-amber-500 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              تماس
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
} 