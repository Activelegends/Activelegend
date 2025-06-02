import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import UserMenu from './UserMenu';
import AuthModal from './AuthModal';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAuthClick = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const headerOffset = 80; // ارتفاع هدر
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
          isScrolled ? 'backdrop-blur-md bg-black/50 py-4' : 'py-6'
        }`}
        style={{
          willChange: 'transform',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          perspective: '1000px'
        }}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          <motion.img
            src={import.meta.env.BASE_URL + 'AE-logo.png'}
            alt="Active Legends"
            className="h-8 w-auto"
            whileHover={{ scale: 1.05 }}
          />
          <div className="flex items-center gap-8">
            <a href="#about" onClick={(e) => handleNavClick(e, 'about')} className="nav-link">درباره ما</a>
            <a href="#games" onClick={(e) => handleNavClick(e, 'games')} className="nav-link">بازی‌ها</a>
            <a href="#gallery" onClick={(e) => handleNavClick(e, 'gallery')} className="nav-link">گالری تصاویر</a>
            <a href="#contact" onClick={(e) => handleNavClick(e, 'contact')} className="nav-link">تماس</a>
            {user ? (
              <UserMenu />
            ) : (
              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-secondary"
                  onClick={() => handleAuthClick('login')}
                >
                  ورود
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary"
                  onClick={() => handleAuthClick('signup')}
                >
                  ثبت‌نام
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </motion.nav>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />
    </>
  );
}