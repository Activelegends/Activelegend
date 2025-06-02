import { createContext, useContext, useEffect, useState } from 'react';
import { type User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // بررسی توکن در URL
    const handleAuthCallback = async () => {
      try {
        const hash = window.location.hash;
        if (hash) {
          console.log('دریافت هش از URL:', hash);
          const params = new URLSearchParams(hash.substring(1));
          const accessToken = params.get('access_token');
          const refreshToken = params.get('refresh_token');
          
          if (accessToken && refreshToken) {
            console.log('توکن‌ها در URL یافت شدند');
            const { data: { session }, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            });
            
            if (error) {
              console.error('خطا در تنظیم سشن:', error);
              throw error;
            }
            
            console.log('سشن با موفقیت تنظیم شد:', session);
            setUser(session?.user ?? null);
            setIsAdmin(session?.user?.email === 'active.legendss@gmail.com');
            
            // پاک کردن هش از URL
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        }
      } catch (error) {
        console.error('خطا در مدیریت ریدایرکت:', error);
      }
    };

    // اجرای تابع در لود اولیه
    handleAuthCallback();

    // بررسی سشن اولیه
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('بررسی سشن اولیه:', session);
      setUser(session?.user ?? null);
      setIsAdmin(session?.user?.email === 'active.legendss@gmail.com');
      setIsLoading(false);
    });

    // گوش دادن به تغییرات احراز هویت
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('تغییر وضعیت احراز هویت:', _event, session);
      setUser(session?.user ?? null);
      setIsAdmin(session?.user?.email === 'active.legendss@gmail.com');
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log('تلاش برای ورود با ایمیل:', email);
      const { error, data } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error('خطا در ورود:', error.message);
        throw error;
      }
      console.log('ورود موفقیت‌آمیز:', data);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log('تلاش برای ثبت‌نام با ایمیل:', email);
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) {
        console.error('خطا در ثبت‌نام:', error.message);
        throw error;
      }
      console.log('ثبت‌نام موفقیت‌آمیز:', data);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      console.log('تلاش برای خروج');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('خطا در خروج:', error.message);
        throw error;
      }
      console.log('خروج موفقیت‌آمیز');
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      console.log('شروع فرآیند ورود با گوگل');
      const { error, data } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}${window.location.pathname}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      if (error) {
        console.error('خطا در ورود با گوگل:', error.message);
        throw error;
      }
      console.log('درخواست ورود با گوگل ارسال شد:', data);
    } catch (error) {
      console.error('خطای کلی در ورود با گوگل:', error);
      if (error instanceof Error) {
        if (error.message.includes('popup_closed_by_user')) {
          throw new Error('ورود با گوگل لغو شد');
        } else if (error.message.includes('popup_blocked')) {
          throw new Error('پاپ‌آپ مسدود شده است. لطفاً مسدودکننده پاپ‌آپ را غیرفعال کنید');
        } else {
          throw new Error('خطا در ورود با گوگل. لطفاً دوباره تلاش کنید');
        }
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, isLoading, signIn, signUp, signOut, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}