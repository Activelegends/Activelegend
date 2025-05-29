import { motion } from 'framer-motion';
import { HiChevronDown } from 'react-icons/hi';

export default function ScrollIndicator() {
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/80"
      initial={{ opacity: 0, y: -10 }}
      animate={{ 
        opacity: [0.5, 1, 0.5],
        y: [0, 10, 0]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <HiChevronDown className="w-8 h-8" />
    </motion.div>
  );
}