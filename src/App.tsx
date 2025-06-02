import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AnimatedBackground from './components/AnimatedBackground';
import MediaShowcase from './components/MediaShowcase';
import { AuthProvider } from './contexts/AuthContext';
import { useEffect } from 'react';
import { supabase } from './lib/supabase';

function App() {
  useEffect(() => {
    // Disable scroll chaining on mobile
    document.body.style.overscrollBehavior = 'none';
    
    // Add passive scroll listener for better performance
    const handleScroll = () => {
      // This empty function is needed for passive scroll listener
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Handle auth callback
    const handleAuthCallback = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting session:', error);
        return;
      }
      
      if (session) {
        // If we have a session, we're authenticated
        // You can add any post-authentication logic here
        console.log('User authenticated:', session.user.email);
      }
    };

    handleAuthCallback();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <AuthProvider>
      <div className="min-h-screen relative scroll-container">
        <AnimatedBackground />
        <div className="relative z-20">
          <Navbar />
          <Hero />
          <MediaShowcase />
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;