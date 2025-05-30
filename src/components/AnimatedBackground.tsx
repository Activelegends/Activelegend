import { motion } from 'framer-motion';

const shapes = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  size: Math.random() * 400 + 200,
  x: Math.random() * 100,
  y: Math.random() * 100,
  duration: Math.random() * 25 + 20,
  delay: Math.random() * 5,
  color: i % 3 === 0 ? 'from-primary/20 to-purple-500/10' :
         i % 3 === 1 ? 'from-blue-500/10 to-primary/20' :
                       'from-purple-500/10 to-blue-500/10'
}));

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none bg-gradient-to-b from-black via-black/95 to-primary/5">
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className={`absolute rounded-full bg-gradient-to-r ${shape.color} blur-3xl`}
          style={{
            width: shape.size,
            height: shape.size,
            left: `${shape.x}%`,
            top: `${shape.y}%`,
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [0.8, 1.2, 0.8],
            opacity: [0.2, 0.3, 0.2],
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
        className="absolute inset-0 opacity-[0.015] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          transform: 'translate3d(0, 0, 0)'
        }}
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/50 to-black pointer-events-none" />
    </div>
  );
}