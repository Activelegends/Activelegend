import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AnimatedBackground from './components/AnimatedBackground';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-black relative">
        <AnimatedBackground />
        <div className="relative z-10">
          <Navbar />
          <Hero />
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;