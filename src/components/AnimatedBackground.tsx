import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const COLORS = ["#FACC15", "#FBBF24", "#F59E0B"];

function getRandomShapes(count) {
  return Array.from({ length: count }).map(() => ({
    id: crypto.randomUUID(),
    size: 150 + Math.random() * 100,
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    parallax: 10 + Math.random() * 30,
    controller: useAnimation(),
  }));
}

export default function ParallaxShapes() {
  const shapeCount = 5;
  const [shapes, setShapes] = useState(() => getRandomShapes(shapeCount));
  const mouse = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  const [offsets, setOffsets] = useState(
    shapes.map(() => ({ x: 0, y: 0 }))
  );

  // حرکت موس
  useEffect(() => {
    const handleMouseMove = (e) => {
      const mx = e.clientX;
      const my = e.clientY;

      const newOffsets = shapes.map((shape) => {
        const dx = (mx - window.innerWidth / 2) / shape.parallax;
        const dy = (my - window.innerHeight / 2) / shape.parallax;
        return {
          x: -dx,
          y: -dy,
        };
      });

      setOffsets(newOffsets);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [shapes]);

  // پالس دائمی برای ایجاد تپش و حرکت دائمی
  useEffect(() => {
    shapes.forEach((shape) => {
      const pulse = () => {
        shape.controller
          .start({
            scale: [1, 1.05, 1],
            transition: {
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            },
          });
      };
      pulse();
    });
  }, [shapes]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-gradient-to-br from-amber-950 via-orange-950 to-amber-950 pointer-events-none">
      {shapes.map((shape, i) => (
        <motion.div
          key={shape.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: shape.size,
            height: shape.size,
            top: 0,
            left: 0,
            background: `radial-gradient(circle at center, ${shape.color} 0%, transparent 80%)`,
            filter: "blur(80px)",
            opacity: 0.4,
          }}
          animate={{
            x: shape.x + offsets[i]?.x,
            y: shape.y + offsets[i]?.y,
          }}
          transition={{ duration: 0.3 }}
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          // pulse
          {...shape.controller}
        />
      ))}
    </div>
  );
}
