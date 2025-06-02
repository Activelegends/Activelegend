import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

// Get the base URL for GitHub Pages
const getBaseUrl = () => {
  // Check if we're in development
  if (window.location.hostname === 'localhost') {
    return window.location.origin;
  }
  // For GitHub Pages
  return 'https://activelegends.github.io/Activelegend';
};

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the hash from the URL
        const hash = window.location.hash;
        
        if (hash) {
          // Parse the hash parameters
          const params = new URLSearchParams(hash.substring(1));
          const accessToken = params.get('access_token');
          const refreshToken = params.get('refresh_token');
          
          if (accessToken && refreshToken) {
            // Set the session using the tokens
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
            
            if (error) throw error;
            
            // Clear the URL hash and update the URL
            const baseUrl = getBaseUrl();
            window.history.replaceState(null, '', `${baseUrl}/#/auth/callback`);
          }
        }

        // Get the current session to verify authentication
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        
        if (session) {
          // Redirect to dashboard after successful authentication
          navigate('/dashboard', { replace: true });
        } else {
          // If no session, redirect to home
          navigate('/', { replace: true });
        }
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
        <p className="text-white text-lg">در حال انتقال به پنل کاربری...</p>
      </div>
    </div>
  );
} 