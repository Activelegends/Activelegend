import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";

const shapes = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  size: 150 + Math.random() * 100,
  baseX: 10 + i * 8,
  baseY: 30 + (i % 3) * 15,
  // استفاده از رنگ‌های ساده بدون گرادینت برای تست
  color: ["#FF6B6B", "#4ECDC4", "#556270"][i % 3],
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
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-gradient-to-br from-amber-800 via-orange-800 to-amber-800">
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
              backgroundColor: color,  // اینجا رنگ مستقیم استفاده شده
              borderRadius: "50%",
              position: "absolute",
              filter: "blur(20px)", // blur کمتر برای دید بهتر
              opacity: 0.6,
              x: moveX,
              y: moveY,
            }}
            initial={{ opacity: 0.3, scale: 1 }}
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.3, 0.5, 0.3],
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
