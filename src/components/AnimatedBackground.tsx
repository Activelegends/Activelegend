import { motion } from 'framer-motion';

const shapes = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  size: Math.random() * 600 + 300,
  x: Math.random() * 100,
  y: Math.random() * 100,
  duration: Math.random() * 30 + 25,
  delay: Math.random() * 8,
  color: i % 3 === 0 ? 'from-primary/30 to-purple-500/20' :
         i % 3 === 1 ? 'from-blue-500/20 to-primary/30' :
                       'from-purple-500/20 to-blue-500/20'
}));

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none bg-gradient-to-b from-black via-black/90 to-primary/10">
      {/* Animated shapes */}
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className={`absolute rounded-full bg-gradient-to-r ${shape.color} blur-[100px]`}
          style={{
            width: shape.size,
            height: shape.size,
            left: `${shape.x}%`,
            top: `${shape.y}%`,
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [0.8, 1.4, 0.8],
            opacity: [0.3, 0.5, 0.3],
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
        className="absolute inset-0 opacity-[0.02] mix-blend-overlay animate-pulse-slow"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          transform: 'translate3d(0, 0, 0)'
        }}
      />
      
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/60 to-black pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent opacity-50" />
    </div>
  );
}