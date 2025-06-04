import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AnimatedBackground from './components/AnimatedBackground';
import MediaShowcase from './components/MediaShowcase';
import GamesSection from './components/GamesSection';
import { AuthProvider } from './contexts/AuthContext';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    // Disable scroll chaining on mobile
    document.body.style.overscrollBehavior = 'none';
    
    // Add passive scroll listener for better performance
    const handleScroll = () => {
      // This empty function is needed for passive scroll listener
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    
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
          <GamesSection />
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;