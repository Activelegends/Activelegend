import { motion } from 'framer-motion';

const SHAPE_COUNT = 12;

const generateShapes = () => {
  return Array.from({ length: SHAPE_COUNT }, (_, i) => ({
    id: i,
    size: Math.random() * 400 + 300, // محدودتر برای تعادل بصری
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    duration: Math.random() * 20 + 20, // نرم‌تر و کندتر
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
  return (
    <div className="fixed inset-0 overflow-hidden z-[-1] pointer-events-none">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-950 via-orange-950 to-amber-950" />

      {/* Floating blurry shapes */}
      {shapes.map(shape => (
        <motion.div
          key={shape.id}
          className={`absolute rounded-full bg-gradient-to-r ${shape.color} blur-[100px]`}
          style={{
            width: shape.size,
            height: shape.size,
            left: shape.left,
            top: shape.top,
          }}
          initial={{ opacity: 0.4, scale: 1 }}
          animate={{
            x: [0, 30, -30, 0],
            y: [0, -20, 20, 0],
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.6, 0.4]
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
        className="absolute inset-0 opacity-[0.1] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          transform: 'translate3d(0,0,0)',
        }}
      />

      {/* Soft radial overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-amber-950/30 to-amber-950" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent opacity-60" />
    </div>
  );
}
