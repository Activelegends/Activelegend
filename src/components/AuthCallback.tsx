import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the current URL
        const currentUrl = window.location.href;
        
        // If we have a hash in the URL, we need to handle the auth callback
        if (currentUrl.includes('#')) {
          // Let Supabase handle the auth callback
          const { error } = await supabase.auth.getSession();
          if (error) throw error;
          
          // Clear the URL hash to remove the tokens
          window.history.replaceState(null, '', window.location.pathname);
        }
        
        // Redirect to home page after successful authentication
        navigate('/', { replace: true });
      } catch (error) {
        console.error('خطا در احراز هویت:', error);
        // Redirect to home page even if there's an error
        navigate('/', { replace: true });
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-white text-lg">در حال انتقال به صفحه اصلی...</p>
      </div>
    </div>
  );
} 