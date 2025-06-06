import { createContext, useContext, useEffect, useState } from 'react';
import { type User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const BASE_URL = 'https://activelegends.github.io/Activelegend';
const CALLBACK_URL = `${BASE_URL}/auth/callback`;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // بررسی توکن در URL
    const handleAuthCallback = async () => {
      try {
        const hash = window.location.hash;
        const search = window.location.search;
        
        console.log('URL Hash:', hash);
        console.log('URL Search:', search);

        // بررسی پارامترهای URL
        const params = new URLSearchParams(hash.substring(1) || search.substring(1));
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        const type = params.get('type');
        
        console.log('Token Type:', type);
        console.log('Access Token Present:', !!accessToken);
        console.log('Refresh Token Present:', !!refreshToken);

        if (accessToken && refreshToken) {
          console.log('تنظیم سشن با توکن‌های دریافتی');
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
          
          // پاک کردن پارامترها از URL
          const cleanUrl = window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);
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
    });

    // گوش دادن به تغییرات احراز هویت
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('تغییر وضعیت احراز هویت:', _event, session);
      setUser(session?.user ?? null);
      setIsAdmin(session?.user?.email === 'active.legendss@gmail.com');
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: CALLBACK_URL,
      },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const signInWithGoogle = async () => {
    try {
      console.log('شروع فرآیند ورود با گوگل');
      console.log('Redirect URL:', CALLBACK_URL);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: CALLBACK_URL,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      
      if (error) {
        console.error('خطا در فراخوانی OAuth:', error);
        throw error;
      }
      
      console.log('درخواست OAuth با موفقیت ارسال شد');
    } catch (error) {
      console.error('خطا در ورود با گوگل:', error);
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
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, signIn, signUp, signOut, signInWithGoogle, logout }}>
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