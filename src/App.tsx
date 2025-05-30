import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AnimatedBackground from './components/AnimatedBackground';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen relative">
        <AnimatedBackground />
        <div className="relative z-20">
          <Navbar />
          <Hero />
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;