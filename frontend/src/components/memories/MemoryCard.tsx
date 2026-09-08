import React from 'react';
import { motion } from 'framer-motion';
import { fadeUp, softFloat } from '../motion/variants';
import { cn } from '../../lib/utils';
import { Eyebrow, DisplayBackground } from '../ui/Typography';

interface MemoryCardProps {
  title: string;
  description: string;
  imageUrl: string;
  quote?: string;
  backgroundWord: string;
  orientation?: 'portrait' | 'landscape';
  className?: string;
}

export const MemoryCard: React.FC<MemoryCardProps> = ({ 
  title, 
  description, 
  imageUrl, 
  quote, 
  backgroundWord,
  orientation = 'portrait',
  className
}) => {
  return (
    <motion.div 
      className={cn(
        "relative group w-full flex flex-col items-center justify-center p-6 md:p-10 font-sans",
        className
      )}
      variants={fadeUp}
      whileHover="hover"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      {/* Background Giant Typography */}
      <DisplayBackground text={backgroundWord} className="opacity-30" />

      {/* Image Container */}
      <motion.div 
        className={cn(
          "relative z-10 rounded-3xl overflow-hidden shadow-2xl transition-all duration-700 group-hover:shadow-[0_20px_60px_rgba(255,133,161,0.15)] border border-white/10",
          orientation === 'portrait' ? 'aspect-[3/4] max-w-md' : 'aspect-[16/9] max-w-3xl'
        )}
        variants={softFloat}
      >
        <motion.img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover filter contrast-110"
          variants={{
            hover: { scale: 1.05, transition: { duration: 0.8, ease: "easeOut" } }
          }}
        />
        
        {/* Hover Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 flex flex-col justify-end p-8">
          {quote && (
            <motion.p 
              className="text-[#f5f1e8] font-handwriting text-xl md:text-2xl leading-snug opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100"
            >
              "{quote}"
            </motion.p>
          )}
        </div>
      </motion.div>

      {/* Text Content Below */}
      <div className="relative z-20 mt-8 text-center max-w-lg">
        <Eyebrow accent className="mb-2">ARCHIVED MOMENT</Eyebrow>
        <h3 className="font-display italic text-display-md text-[#f5f1e8] mb-3 leading-snug">{title}</h3>
        <p className="font-body text-sm md:text-base text-white/70 leading-relaxed max-w-md mx-auto">{description}</p>
      </div>
    </motion.div>
  );
};
