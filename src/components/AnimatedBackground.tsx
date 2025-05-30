import { motion } from 'framer-motion';

const shapes = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  size: Math.random() * 800 + 400,
  x: Math.random() * 100,
  y: Math.random() * 100,
  duration: Math.random() * 40 + 30,
  delay: Math.random() * 10,
  color: i % 4 === 0 ? 'from-primary/50 to-amber-700/40' :
         i % 4 === 1 ? 'from-amber-900/40 to-primary/50' :
         i % 4 === 2 ? 'from-orange-800/40 to-amber-600/40' :
                       'from-amber-600/40 to-orange-800/40'
}));

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-10">
      {/* Base background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-950 via-orange-950 to-amber-950" />
      
      {/* Animated shapes */}
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className={`absolute rounded-full bg-gradient-to-r ${shape.color} blur-[150px]`}
          style={{
            width: shape.size,
            height: shape.size,
            left: `${shape.x}%`,
            top: `${shape.y}%`,
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            x: [0, 150, 0],
            y: [0, 100, 0],
            scale: [0.8, 1.6, 0.8],
            opacity: [0.3, 0.7, 0.3],
            rotate: [0, 180, 0],
          }}
          transition={{
            duration: shape.duration,
            delay: shape.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
      
      {/* Noise overlay */}
      <div 
        className="absolute inset-0 opacity-[0.2] mix-blend-overlay animate-pulse-slow"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          transform: 'translate3d(0, 0, 0)'
        }}
      />
      
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-amber-950/50 to-amber-950 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent opacity-80" />
      
      {/* Animated particles */}
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 bg-white/20 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
}