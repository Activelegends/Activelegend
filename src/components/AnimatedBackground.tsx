import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";

const shapes = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  size: 150 + Math.random() * 100,
  baseX: 10 + i * 8,
  baseY: 30 + (i % 3) * 15,
  color: ["#FACC15", "#FBBF24", "#F59E0B"][i % 3],  // رنگ‌های طلایی روشن‌تر
  duration: 20 + Math.random() * 10,
  delay: Math.random() * 5,
}));

export default function AnimatedBackground() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-gradient-to-br from-amber-900 via-orange-900 to-amber-900">
      {shapes.map(({ id, size, baseX, baseY, color, duration, delay }, i) => {
        const moveX = useTransform(mouseX, [0, 1], [-15 + i * 3, 15 - i * 3]);
        const moveY = useTransform(mouseY, [0, 1], [-10 + i * 2, 10 - i * 2]);

        return (
          <motion.div
            key={id}
            style={{
              width: size,
              height: size,
              left: `${baseX}%`,
              top: `${baseY}%`,
              backgroundColor: color,
              borderRadius: "50%",
              position: "absolute",
              filter: "blur(12px)",
              opacity: 0.7,
              boxShadow: `0 0 30px ${color}`,
              mixBlendMode: "screen",
              x: moveX,
              y: moveY,
            }}
            initial={{ opacity: 0.5, scale: 1 }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </div>
  );
}
