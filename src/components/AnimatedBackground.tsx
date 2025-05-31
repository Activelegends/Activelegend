import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";

const SHAPES_COUNT = 3;
const COLORS = [
  "rgba(255, 191, 0, 0.25)",  // Gold Amber
  "rgba(255, 94, 0, 0.25)",   // Soft Orange
  "rgba(255, 255, 255, 0.08)" // Subtle white
];

function getRandomPosition(size: number) {
  return {
    x: Math.random() * (window.innerWidth - size),
    y: Math.random() * (window.innerHeight - size),
  };
}

function createShapes() {
  return Array.from({ length: SHAPES_COUNT }).map((_, i) => {
    const size = 300 + Math.random() * 150;
    const initial = getRandomPosition(size);
    return {
      id: i,
      size,
      x: initial.x,
      y: initial.y,
      color: COLORS[i % COLORS.length],
      controller: useAnimation(),
    };
  });
}

export default function ElegantFloatingCircles() {
  const [shapes, setShapes] = useState(() => createShapes());

  useEffect(() => {
    shapes.forEach((shape) => {
      const animate = () => {
        const target = getRandomPosition(shape.size);
        shape.controller
          .start({
            x: target.x,
            y: target.y,
            transition: {
              duration: 12 + Math.random() * 8,
              ease: "easeInOut",
            },
          })
          .then(animate);
      };
      animate();
    });
  }, [shapes]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-black pointer-events-none">
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          initial={{ x: shape.x, y: shape.y }}
          animate={shape.controller}
          className="absolute rounded-full"
          style={{
            width: shape.size,
            height: shape.size,
            background: `radial-gradient(circle at center, ${shape.color}, transparent 70%)`,
            filter: "blur(80px)",
            boxShadow: `0 0 160px ${shape.color}`,
            opacity: 0.5,
          }}
        />
      ))}

      {/* optional noise or gradient overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/60 to-black pointer-events-none" />
    </div>
  );
}
