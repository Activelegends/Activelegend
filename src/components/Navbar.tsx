import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import UserMenu from './UserMenu';
import AuthModal from './AuthModal';
import { HiMenu, HiX } from 'react-icons/hi';
import { supabase } from '../lib/supabase';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
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

  const handleAuthClick = (mode: 'login' | 'signup') => {
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
      // اگر در صفحه اصلی نیستیم، اول به صفحه اصلی برویم
      navigate('/');
      // یک تایمر کوتاه برای اطمینان از لود شدن صفحه اصلی
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
      // اگر در صفحه اصلی هستیم، مستقیماً به گالری اسکرول کنیم
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
<<<<<<< HEAD
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
=======
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
>>>>>>> parent of 2ce310d (بهینه سازی هدر)
  };

  return (
    <>
<<<<<<< HEAD
      <nav
        className={`w-full bg-[#111111] text-gray-100 z-50 transition-all duration-300 ${
          isScrolled ? 'backdrop-blur-md bg-[#111111]/90' : ''
=======
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
          isScrolled ? 'backdrop-blur-md bg-black/50 py-2' : 'py-4'
>>>>>>> parent of b95f66a (تغییرات جدید برای هدر)
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
<<<<<<< HEAD

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {renderNavLinks()}
          </div>

<<<<<<< HEAD
          {/* Auth Buttons / Profile */}
          <div className="flex items-center space-x-4">
=======
          <div className="flex items-center gap-8">
            <a href="#about" onClick={(e) => handleNavClick(e, 'about')} className="nav-link">درباره ما</a>
            <Link to="/games" className="nav-link">بازی‌ها</Link>
            <a href="#gallery" onClick={handleGalleryClick} className="nav-link">گالری تصاویر</a>
            <a href="#contact" onClick={(e) => handleNavClick(e, 'contact')} className="nav-link">تماس</a>
>>>>>>> parent of 2ce310d (بهینه سازی هدر)
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
                      className="w-8 h-8 rounded-full object-cover border-2 border-gray-600"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                      <span className="text-gray-300 text-sm">
                        {user.email?.[0].toUpperCase()}
                      </span>
                    </div>
                  )}
                </button>
=======
          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <HiX className="w-6 h-6" />
            ) : (
              <HiMenu className="w-6 h-6" />
            )}
          </button>
        </div>
>>>>>>> parent of b95f66a (تغییرات جدید برای هدر)

                {/* Profile Dropdown */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#111111] backdrop-blur-md rounded-lg shadow-lg py-2 z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-100 hover:bg-gray-700"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      پروفایل
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-gray-100 hover:bg-gray-700"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      تنظیمات
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-right px-4 py-2 text-gray-100 hover:bg-gray-700"
                    >
                      خروج
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={() => handleAuthClick('login')}
                  className="hidden md:block text-gray-100 hover:text-amber-500"
                >
                  ورود
                </button>
                <button
                  onClick={() => handleAuthClick('signup')}
                  className="hidden md:block bg-amber-500 text-black px-4 py-2 rounded-lg hover:bg-amber-600"
                >
                  ثبت نام
                </button>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-gray-100 focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#111111] backdrop-blur-md absolute top-full left-0 right-0 z-50">
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              {renderNavLinks()}
              {!user && (
                <>
                  <button
                    onClick={() => handleAuthClick('login')}
                    className="text-gray-100 hover:text-amber-500 text-right"
                  >
                    ورود
                  </button>
                  <button
                    onClick={() => handleAuthClick('signup')}
                    className="bg-amber-500 text-black px-4 py-2 rounded-lg hover:bg-amber-600 text-right"
                  >
                    ثبت نام
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Add padding to main content to prevent overlap */}
      <div className="h-16 md:h-20" />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
}