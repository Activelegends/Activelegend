import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const COLORS = ["#FACC15", "#FBBF24", "#F59E0B"];

function getRandomShapes(count) {
  return Array.from({ length: count }).map(() => ({
    id: crypto.randomUUID(),
    size: 160 + Math.random() * 120,
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    parallax: 10 + Math.random() * 25,
    controller: useAnimation(),
  }));
}

export default function ParallaxInteractiveShapes() {
  const shapeCount = 6;
  const [shapes, setShapes] = useState(() => getRandomShapes(shapeCount));
  const mouse = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  const [offsets, setOffsets] = useState(
    shapes.map(() => ({ x: 0, y: 0 }))
  );

  // حرکت معکوس موس (Parallax)
  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };

      const newOffsets = shapes.map((shape) => {
        const dx = (e.clientX - window.innerWidth / 2) / shape.parallax;
        const dy = (e.clientY - window.innerHeight / 2) / shape.parallax;
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

  // کلیک => جهش شکل‌ها به سمت موقعیت موس
  useEffect(() => {
    const handleClick = (e) => {
      shapes.forEach((shape) => {
        shape.controller.start({
          x: e.clientX - shape.size / 2,
          y: e.clientY - shape.size / 2,
          transition: { duration: 0.7, ease: "easeOut" },
        });
      });
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
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
            background: `radial-gradient(circle at center, ${shape.color}, transparent 70%)`,
            top: 0,
            left: 0,
            opacity: 0.4,
            filter: "blur(45px)",
            boxShadow: `0 0 120px ${shape.color}`,
          }}
          initial={{
            x: shape.x,
            y: shape.y,
          }}
          animate={{
            x: shape.x + offsets[i]?.x,
            y: shape.y + offsets[i]?.y,
            ...shape.controller,
          }}
          transition={{ duration: 0.3 }}
        />
      ))}
    </div>
  );
}
