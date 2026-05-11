import React from 'react';
import { motion } from 'framer-motion';
import { cinematicReveal, fadeUp, staggerContainer } from '../motion/variants';

interface HeroProps {
  title: string;
  subtitle: string;
  imageUrl: string;
  backgroundText: string;
}

export const Hero: React.FC<HeroProps> = ({ title, subtitle, imageUrl, backgroundText }) => {
  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Giant faded background typography */}
      <motion.div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.05, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      >
        <h1 className="text-[20vw] font-bold text-foreground whitespace-nowrap tracking-tighter mix-blend-overlay">
          {backgroundText}
        </h1>
      </motion.div>

      {/* Main cinematic image and content */}
      <motion.div 
        className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="relative w-full max-w-4xl aspect-[21/9] md:aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl mb-12"
          variants={cinematicReveal}
        >
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent z-10" />
          <img 
            src={imageUrl} 
            alt="Hero Cinematic" 
            className="w-full h-full object-cover"
          />
        </motion.div>

        <motion.h2 
          className="text-4xl md:text-6xl lg:text-7xl font-serif text-foreground mb-6"
          variants={fadeUp}
        >
          {title}
        </motion.h2>

        <motion.p 
          className="text-lg md:text-xl text-muted-foreground max-w-2xl font-light"
          variants={fadeUp}
        >
          {subtitle}
        </motion.p>
      </motion.div>
    </section>
  );
};
