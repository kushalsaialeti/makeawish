import React from 'react';
import { motion } from 'framer-motion';
import { fadeUp, softFloat } from '../motion/variants';
import { cn } from '../../lib/utils';

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
        "relative group w-full flex flex-col items-center justify-center p-8",
        className
      )}
      variants={fadeUp}
      whileHover="hover"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      {/* Background Giant Typography */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none z-0">
        <motion.span 
          className="text-[15vw] font-bold text-foreground/5 whitespace-nowrap select-none"
          variants={{
            hover: { scale: 1.05, transition: { duration: 0.8, ease: "easeOut" } }
          }}
        >
          {backgroundWord}
        </motion.span>
      </div>

      {/* Image Container */}
      <motion.div 
        className={cn(
          "relative z-10 rounded-2xl overflow-hidden shadow-xl transition-shadow duration-700 group-hover:shadow-2xl group-hover:shadow-primary/20",
          orientation === 'portrait' ? 'aspect-[3/4] max-w-md' : 'aspect-[16/9] max-w-3xl'
        )}
        variants={softFloat}
      >
        <motion.img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover"
          variants={{
            hover: { scale: 1.05, filter: "brightness(1.1)", transition: { duration: 0.8, ease: "easeOut" } }
          }}
        />
        
        {/* Hover Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 flex flex-col justify-end p-6">
          {quote && (
            <motion.p 
              className="text-white font-serif italic text-lg opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100"
            >
              "{quote}"
            </motion.p>
          )}
        </div>
      </motion.div>

      {/* Text Content Below */}
      <div className="relative z-20 mt-8 text-center max-w-lg">
        <h3 className="text-2xl font-serif text-foreground mb-3">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
};
