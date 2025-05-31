import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const COLORS = [
  "rgba(250, 204, 21, 0.4)", // yellow
  "rgba(251, 191, 36, 0.35)", // amber
  "rgba(249, 115, 22, 0.35)", // orange
  "rgba(255, 255, 255, 0.05)", // subtle light
];

const SHAPE_COUNT = 7;

function createShapes() {
  return Array.from({ length: SHAPE_COUNT }).map(() => {
    const size = 180 + Math.random() * 120;
    return {
      id: crypto.randomUUID(),
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      controller: useAnimation(),
    };
  });
}

function getRandomPosition(size) {
  return {
    x: Math.random() * (window.innerWidth - size),
    y: Math.random() * (window.innerHeight - size),
  };
}

export default function FancyBackground() {
  const [shapes, setShapes] = useState(() => createShapes());

  useEffect(() => {
    const animateShape = (shape) => {
      const nextPos = getRandomPosition(shape.size);
      shape.controller.start({
        x: nextPos.x,
        y: nextPos.y,
        transition: {
          duration: 10 + Math.random() * 10,
          ease: "easeInOut",
        },
      }).then(() => {
        animateShape(shape);
      });
    };

    shapes.forEach(animateShape);
  }, [shapes]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-gradient-to-br from-amber-950 via-orange-950 to-amber-950 pointer-events-none">
      {/* glowing animated shapes */}
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: shape.size,
            height: shape.size,
            background: `radial-gradient(circle at center, ${shape.color}, transparent 70%)`,
            filter: "blur(70px)",
            opacity: 0.5,
            boxShadow: `0 0 150px ${shape.color}`,
          }}
          animate={shape.controller}
          initial={{ x: shape.x, y: shape.y }}
        />
      ))}

      {/* gradient overlay layer */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-amber-950/30 to-black opacity-70 pointer-events-none mix-blend-screen" />

      {/* optional noise texture */}
      <div
        className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' /%3E%3C/svg%3E")`,
          backgroundSize: "cover",
          transform: "translate3d(0,0,0)",
        }}
      />
    </div>
  );
}
