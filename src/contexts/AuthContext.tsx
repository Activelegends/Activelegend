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
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsAdmin(session?.user?.email === 'active.legendss@gmail.com');
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
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
      console.log('تلاش برای ورود با گوگل');
      const { error, data } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
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