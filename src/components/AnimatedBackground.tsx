import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const COLORS = [
  "#FACC15", // زرد روشن
  "#FBBF24", // زرد متوسط
  "#F59E0B", // نارنجی
  "#D97706", // نارنجی تیره
  "#B45309", // نارنجی سوخته
];

interface Shape {
  id: string;
  size: number;
  x: number;
  y: number;
  color: string;
  parallax: number;
  rotation: number;
  scale: number;
}

// Detect mobile device (simple width check)
function isMobile() {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 640;
}

function getRandomShapes(count: number, mobile: boolean): Shape[] {
  return Array.from({ length: count }).map(() => ({
    id: crypto.randomUUID(),
    size: mobile ? 120 + Math.random() * 100 : 200 + Math.random() * 250, // کوچکتر برای موبایل
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    parallax: mobile ? 1 : 15 + Math.random() * 20, // بدون پارالاکس در موبایل
    rotation: Math.random() * 360,
    scale: 1 + Math.random() * 0.5,
  }));
}

export default function ParallaxShapes() {
  const mobile = isMobile();
  // کمتر و ساده‌تر برای موبایل
  const shapeCount = mobile ? 2 : 5;
  const [shapes, setShapes] = useState<Shape[]>(() => getRandomShapes(shapeCount, mobile));
  const mouse = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [offsets, setOffsets] = useState(shapes.map(() => ({ x: 0, y: 0 })));

  // Mouse parallax only on desktop
  useEffect(() => {
    if (mobile) return;
    const handleMouseMove = (e: MouseEvent) => {
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
  }, [shapes, mobile]);

  // Animation loop: slower and less frequent on mobile
  useEffect(() => {
    const interval = setInterval(() => {
      setShapes((prevShapes) =>
        prevShapes.map((shape) => ({
          ...shape,
          rotation: (shape.rotation + (mobile ? 0.5 : 2)) % 360, // کندتر در موبایل
          scale: 1 + Math.sin(Date.now() / (mobile ? 1200 : 500) + shape.id.charCodeAt(0)) * (mobile ? 0.12 : 0.3), // دامنه کمتر
        }))
      );
    }, mobile ? 80 : 30); // فریم کمتر در موبایل
    return () => clearInterval(interval);
  }, [mobile]);

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
            opacity: mobile ? 0.25 : 0.5, // شفاف‌تر در موبایل
            filter: mobile ? "blur(10px)" : "blur(25px)", // بلور کمتر
            mixBlendMode: "screen",
          }}
          animate={{
            x: shape.x + (offsets[i]?.x || 0),
            y: shape.y + (offsets[i]?.y || 0),
            rotate: shape.rotation,
            scale: shape.scale,
          }}
          transition={{
            duration: mobile ? 0.4 : 0.2, // کندتر
            ease: "linear",
          }}
        />
      ))}
      {/* افکت درخشش بسیار سبک‌تر در موبایل */}
      <div className={mobile
        ? "absolute inset-0 bg-gradient-to-br from-transparent via-amber-500/10 to-transparent"
        : "absolute inset-0 bg-gradient-to-br from-transparent via-amber-500/20 to-transparent animate-pulse"
      } />
    </div>
  );
}
