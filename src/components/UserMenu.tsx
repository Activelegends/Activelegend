import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { HiUser, HiCog, HiLogout } from 'react-icons/hi';
import { supabase } from '../lib/supabase';

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchAvatar = async () => {
      if (user?.user_metadata?.avatar_url) {
        setAvatarUrl(user.user_metadata.avatar_url);
      } else if (user?.id) {
        try {
          const { data } = await supabase
            .storage
            .from('avatars')
            .getPublicUrl(`${user.id}/avatar`);

          if (data?.publicUrl) {
            setAvatarUrl(data.publicUrl);
          }
        } catch (error) {
          console.error('Error fetching avatar:', error);
        }
      }
    };

    fetchAvatar();
  }, [user]);

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-gray-100 hover:text-yellow-400 transition-colors"
        aria-label="User menu"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover border-2 border-yellow-400"
            onError={() => setAvatarUrl(null)}
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold">
            {user?.email?.[0].toUpperCase() || 'U'}
          </div>
        )}
        <span className="hidden md:inline text-sm">{user?.email}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-[#222222] rounded-lg shadow-lg py-2 z-50">
          <Link
            to="/profile"
            className="flex items-center gap-2 px-4 py-2 text-gray-100 hover:bg-gray-700 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <HiUser className="w-5 h-5" />
            <span>پروفایل</span>
          </Link>
          <Link
            to="/settings"
            className="flex items-center gap-2 px-4 py-2 text-gray-100 hover:bg-gray-700 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <HiCog className="w-5 h-5" />
            <span>تنظیمات</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-gray-100 hover:bg-gray-700 transition-colors text-right"
          >
            <HiLogout className="w-5 h-5" />
            <span>خروج</span>
          </button>
        </div>
      )}
    </div>
  );
}