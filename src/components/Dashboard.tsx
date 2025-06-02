import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (session) {
          setUser(session.user);
        } else {
          console.log("کاربر وارد نشده است");
          navigate('/');
        }
      } catch (error) {
        console.error('خطا در دریافت اطلاعات کاربر:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-white text-lg">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">پنل کاربری</h1>
        {user && (
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              {user.user_metadata?.avatar_url && (
                <img
                  src={user.user_metadata.avatar_url}
                  alt="تصویر پروفایل"
                  className="w-16 h-16 rounded-full"
                />
              )}
              <div>
                <h2 className="text-xl font-semibold">
                  {user.user_metadata?.full_name || user.email}
                </h2>
                <p className="text-gray-400">{user.email}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 