import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface UserAvatarProps {
  size?: 'small' | 'medium' | 'large';
  showName?: boolean;
  className?: string;
}

export function UserAvatar({ size = 'medium', showName = true, className = '' }: UserAvatarProps) {
  const { user } = useAuth();
  const [userData, setUserData] = useState<{
    avatar_url: string | null;
    full_name: string | null;
  } | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const { data: { user: userData }, error } = await supabase.auth.getUser();
          if (error) throw error;
          
          setUserData({
            avatar_url: userData?.user_metadata?.avatar_url || null,
            full_name: userData?.user_metadata?.full_name || null
          });
        } catch (error) {
          console.error('خطا در دریافت اطلاعات کاربر:', error);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-10 h-10',
    large: 'w-12 h-12'
  };

  const avatarUrl = userData?.avatar_url || '/images/default-avatar.svg';
  const displayName = userData?.full_name || 'مهمان';

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img
        src={avatarUrl}
        alt={displayName}
        className={`${sizeClasses[size]} rounded-full object-cover border-2 border-gray-200`}
      />
      {showName && (
        <span className="text-sm font-medium text-gray-700">
          {displayName}
        </span>
      )}
    </div>
  );
} 