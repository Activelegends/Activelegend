import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import UserMenu from './UserMenu';
import AuthModal from './AuthModal';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
          isScrolled ? 'backdrop-blur-md bg-black/50 py-4' : 'py-6'
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          <motion.img
            src="/logo.svg"
            alt="Active Legends"
            className="h-10"
            whileHover={{ scale: 1.05 }}
          />
          <div className="flex items-center gap-8">
            <a href="#about" className="nav-link">درباره ما</a>
            <a href="#games" className="nav-link">بازی‌ها</a>
            <a href="#contact" className="nav-link">تماس</a>
            {user ? (
              <UserMenu />
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary"
                onClick={() => setIsAuthModalOpen(true)}
              >
                شروع کنید
              </motion.button>
            )}
          </div>
        </div>
      </motion.nav>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
}