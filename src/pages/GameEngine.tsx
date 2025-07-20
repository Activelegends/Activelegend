import React, { useState } from 'react';
import { motion } from 'framer-motion';
// import logo from '../assets/AE-logo.svg'; // Uncomment and adjust path if logo exists

const MODES = [
  { key: 'online', label: 'آنلاین' },
  { key: 'offline', label: 'آفلاین' },
];

export default function GameEngine() {
  const [mode, setMode] = useState<'online' | 'offline' | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center px-4 py-8">
      <motion.header
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: 'spring' }}
        className="w-full max-w-2xl flex flex-col items-center mb-12"
      >
        <div className="flex flex-col items-center gap-2 w-full">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl px-8 py-6 flex flex-col items-center w-full">
            {/* <img src={logo} alt="ActiveLegend Logo" className="w-14 h-14 mb-2" /> */}
            <span className="text-3xl md:text-4xl font-extrabold text-white tracking-tight drop-shadow mb-2 animate-pulse">ActiveLegend Game</span>
            <span className="text-base text-blue-200/80 font-medium mb-4">موتور بازی ۲بعدی تحت وب</span>
            <div className="flex gap-4 mt-2">
              {MODES.map((m) => (
                <motion.button
                  key={m.key}
                  onClick={() => setMode(m.key as 'online' | 'offline')}
                  whileHover={{ scale: 1.08, boxShadow: '0 4px 24px #3b82f6aa' }}
                  whileTap={{ scale: 0.97 }}
                  className={`px-6 py-2 rounded-xl font-bold text-base transition-all duration-200 focus:outline-none shadow-md border-2 ${mode === m.key ? 'bg-blue-600/90 text-white border-blue-400 shadow-blue-400/40' : 'bg-white/10 text-blue-100 border-white/20 hover:bg-blue-500/80 hover:text-white'}`}
                >
                  {m.label}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </motion.header>
      <motion.main
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full max-w-2xl flex flex-col items-center"
      >
        {!mode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-gray-300 text-lg mt-12"
          >
            لطفاً حالت بازی را انتخاب کنید.
          </motion.div>
        )}
        {mode === 'online' && (
          <div className="text-center text-blue-400 text-xl mt-12">حالت آنلاین (در مراحل بعدی پیاده‌سازی می‌شود)</div>
        )}
        {mode === 'offline' && (
          <div className="text-center text-green-400 text-xl mt-12">حالت آفلاین (در مراحل بعدی پیاده‌سازی می‌شود)</div>
        )}
      </motion.main>
    </div>
  );
} 