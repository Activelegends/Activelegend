import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";

const shapes = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  size: 150 + Math.random() * 100,      // سایز بین 150 تا 250 پیکسل
  baseX: 20 + i * 7,                    // موقعیت پایه افقی درصدی
  baseY: 30 + (i % 3) * 15,             // موقعیت پایه عمودی درصدی
  color: ['from-red-400 to-yellow-400', 'from-blue-400 to-cyan-400', 'from-pink-400 to-purple-400'][i % 3],
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
        // تبدیل حرکت موس به جابجایی X و Y برای هر شکل
        const moveX = useTransform(mouseX, [0, 1], [-15 + i * 3, 15 - i * 3]);
        const moveY = useTransform(mouseY, [0, 1], [-10 + i * 2, 10 - i * 2]);

        return (
          <motion.div
            key={id}
            className={`absolute rounded-full bg-gradient-to-r ${color} blur-[40px] opacity-60`}
            style={{
              width: size,
              height: size,
              left: `${baseX}%`,
              top: `${baseY}%`,
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
