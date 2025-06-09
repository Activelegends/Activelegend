import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const BASE_URL = 'https://activelegends.github.io/Activelegend';
const CALLBACK_URL = `${BASE_URL}/auth/callback`;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

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
          setSession(session);
          
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
      setSession(session);
      setLoading(false);
    });

    // گوش دادن به تغییرات احراز هویت
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('تغییر وضعیت احراز هویت:', _event, session);
      setUser(session?.user ?? null);
      setSession(session);
      setLoading(false);
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

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};