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

function getRandomShapes(count: number): Shape[] {
  return Array.from({ length: count }).map(() => ({
    id: crypto.randomUUID(),
    size: 200 + Math.random() * 200, // افزایش سایز برای وضوح بیشتر
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    parallax: 15 + Math.random() * 20, // افزایش شدت حرکت
    rotation: Math.random() * 360,
    scale: 1 + Math.random() * 0.5,
  }));
}

export default function ParallaxShapes() {
  const shapeCount = 6; // کاهش تعداد برای عملکرد بهتر
  const [shapes, setShapes] = useState<Shape[]>(() => getRandomShapes(shapeCount));
  const mouse = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [offsets, setOffsets] = useState(shapes.map(() => ({ x: 0, y: 0 })));

  useEffect(() => {
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
  }, [shapes]);

  // انیمیشن خودکار با سرعت بیشتر
  useEffect(() => {
    const interval = setInterval(() => {
      setShapes((prevShapes) =>
        prevShapes.map((shape) => ({
          ...shape,
          rotation: (shape.rotation + 2) % 360, // افزایش سرعت چرخش
          scale: 1 + Math.sin(Date.now() / 500 + shape.id.charCodeAt(0)) * 0.3, // افزایش دامنه تغییر مقیاس
        }))
      );
    }, 30); // کاهش فاصله زمانی برای حرکت نرم‌تر

    return () => clearInterval(interval);
  }, []);

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
            opacity: 0.3, // افزایش شفافیت
            filter: "blur(40px)", // کاهش بلور برای وضوح بیشتر
            mixBlendMode: "screen",
          }}
          animate={{
            x: shape.x + offsets[i]?.x,
            y: shape.y + offsets[i]?.y,
            rotate: shape.rotation,
            scale: shape.scale,
          }}
          transition={{
            duration: 0.2, // کاهش زمان برای پاسخ سریع‌تر
            ease: "linear",
          }}
        />
      ))}
      {/* افکت درخشش قوی‌تر */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-amber-500/20 to-transparent animate-pulse" />
    </div>
  );
}
