import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useEffect } from 'react';

const SHAPE_COUNT = 12;

const generateShapes = () => {
  return Array.from({ length: SHAPE_COUNT }, (_, i) => ({
    id: i,
    size: Math.random() * 200 + 200,
    left: `${Math.random() * 80 + 10}%`,
    top: `${Math.random() * 80 + 10}%`,
    duration: Math.random() * 20 + 20,
    delay: Math.random() * 5,
    color: [
      'from-primary/30 to-amber-700/20',
      'from-amber-800/30 to-primary/30',
      'from-orange-700/20 to-amber-600/20'
    ][i % 3],
  }));
};

const shapes = generateShapes();

export default function AnimatedBackground() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const parallaxX = useTransform(mouseX, [0, window.innerWidth], [-10, 10]);
  const parallaxY = useTransform(mouseY, [0, window.innerHeight], [-10, 10]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="fixed inset-0 overflow-hidden z-[-1] pointer-events-none"
      style={{ x: parallaxX, y: parallaxY }}
    >
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-800 via-orange-800 to-amber-800" />

      {/* Floating blurry shapes */}
      {shapes.map(shape => (
        <motion.div
          key={shape.id}
          className={`absolute rounded-full bg-gradient-to-r ${shape.color} blur-[80px]`}
          style={{
            width: shape.size,
            height: shape.size,
            left: shape.left,
            top: shape.top,
          }}
          initial={{ opacity: 0.3, scale: 1 }}
          animate={{
            x: [0, 20, -20, 0],
            y: [0, -15, 15, 0],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: shape.duration,
            delay: shape.delay,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      ))}

      {/* SVG noise layer */}
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-soft-light"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          transform: 'translate3d(0,0,0)',
        }}
      />

      {/* Soft radial overlays */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-amber-800/30 to-amber-800" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent opacity-50" />
    </motion.div>
  );
}
