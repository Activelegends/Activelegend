import { motion } from 'framer-motion';
import ScrollIndicator from './ScrollIndicator';
import { useState } from 'react';
import AuthModal from './AuthModal';

export default function Hero() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [initialAuthMode, setInitialAuthMode] = useState(true);

  const handleAuthClick = (isLogin: boolean) => {
    setInitialAuthMode(isLogin);
    setIsAuthModalOpen(true);
  };

  return (
    <header className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/80 to-black/95"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center max-w-4xl mx-auto px-4"
      >
        <motion.img
          src={import.meta.env.BASE_URL + 'AE-logo.png'}
          alt="Active Legends"
          className="w-32 h-32 mx-auto mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 1 }}
        />
        
        <motion.h1
          className="text-5xl md:text-6xl font-bold mb-4 text-white bg-clip-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          به دنیای اکتیو لجندز خوش آمدید
        </motion.h1>
        
        <motion.p
          className="text-xl md:text-2xl mb-8 text-gray-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          توسعه‌دهنده بازی‌های موبایل و کامپیوتر
        </motion.p>
        
        <motion.div
          className="space-x-4 space-x-reverse"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <motion.button
            className="btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleAuthClick(false)}
          >
            ثبت‌نام
          </motion.button>
          <motion.button
            className="btn-secondary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleAuthClick(true)}
          >
            ورود
          </motion.button>
        </motion.div>
      </motion.div>
      
      <ScrollIndicator />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={initialAuthMode}
      />
    </header>
  );
}