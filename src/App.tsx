import { motion } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AnimatedBackground from './components/AnimatedBackground';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

function App() {
  return (
    <div className="min-h-screen bg-white relative">
      <AnimatedBackground />
      <div className="relative z-10">
        <Navbar />
        <Hero />
      </div>
    </div>
  );
}

export default App;