import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const COLORS = ["#FACC15", "#FBBF24", "#F59E0B"];

function getRandomShapes(count) {
  return Array.from({ length: count }).map(() => ({
    id: crypto.randomUUID(),
    size: 150 + Math.random() * 100,
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    parallax: 10 + Math.random() * 30, // شدت حرکت معکوس نسبت به موس
  }));
}

export default function ParallaxShapes() {
  const shapeCount = 5;
  const [shapes, setShapes] = useState(() => getRandomShapes(shapeCount));
  const mouse = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  const [offsets, setOffsets] = useState(
    shapes.map(() => ({ x: 0, y: 0 }))
  );

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

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-gradient-to-br from-amber-950 via-orange-950 to-amber-950 pointer-events-none">
      {shapes.map((shape, i) => (
        <motion.div
          key={shape.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: shape.size,
            height: shape.size,
            backgroundColor: shape.color,
            top: 0,
            left: 0,
            opacity: 0.25,
            filter: "blur(60px)",
          }}
          animate={{
            x: shape.x + offsets[i]?.x,
            y: shape.y + offsets[i]?.y,
          }}
          transition={{ duration: 0.3 }}
        />
      ))}
    </div>
  );
}
