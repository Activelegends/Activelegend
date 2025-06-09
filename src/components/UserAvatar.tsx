import React from 'react';
import { useAuth } from '../contexts/AuthContext';
// نیازی به ایمپورت supabase در اینجا نیست زیرا اطلاعات کاربر از AuthContext می‌آید
// import { supabase } from '../lib/supabase';

interface UserAvatarProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ size = 'md', className = '' }) => {
  const { user, session } = useAuth();
  // نیازی به state جداگانه برای userData نیست
  // const [userData, setUserData] = useState<{
  //   avatar_url: string | null;
  //   full_name: string | null;
  // } | null>(null);

  // این useEffect دیگر نیازی به فراخوانی getUser() ندارد
  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     if (user) {
  //       try {
  //         console.log('دریافت اطلاعات کاربر از useAuth:', user);
  //         // const { data: { user: userData }, error } = await supabase.auth.getUser();
          
  //         // if (error) {
  //         //   console.error('خطا در دریافت اطلاعات کاربر:', error);
  //         //   throw error;
  //         // }
          
  //         // console.log('اطلاعات کاربر دریافت شد:', userData);
  //         // console.log('آواتار:', userData?.user_metadata?.avatar_url);
  //         // console.log('نام:', userData?.user_metadata?.full_name);
          
  //         // setUserData({
  //         //   avatar_url: userData?.user_metadata?.avatar_url || null,
  //         //   full_name: userData?.user_metadata?.full_name || null
  //         // });
  //       } catch (error) {
  //         console.error('خطا در پردازش اطلاعات کاربر:', error);
  //       }
  //     } else {
  //       console.log('کاربر لاگین نکرده است');
  //     }
  //   };

  //   fetchUserData();
  // }, [user]);

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-8 h-8';
      case 'lg':
        return 'w-12 h-12';
      default:
        return 'w-10 h-10';
    }
  };

  const getAvatarUrl = () => {
    if (user?.profile_image_url) {
      return user.profile_image_url;
    }
    if (session?.user?.user_metadata?.avatar_url) {
      return session.user.user_metadata.avatar_url;
    }
    if (session?.user?.user_metadata?.picture) {
      return session.user.user_metadata.picture;
    }
    return '/images/default-avatar.png';
  };

  // دسترسی مستقیم به اطلاعات کاربر از شیء user
  const avatarUrl = getAvatarUrl();
  const displayName = user?.display_name || 'کاربر';

  // لاگ‌های دیباگ قبلی حذف شدند
  // console.log('آواتار نهایی:', avatarUrl);
  // console.log('نام نهایی:', displayName);
  // console.log('Rendering UserAvatar. User status:', !!user);

  return (
    <img
      src={avatarUrl}
      alt={displayName}
      className={`${getSizeClasses()} rounded-full object-cover ${className}`}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.src = '/images/default-avatar.png';
      }}
    />
  );
}; 