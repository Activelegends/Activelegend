import React from 'react';
import { motion } from 'framer-motion';

interface ContentBlockProps {
  block: {
    type: 'image' | 'video' | 'text';
    src?: string;
    alt?: string;
    caption?: string;
    content?: string;
  };
  index: number;
}

const ContentBlock: React.FC<ContentBlockProps> = ({ block, index }) => {
  const isEven = index % 2 === 0;
  const alignmentContainerClass = isEven
    ? "w-full flex justify-end mb-8"
    : "w-full flex justify-start mb-8";

  const motionProps = {
    initial: { opacity: 0, y: 50 },
    whileInView: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 },
    viewport: { once: false, amount: 0.3 },
    transition: { duration: 0.7, ease: "easeOut" }
  };

  if (block.type === "image") {
    return (
      <motion.div
        {...motionProps}
        className={alignmentContainerClass}
      >
        <img
          src={block.src}
          alt={block.alt}
          className="w-full md:w-3/4 rounded-2xl shadow-xl object-cover"
        />
      </motion.div>
    );
  }

  if (block.type === "video") {
    return (
      <motion.div
        {...motionProps}
        className={alignmentContainerClass}
      >
        <div className="w-full md:w-3/4 rounded-2xl overflow-hidden shadow-xl">
          <iframe
            src={block.src}
            title={block.caption || "ویدیو بازی"}
            className="w-full h-64 md:h-96"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        </div>
      </motion.div>
    );
  }

  if (block.type === "text") {
    return (
      <motion.div
        {...motionProps}
        className="w-full bg-gray-900 text-gray-100 p-6 rounded-2xl mb-8"
      >
        <p className="text-lg leading-relaxed font-medium" dir="rtl">
          {block.content}
        </p>
      </motion.div>
    );
  }

  return null;
};

export default ContentBlock; 