import { motion } from "framer-motion";

export default function DebugBackground() {
  return (
    <div className="fixed inset-0 z-0">
      <div className="absolute inset-0 bg-black" />

      <motion.div
        className="absolute rounded-full bg-red-500"
        style={{
          width: 200,
          height: 200,
          left: '40%',
          top: '40%',
        }}
        animate={{
          x: [0, 20, -20, 0],
          y: [0, -10, 10, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}
