import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const COLORS = ["#FACC15", "#FBBF24", "#F59E0B"];

function getRandomPosition() {
  return {
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
  };
}

export default function InteractiveShapes() {
  const shapeCount = 5;

  const [shapes, setShapes] = useState(() =>
    Array.from({ length: shapeCount }).map(() => ({
      id: crypto.randomUUID(),
      size: 200 + Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      position: getRandomPosition(),
      target: getRandomPosition(),
    }))
  );

  const controlsRef = useRef(shapes.map(() => useAnimation()));
  const containerRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });

  // حرکت دائمی شکل‌ها
  useEffect(() => {
    shapes.forEach((shape, i) => {
      const move = () => {
        const newTarget = getRandomPosition();
        controlsRef.current[i]
          .start({
            x: newTarget.x,
            y: newTarget.y,
            transition: { duration: 20 + Math.random() * 10, ease: "easeInOut" },
          })
          .then(move); // بعد از پایان حرکت دوباره اجرا بشه
      };
      move();
    });
  }, []);

  // دنبال کردن موس
  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };

      shapes.forEach((shape, i) => {
        const dx = shape.position.x - mouse.current.x;
        const dy = shape.position.y - mouse.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 200) {
          // اگر موس نزدیک بود، مسیر تغییر کنه
          const angle = Math.atan2(dy, dx);
          const newX = shape.position.x + Math.cos(angle) * 200;
          const newY = shape.position.y + Math.sin(angle) * 200;

          controlsRef.current[i].start({
            x: newX,
            y: newY,
            transition: { duration: 0.8, ease: "easeOut" },
          });
        }
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [shapes]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-gradient-to-br from-amber-900 via-orange-900 to-amber-900"
    >
      {shapes.map(({ id, size, color, position }, i) => (
        <motion.div
          key={id}
          className="absolute rounded-full"
          style={{
            width: size,
            height: size,
            backgroundColor: color,
            filter: "blur(80px)",
            opacity: 0.35,
            top: 0,
            left: 0,
          }}
          initial={{ x: position.x, y: position.y }}
          animate={controlsRef.current[i]}
        />
      ))}
    </div>
  );
}
