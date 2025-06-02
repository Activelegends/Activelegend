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
        // Get the session from the URL hash
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (session) {
          // Clear the URL hash and update the URL
          window.history.replaceState(
            null,
            '',
            window.location.pathname
          );
          
          // Redirect to dashboard
          navigate('/dashboard', { replace: true });
        } else {
          // If no session, redirect to home
          navigate('/', { replace: true });
        }
      } catch (error) {
        console.error('خطا در پردازش احراز هویت:', error);
        navigate('/', { replace: true });
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-white text-lg">در حال پردازش احراز هویت...</p>
      </div>
    </div>
  );
} 