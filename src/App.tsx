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
import { useEffect, useState } from 'react';
import { MyGames } from './pages/MyGames';
import TermsAndConditionsPage from './pages/TermsAndConditions';
import TermsManagement from './pages/admin/TermsManagement';
import './styles/admin.css';
import { Footer } from './components/Footer';
import DownloadPage from './pages/Download';
import DownloadLinksAdmin from './pages/admin/DownloadLinksAdmin';
import Contact from './pages/Contact';

function App() {
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    // Disable scroll chaining on mobile
    document.body.style.overscrollBehavior = 'none';
    
    // Add passive scroll listener for better performance
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const windowHeight = window.innerHeight;
      const bodyHeight = document.body.scrollHeight;
      // Show footer if user is at (or very near) the bottom
      setShowFooter(scrollY + windowHeight >= bodyHeight - 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once on mount in case already at bottom
    handleScroll();
    
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
              <Route path="/admin/download-links" element={<DownloadLinksAdmin />} />
              <Route path="/download/:id" element={<DownloadPage />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          {showFooter && (
            <div className="fixed bottom-0 left-0 w-full z-50">
              <Footer />
            </div>
          )}
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;