import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const COLORS = ["#FACC15", "#FBBF24", "#F59E0B"];

function getRandomPosition() {
  return {
    x: Math.random() * window.innerWidth * 0.8 + window.innerWidth * 0.1,
    y: Math.random() * window.innerHeight * 0.8 + window.innerHeight * 0.1,
  };
}

export default function InteractiveShapes() {
  const shapeCount = 5;

  const [shapes, setShapes] = useState(() =>
    Array.from({ length: shapeCount }).map(() => ({
      id: crypto.randomUUID(),
      size: 150 + Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      position: getRandomPosition(),
      target: getRandomPosition(),
    }))
  );

  // ساخت کنترل‌ها فقط یکبار
  const controlsRef = useRef(shapes.map(() => useAnimation()));

  useEffect(() => {
    shapes.forEach((shape, i) => {
      function animateToTarget() {
        controlsRef.current[i]
          .start({
            x: shape.target.x,
            y: shape.target.y,
            transition: { duration: 15 + Math.random() * 10, ease: "easeInOut" },
          })
          .then(() => {
            const newTarget = getRandomPosition();
            setShapes((prev) => {
              const updated = [...prev];
              updated[i] = { ...updated[i], target: newTarget };
              return updated;
            });
          });
      }
      animateToTarget();
    });
  }, [shapes]);

  const handleMouseEnter = (i) => {
    const newTarget = getRandomPosition();
    controlsRef.current[i].start({
      x: newTarget.x,
      y: newTarget.y,
      transition: { duration: 1.2, ease: "easeOut" },
    });
    setShapes((prev) => {
      const updated = [...prev];
      updated[i] = { ...updated[i], target: newTarget };
      return updated;
    });
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-br from-amber-900 via-orange-900 to-amber-900 overflow-hidden">
      {shapes.map(({ id, size, color, position }, i) => (
        <motion.div
          key={id}
          className="pointer-events-auto rounded-full"
          style={{
            width: size,
            height: size,
            backgroundColor: color,
            position: "absolute",
            top: position.y,
            left: position.x,
            filter: "blur(12px)",
            boxShadow: `0 0 30px ${color}`,
            opacity: 0.7,
          }}
          animate={controlsRef.current[i]}
          initial={{ x: position.x, y: position.y, opacity: 0.7, scale: 1 }}
          whileHover={{
            scale: 1.2,
            opacity: 1,
            boxShadow: `0 0 50px ${color}`,
            transition: { duration: 0.3 },
          }}
          onMouseEnter={() => handleMouseEnter(i)}
        />
      ))}
    </div>
  );
}
