import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabaseClient';
// نیازی به ایمپورت supabase در اینجا نیست زیرا اطلاعات کاربر از AuthContext می‌آید
// import { supabase } from '../lib/supabase';

interface UserAvatarProps {
  size?: 'small' | 'medium' | 'large';
  showName?: boolean;
  className?: string;
}

export function UserAvatar({ size = 'medium', showName = true, className = '' }: UserAvatarProps) {
  const { user } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAvatar() {
      if (!user?.id) {
        setAvatarUrl('/images/default-avatar.svg');
        setIsLoading(false);
        return;
      }

      try {
        const { data: { publicUrl }, error } = await supabase
          .storage
          .from('avatars')
          .getPublicUrl(`${user.id}/avatar`);

        if (error) {
          console.error('Error fetching avatar:', error);
          setAvatarUrl('/images/default-avatar.svg');
        } else {
          setAvatarUrl(publicUrl);
        }
      } catch (error) {
        console.error('Error in avatar fetch:', error);
        setAvatarUrl('/images/default-avatar.svg');
      } finally {
        setIsLoading(false);
      }
    }

    fetchAvatar();
  }, [user?.id]);

  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-10 h-10',
    large: 'w-12 h-12'
  };

  // دسترسی مستقیم به اطلاعات کاربر از شیء user
  const displayName = user?.user_metadata?.full_name || 'مهمان';

  // لاگ‌های دیباگ قبلی حذف شدند
  // console.log('آواتار نهایی:', avatarUrl);
  // console.log('نام نهایی:', displayName);
  // console.log('Rendering UserAvatar. User status:', !!user);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {isLoading ? (
        <div className={`${sizeClasses[size]} rounded-full bg-gray-700 animate-pulse`} />
      ) : (
        <img
          src={avatarUrl || '/images/default-avatar.svg'}
          alt={displayName}
          className={`${sizeClasses[size]} rounded-full object-cover border-2 border-gray-600 z-50 relative`}
          onError={(e) => {
            console.error('Error loading avatar image');
            e.currentTarget.src = '/images/default-avatar.svg';
          }}
        />
      )}
      {showName && (
        <span className="text-sm font-medium text-gray-300">
          {displayName}
        </span>
      )}
    </div>
  );
} 