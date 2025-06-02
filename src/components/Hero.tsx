import { motion } from 'framer-motion';
import ScrollIndicator from './ScrollIndicator';
import { useState } from 'react';
import AuthModal from './AuthModal';
import { useAuth } from '../contexts/AuthContext';

export default function Hero() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const { user } = useAuth();

  const handleAuthClick = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  // تنظیمات انیمیشن برای موبایل و دسکتاپ
  const isMobile = window.innerWidth < 640;
  const animationConfig = {
    initial: { opacity: 0, y: isMobile ? 10 : 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: isMobile ? 0.5 : 0.8 }
  };

  return (
    <header className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/80 to-black/95"></div>
      
      <motion.div
        {...animationConfig}
        className="relative z-10 text-center max-w-4xl mx-auto px-4"
      >
        <motion.img
          src="/Activelegend/AE-logo.png"
          alt="Active Legends"
          className="w-40 h-40 sm:w-64 sm:h-64 md:w-80 md:h-80 mx-auto mb-8"
          initial={{ scale: isMobile ? 0.8 : 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: isMobile ? "tween" : "spring",
            duration: isMobile ? 0.5 : 1 
          }}
        />
        
        <motion.h1
          className="text-5xl md:text-6xl font-bold mb-4 text-white bg-clip-text"
          {...animationConfig}
          transition={{ ...animationConfig.transition, delay: isMobile ? 0.1 : 0.3 }}
        >
          به دنیای اکتیو لجندز خوش آمدید
        </motion.h1>
        
        <motion.p
          className="text-xl md:text-2xl mb-8 text-gray-300"
          {...animationConfig}
          transition={{ ...animationConfig.transition, delay: isMobile ? 0.2 : 0.5 }}
        >
          توسعه‌دهنده بازی‌های موبایل و کامپیوتر
        </motion.p>
        
        {!user && (
          <motion.div
            className="space-x-4 space-x-reverse"
            {...animationConfig}
            transition={{ ...animationConfig.transition, delay: isMobile ? 0.3 : 0.7 }}
          >
            <motion.button
              className="btn-primary"
              whileHover={{ scale: isMobile ? 1.02 : 1.05 }}
              whileTap={{ scale: isMobile ? 0.98 : 0.95 }}
              onClick={() => handleAuthClick('signup')}
            >
              ثبت‌نام
            </motion.button>
            <motion.button
              className="btn-secondary"
              whileHover={{ scale: isMobile ? 1.02 : 1.05 }}
              whileTap={{ scale: isMobile ? 0.98 : 0.95 }}
              onClick={() => handleAuthClick('login')}
            >
              ورود
            </motion.button>
          </motion.div>
        )}
      </motion.div>
      
      <ScrollIndicator />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />
    </header>
  );
}