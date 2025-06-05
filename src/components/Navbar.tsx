import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import UserMenu from './UserMenu';
import AuthModal from './AuthModal';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 100], [0, -100]);
  const springY = useSpring(y, {
    stiffness: 100,
    damping: 30,
    mass: 0.5
  });

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

  const handleGalleryClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const galleryElement = document.getElementById('gallery');
        if (galleryElement) {
          const headerOffset = 80;
          const elementPosition = galleryElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    } else {
      const galleryElement = document.getElementById('gallery');
      if (galleryElement) {
        const headerOffset = 80;
        const elementPosition = galleryElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          const headerOffset = 80;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    } else {
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  const renderNavLinks = () => {
    if (location.pathname === '/') {
      return (
        <>
          <a href="#about" onClick={(e) => handleNavClick(e, 'about')} className="nav-link">درباره ما</a>
          <Link to="/games" className="nav-link">بازی‌ها</Link>
          <a href="#gallery" onClick={handleGalleryClick} className="nav-link">گالری تصاویر</a>
          <a href="#contact" onClick={(e) => handleNavClick(e, 'contact')} className="nav-link">تماس</a>
        </>
      );
    } else if (location.pathname.startsWith('/games')) {
      return (
        <>
          <Link to="/" className="nav-link">صفحه اصلی</Link>
          <Link to="/games" className="nav-link">بازی‌ها</Link>
          <a href="#gallery" onClick={handleGalleryClick} className="nav-link">گالری تصاویر</a>
          <a href="#contact" onClick={(e) => handleNavClick(e, 'contact')} className="nav-link">تماس</a>
        </>
      );
    }
    return (
      <>
        <Link to="/" className="nav-link">صفحه اصلی</Link>
        <Link to="/games" className="nav-link">بازی‌ها</Link>
        <a href="#gallery" onClick={handleGalleryClick} className="nav-link">گالری تصاویر</a>
        <a href="#contact" onClick={(e) => handleNavClick(e, 'contact')} className="nav-link">تماس</a>
      </>
    );
  };

  return (
    <>
      <motion.nav
        style={{
          y: springY,
          willChange: 'transform',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          perspective: '1000px'
        }}
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
          isScrolled ? 'backdrop-blur-md bg-black/50 py-4' : 'py-6'
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link to="/">
            <motion.img
              src={import.meta.env.BASE_URL + 'AE-logo.png'}
              alt="Active Legends"
              className="h-8 w-auto"
              whileHover={{ scale: 1.05 }}
            />
          </Link>
          <div className="flex items-center gap-8">
            {renderNavLinks()}
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