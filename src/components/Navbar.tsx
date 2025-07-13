import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import UserMenu from './UserMenu';
import { AuthModal } from './AuthModal';
import { supabase } from '../lib/supabaseClient';
import { aparatApi } from '../lib/aparatApi';
import { HiMenu, HiX } from 'react-icons/hi';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }
    setSearchLoading(true);
    setSearchError(null);
    setShowDropdown(true);
    try {
      // Search games by title/description
      const { data: games, error: gamesError } = await supabase
        .from('games')
        .select('*')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .eq('is_visible', true)
        .limit(20);
      if (gamesError) throw gamesError;
      // Search all games for content_blocks
      const { data: allGames, error: allGamesError } = await supabase
        .from('games')
        .select('*')
        .eq('is_visible', true);
      if (allGamesError) throw allGamesError;
      const lowerQuery = query.toLowerCase();
      const contentBlockMatches = (allGames || []).filter(g =>
        Array.isArray(g.content_blocks) && g.content_blocks.some((block: any) =>
          (block.content && block.content.toLowerCase().includes(lowerQuery)) ||
          (block.caption && block.caption.toLowerCase().includes(lowerQuery))
        )
      );
      // Merge and deduplicate
      const allGameResults = [...(games || [])];
      contentBlockMatches.forEach(match => {
        if (!allGameResults.find(g => g.id === match.id)) {
          allGameResults.push(match);
        }
      });
      // Limit to 10 results
      const finalGames = allGameResults.slice(0, 10);
      // Search videos (Aparat)
      let videos: any[] = [];
      try {
        const aparatRes = await aparatApi.searchVideos(query, 1, 5);
        if (Array.isArray(aparatRes)) {
          videos = aparatRes;
        } else if (Array.isArray((aparatRes as any)?.included)) {
          videos = (aparatRes as any).included;
        } else if (Array.isArray((aparatRes as any)?.data)) {
          videos = (aparatRes as any).data;
        } else {
          videos = [];
        }
      } catch (e) {
        // ignore aparat error
      }
      setSearchResults([
        { type: 'games', items: finalGames },
        { type: 'videos', items: videos }
      ]);
    } catch (err: any) {
      setSearchError('خطا در جستجو.');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      handleSearch(e.target.value);
    }, 500);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    handleSearch(search);
  };

  const renderNavLinks = () => {
    if (location.pathname === '/') {
      return (
        <>
          <a href="#about" onClick={(e) => handleNavClick(e, 'about')} className="nav-link">درباره ما</a>
          <Link to="/games" className="nav-link">بازی‌ها</Link>
          {user && <Link to="/my-games" className="nav-link">بازی‌های من</Link>}
          <a href="#gallery" onClick={handleGalleryClick} className="nav-link">ویترین</a>
          <a href="#contact" onClick={(e) => handleNavClick(e, 'contact')} className="nav-link">تماس</a>
        </>
      );
    } else if (location.pathname.startsWith('/games')) {
      return (
        <>
          <Link to="/" className="nav-link">صفحه اصلی</Link>
          <Link to="/games" className="nav-link">بازی‌ها</Link>
          {user && <Link to="/my-games" className="nav-link">بازی‌های من</Link>}
          <a href="#gallery" onClick={handleGalleryClick} className="nav-link">ویترین</a>
          <a href="#contact" onClick={(e) => handleNavClick(e, 'contact')} className="nav-link">تماس</a>
        </>
      );
    }
    return (
      <>
        <Link to="/" className="nav-link">صفحه اصلی</Link>
        <Link to="/games" className="nav-link">بازی‌ها</Link>
        {user && <Link to="/my-games" className="nav-link">بازی‌های من</Link>}
        <a href="#gallery" onClick={handleGalleryClick} className="nav-link">ویترین</a>
        <a href="#contact" onClick={(e) => handleNavClick(e, 'contact')} className="nav-link">تماس</a>
      </>
    );
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
        <div className="container mx-auto px-4 flex items-center justify-between gap-4">
          <Link to="/">
            <motion.img
              src={import.meta.env.BASE_URL + 'AE-logo.png'}
              alt="Active Legends"
              className="h-8 w-auto"
              whileHover={{ scale: 1.05 }}
            />
          </Link>
          {/* Desktop Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md mx-4 hidden lg:block">
            <input
              type="text"
              className="w-full bg-black/60 border border-white/10 rounded-xl py-2.5 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              placeholder="جستجو در سایت..."
              value={search}
              onChange={handleInputChange}
              onFocus={() => search && setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              dir="rtl"
            />
            <button type="submit" className="absolute left-2 top-1/2 -translate-y-1/2 text-primary hover:text-white transition-colors">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m1.35-5.15a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </button>
            {showDropdown && (
              <div className="absolute right-0 left-0 mt-2 bg-black/95 border border-white/10 rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto">
                {searchLoading && <div className="p-4 text-center text-gray-400">در حال جستجو...</div>}
                {searchError && <div className="p-4 text-center text-red-400">{searchError}</div>}
                {!searchLoading && !searchError && searchResults.length === 0 && (
                  <div className="p-4 text-center text-gray-400">نتیجه‌ای یافت نشد.</div>
                )}
                {!searchLoading && !searchError && searchResults.map((group, idx) => (
                  <div key={group.type} className="border-b border-white/5 last:border-b-0">
                    <div className="px-4 py-2 text-xs text-primary font-bold">
                      {group.type === 'games' ? 'بازی‌ها' : group.type === 'videos' ? 'ویدیوها' : ''}
                    </div>
                    {group.items.length === 0 ? (
                      <div className="px-4 py-2 text-gray-500 text-xs">موردی یافت نشد.</div>
                    ) : (
                      group.items.map((item: any) => (
                        <Link
                          key={item.id || item.uid || item.slug}
                          to={group.type === 'games' ? `/games/${item.slug}` : item.url || item.link || '#'}
                          target={group.type === 'videos' ? '_blank' : undefined}
                          className="block px-4 py-2 hover:bg-primary/10 text-sm text-white transition-colors rounded-lg"
                          onClick={() => setShowDropdown(false)}
                        >
                          {group.type === 'games' ? (
                            <>
                              <span className="font-bold">{item.title}</span>
                              <span className="text-xs text-gray-400 ml-2">{item.description?.slice(0, 40)}...</span>
                            </>
                          ) : (
                            <>
                              <span className="font-bold">{item.title || item.name}</span>
                              <span className="text-xs text-gray-400 ml-2">{item.description?.slice(0, 40) || ''}</span>
                            </>
                          )}
                        </Link>
                      ))
                    )}
                  </div>
                ))}
              </div>
            )}
          </form>
          {/* Hamburger Icon for Mobile */}
          <button
            className="lg:hidden flex items-center justify-center p-2 rounded-md text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="باز کردن منو"
            type="button"
          >
            <HiMenu className="w-8 h-8" />
          </button>
          {/* Desktop Nav/User */}
          <div className="hidden lg:flex items-center gap-8">
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
        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-[999] bg-black flex flex-col lg:hidden">
            <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                <img src={import.meta.env.BASE_URL + 'AE-logo.png'} alt="Active Legends" className="h-8 w-auto" />
              </Link>
              <button
                className="p-2 rounded-md text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="بستن منو"
                type="button"
              >
                <HiX className="w-8 h-8" />
              </button>
            </div>
            {/* Mobile Search Bar */}
            <form onSubmit={handleSearchSubmit} className="relative p-4 border-b border-white/10">
              <input
                type="text"
                className="w-full bg-black/60 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                placeholder="جستجو در سایت..."
                value={search}
                onChange={handleInputChange}
                onFocus={() => search && setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                dir="rtl"
              />
              <button type="submit" className="absolute left-6 top-1/2 -translate-y-1/2 text-primary hover:text-white transition-colors">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m1.35-5.15a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              </button>
              {showDropdown && (
                <div className="absolute right-0 left-0 mt-2 bg-black/95 border border-white/10 rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto">
                  {searchLoading && <div className="p-4 text-center text-gray-400">در حال جستجو...</div>}
                  {searchError && <div className="p-4 text-center text-red-400">{searchError}</div>}
                  {!searchLoading && !searchError && searchResults.length === 0 && (
                    <div className="p-4 text-center text-gray-400">نتیجه‌ای یافت نشد.</div>
                  )}
                  {!searchLoading && !searchError && searchResults.map((group, idx) => (
                    <div key={group.type} className="border-b border-white/5 last:border-b-0">
                      <div className="px-4 py-2 text-xs text-primary font-bold">
                        {group.type === 'games' ? 'بازی‌ها' : group.type === 'videos' ? 'ویدیوها' : ''}
                      </div>
                      {group.items.length === 0 ? (
                        <div className="px-4 py-2 text-gray-500 text-xs">موردی یافت نشد.</div>
                      ) : (
                        group.items.map((item: any) => (
                          <Link
                            key={item.id || item.uid || item.slug}
                            to={group.type === 'games' ? `/games/${item.slug}` : item.url || item.link || '#'}
                            target={group.type === 'videos' ? '_blank' : undefined}
                            className="block px-4 py-2 hover:bg-primary/10 text-sm text-white transition-colors rounded-lg"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {group.type === 'games' ? (
                              <>
                                <span className="font-bold">{item.title}</span>
                                <span className="text-xs text-gray-400 ml-2">{item.description?.slice(0, 40)}...</span>
                              </>
                            ) : (
                              <>
                                <span className="font-bold">{item.title || item.name}</span>
                                <span className="text-xs text-gray-400 ml-2">{item.description?.slice(0, 40) || ''}</span>
                              </>
                            )}
                          </Link>
                        ))
                      )}
                    </div>
                  ))}
                </div>
              )}
            </form>
            {/* Mobile Nav Links */}
            <nav className="flex flex-col gap-2 p-4">
              {renderNavLinks()}
            </nav>
            {/* Mobile Auth/User */}
            <div className="flex flex-col gap-4 p-4 mt-auto">
              {user ? (
                <UserMenu />
              ) : (
                <>
                  <button
                    className="btn-secondary w-full"
                    onClick={() => { setMobileMenuOpen(false); handleAuthClick('login'); }}
                  >
                    ورود
                  </button>
                  <button
                    className="btn-primary w-full"
                    onClick={() => { setMobileMenuOpen(false); handleAuthClick('signup'); }}
                  >
                    ثبت‌نام
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </motion.nav>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />
    </>
  );
}