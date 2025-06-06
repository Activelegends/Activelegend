import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';
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
    window.addEventListener('scroll', handleScroll, { passive: true });
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
        try {
          const { data } = await supabase
            .storage
            .from('avatars')
            .getPublicUrl(user.avatar_path);
          setAvatarUrl(data.publicUrl);
        } catch (error) {
          console.error('Error fetching avatar:', error);
        }
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

  const renderNavLinks = () => (
    <>
      <Link
        to="/"
        className={`block px-4 py-2 text-gray-100 hover:bg-gray-800 md:p-0 md:hover:bg-transparent ${
          location.pathname === '/' ? 'text-amber-500' : ''
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        خانه
      </Link>
      <Link
        to="/games"
        className={`block px-4 py-2 text-gray-100 hover:bg-gray-800 md:p-0 md:hover:bg-transparent ${
          location.pathname === '/games' ? 'text-amber-500' : ''
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        بازی‌ها
      </Link>
      <Link
        to="/about"
        className={`block px-4 py-2 text-gray-100 hover:bg-gray-800 md:p-0 md:hover:bg-transparent ${
          location.pathname === '/about' ? 'text-amber-500' : ''
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        درباره ما
      </Link>
    </>
  );

  return (
    <>
      <nav
        className={`w-full z-50 transition-all duration-300 ${
          isScrolled ? 'backdrop-blur-md bg-black/90' : 'bg-black'
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between h-16 md:h-20">
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
                  className="profile-menu-button"
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

                {/* Profile Dropdown */}
                {isProfileMenuOpen && (
                  <div className="profile-menu-dropdown">
                    <Link
                      to="/profile"
                      className="profile-menu-item"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      پروفایل
                    </Link>
                    <Link
                      to="/settings"
                      className="profile-menu-item"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      تنظیمات
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="profile-menu-item w-full text-right"
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
                  className="hidden md:block btn-primary"
                >
                  ثبت نام
                </button>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="mobile-menu-button"
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
          <div className="mobile-menu-dropdown">
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
                    className="btn-primary w-full text-right"
                  >
                    ثبت نام
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
}