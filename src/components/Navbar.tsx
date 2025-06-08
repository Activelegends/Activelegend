import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HiMenu, HiX } from 'react-icons/hi';
import { supabase } from '../lib/supabase';
import AuthModal from './AuthModal';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  useEffect(() => {
    if (menuRef.current) {
      if (isMobileMenuOpen) {
        menuRef.current.classList.remove('hidden');
      } else {
        menuRef.current.classList.add('hidden');
      }
    }
  }, [isMobileMenuOpen]);

  const handleAuthClick = () => {
    setIsAuthModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    setIsProfileMenuOpen(false);
    navigate('/');
  };

  const handleGalleryClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    
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

  const renderNavLinks = () => {
    const links = [
      { href: '#about', onClick: (e: React.MouseEvent<HTMLAnchorElement>) => handleNavClick(e, 'about'), text: 'درباره ما' },
      { to: '/games', text: 'بازی‌ها' },
      { href: '#gallery', onClick: handleGalleryClick, text: 'ویترین' },
      { href: '#contact', onClick: (e: React.MouseEvent<HTMLAnchorElement>) => handleNavClick(e, 'contact'), text: 'تماس' },
    ];

    if (user) {
      links.splice(2, 0, { to: '/my-games', text: 'موارد دلخواه' });
    }

    return links.map((link, index) => (
      link.to ? (
        <Link
          key={index}
          to={link.to}
          className={`block px-4 py-2 text-gray-100 hover:bg-gray-700 md:p-0 md:hover:bg-transparent ${
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
          className={`block px-4 py-2 text-gray-100 hover:bg-gray-700 md:p-0 md:hover:bg-transparent ${
            location.pathname === link.href ? 'text-amber-500' : ''
          }`}
        >
          {link.text}
        </a>
      )
    ));
  };

  return (
    <>
      <nav
        className={`fixed top-0 right-0 left-0 w-full bg-[#111111] text-gray-100 z-50 transition-all duration-300 ${
          isScrolled ? 'backdrop-blur-md bg-[#111111]/90 py-2' : 'py-4'
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
            <img
              src="/logo.png"
              alt="Active Legend"
              className="h-8 md:h-10"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {renderNavLinks()}
          </div>

          {/* Auth Buttons / Profile */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover border-2 border-gray-600 z-50"
                      style={{ opacity: 1, display: 'block' }}
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                      <span className="text-gray-300 text-sm">
                        {user.email?.[0]?.toUpperCase()}
                      </span>
                    </div>
                  )}
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-100 hover:bg-gray-700"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      پروفایل
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-right px-4 py-2 text-sm text-gray-100 hover:bg-gray-700"
                    >
                      خروج
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleAuthClick}
                  className="text-gray-100 hover:text-amber-500 transition-colors"
                >
                  ورود
                </button>
                <button
                  onClick={handleAuthClick}
                  className="bg-amber-500 text-gray-900 px-4 py-2 rounded-md hover:bg-amber-600 transition-colors"
                >
                  ثبت نام
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white p-2"
              onClick={() => setIsMobileMenuOpen((v) => !v)}
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
        <div ref={menuRef} className="md:hidden hidden bg-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {renderNavLinks()}
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}
    </>
  );
}