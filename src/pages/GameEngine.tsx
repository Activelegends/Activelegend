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
        className="w-full max-w-2xl flex items-center justify-between mb-12"
      >
        <div className="flex items-center gap-3">
          {/* <img src={logo} alt="ActiveLegend Logo" className="w-12 h-12" /> */}
          <span className="text-2xl font-extrabold text-white tracking-tight drop-shadow">ActiveLegend Game</span>
        </div>
        <div className="flex gap-2">
          {MODES.map((m) => (
            <button
              key={m.key}
              onClick={() => setMode(m.key as 'online' | 'offline')}
              className={`px-4 py-2 rounded-xl font-bold text-sm transition-all duration-200 focus:outline-none ${mode === m.key ? 'bg-blue-600 text-white' : 'bg-white/10 text-gray-200 hover:bg-blue-500/80 hover:text-white'}`}
            >
              {m.label}
            </button>
          ))}
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