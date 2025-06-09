import { motion } from 'framer-motion';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AnimatedBackground from './components/AnimatedBackground';
import MediaShowcase from './components/MediaShowcase';
import { Games } from './pages/Games';
import { GameDetail } from './pages/GameDetail';
import NotFound from './pages/NotFound';
import { AuthProvider } from './contexts/AuthContext';
import { useEffect } from 'react';
import { MyGames } from './pages/MyGames';
import TermsAndConditionsPage from './pages/TermsAndConditions';
import TermsManagement from './pages/admin/TermsManagement';

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
    <Router>
      <AuthProvider>
        <div className="min-h-screen relative scroll-container">
          <AnimatedBackground />
          <div className="relative z-20">
            <Navbar />
            <Routes>
              <Route path="/" element={
                <>
                  <Hero />
                  <MediaShowcase />
                </>
              } />
              <Route path="/games" element={<Games />} />
              <Route path="/games/:slug" element={<GameDetail />} />
              <Route path="/my-games" element={<MyGames />} />
              <Route path="/terms" element={<TermsAndConditionsPage />} />
              <Route path="/admin/terms" element={<TermsManagement />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;