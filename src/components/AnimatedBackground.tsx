import { motion } from 'framer-motion';

const shapes = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  size: Math.random() * 1000 + 500,
  x: Math.random() * 100,
  y: Math.random() * 100,
  duration: Math.random() * 50 + 40,
  delay: Math.random() * 15,
  color: i % 3 === 0 ? 'from-primary/30 to-amber-700/20' :
         i % 3 === 1 ? 'from-amber-900/20 to-primary/30' :
                       'from-orange-800/20 to-amber-600/20'
}));

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-10">
      {/* Base background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-amber-950 to-black" />
      
      {/* Animated shapes */}
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className={`absolute rounded-full bg-gradient-to-r ${shape.color} blur-[200px]`}
          style={{
            width: shape.size,
            height: shape.size,
            left: `${shape.x}%`,
            top: `${shape.y}%`,
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            x: [0, 200, 0],
            y: [0, 150, 0],
            scale: [0.8, 1.8, 0.8],
            opacity: [0.2, 0.4, 0.2],
            rotate: [0, 360, 0],
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
        className="absolute inset-0 opacity-[0.15] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          transform: 'translate3d(0, 0, 0)'
        }}
      />
      
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/50 to-black pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent opacity-60" />
      
      {/* Animated particles */}
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 bg-white/10 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -200],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: Math.random() * 4 + 3,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
}