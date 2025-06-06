import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX } from 'react-icons/hi';
import { supabase } from '../lib/supabase';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen || isProfileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen, isProfileMenuOpen]);

  useEffect(() => {
    async function fetchAvatar() {
      if (user?.avatar_path) {
        const { data } = await supabase
          .storage
          .from('avatars')
          .getPublicUrl(user.avatar_path);
        setAvatarUrl(data.publicUrl);
      }
    }
    fetchAvatar();
  }, [user?.avatar_path]);

  const handleSignOut = async () => {
    await signOut();
    setIsProfileMenuOpen(false);
    navigate('/');
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    
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

  const navLinks = [
    { href: '#about', onClick: (e: React.MouseEvent<HTMLAnchorElement>) => handleNavClick(e, 'about'), text: 'درباره ما' },
    { to: '/games', text: 'بازی‌ها' },
    { href: '#gallery', onClick: (e: React.MouseEvent<HTMLAnchorElement>) => handleNavClick(e, 'gallery'), text: 'ویترین' },
    { href: '#contact', onClick: (e: React.MouseEvent<HTMLAnchorElement>) => handleNavClick(e, 'contact'), text: 'تماس' },
  ];

  if (user) {
    navLinks.splice(2, 0, { to: '/my-games', text: 'موارد دلخواه' });
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'backdrop-blur-md bg-[#111111]/90' : 'bg-[#111111]'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0" onClick={() => setIsMobileMenuOpen(false)}>
            <img src="/logo.png" alt="Active Legend" className="h-8 md:h-10" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link, index) => (
              link.to ? (
                <Link
                  key={index}
                  to={link.to}
                  className={`text-gray-100 hover:text-amber-500 transition-colors duration-200 ${
                    location.pathname === link.to ? 'text-amber-500' : ''
                  }`}
                >
                  {link.text}
                </Link>
              ) : (
                <a
                  key={index}
                  href={link.href}
                  onClick={link.onClick}
                  className="text-gray-100 hover:text-amber-500 transition-colors duration-200"
                >
                  {link.text}
                </a>
              )
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-100 p-2 rounded-lg hover:bg-gray-800 transition-colors duration-200"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <HiX className="w-6 h-6" />
            ) : (
              <HiMenu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-[#111111] border-t border-gray-800"
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              {navLinks.map((link, index) => (
                link.to ? (
                  <Link
                    key={index}
                    to={link.to}
                    className={`block px-4 py-3 text-gray-100 hover:bg-gray-800 rounded-lg transition-colors duration-200 ${
                      location.pathname === link.to ? 'text-amber-500' : ''
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.text}
                  </Link>
                ) : (
                  <a
                    key={index}
                    href={link.href}
                    onClick={link.onClick}
                    className="block px-4 py-3 text-gray-100 hover:bg-gray-800 rounded-lg transition-colors duration-200"
                  >
                    {link.text}
                  </a>
                )
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}