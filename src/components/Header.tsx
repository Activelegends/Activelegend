import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/header.css';
import { UserAvatar } from './UserAvatar';

interface User {
  id: string;
  username: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  signOut: () => Promise<void>;
}

const Header: React.FC = () => {
  const { user, signOut } = useAuth() as AuthContextType;
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setIsUserMenuOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="container">
        <nav className="nav">
          <Link to="/" className="logo">
            <img src="/logo.png" alt="Active Legends" />
            Active Legends
          </Link>

          {/* Hamburger Menu Button */}
          <button 
            className="md:hidden p-2 text-gray-600 hover:text-[#F4B744] focus:outline-none"
            onClick={toggleMenu}
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex nav-links">
            <Link 
              to="/games" 
              className={`nav-link ${location.pathname === '/games' ? 'active' : ''}`}
            >
              بازی‌ها
            </Link>
            <Link 
              to="/leaderboard" 
              className={`nav-link ${location.pathname === '/leaderboard' ? 'active' : ''}`}
            >
              جدول امتیازات
            </Link>
            {user?.role === 'admin' && (
              <Link 
                to="/admin" 
                className={`nav-link ${location.pathname.startsWith('/admin') ? 'active' : ''}`}
              >
                پنل مدیریت
              </Link>
            )}
          </div>

          {/* Mobile Navigation Menu */}
          <div className={`md:hidden absolute top-full left-0 right-0 bg-white shadow-lg transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}>
            <div className="flex flex-col p-4 space-y-4">
              <Link 
                to="/games" 
                className={`nav-link text-lg ${location.pathname === '/games' ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                بازی‌ها
              </Link>
              <Link 
                to="/leaderboard" 
                className={`nav-link text-lg ${location.pathname === '/leaderboard' ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                جدول امتیازات
              </Link>
              {user?.role === 'admin' && (
                <Link 
                  to="/admin" 
                  className={`nav-link text-lg ${location.pathname.startsWith('/admin') ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  پنل مدیریت
                </Link>
              )}
            </div>
          </div>

          {user ? (
            <div className="user-menu">
              <button 
                className="user-menu-button"
                onClick={toggleUserMenu}
              >
                <span>{user.username}</span>
                <svg 
                  className={`w-4 h-4 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isUserMenuOpen && (
                <div className="user-menu-dropdown">
                  <Link to="/profile" className="user-menu-item" onClick={() => setIsUserMenuOpen(false)}>
                    پروفایل
                  </Link>
                  <button onClick={handleLogout} className="user-menu-item logout">
                    خروج
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="nav-link">
              ورود
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header; 