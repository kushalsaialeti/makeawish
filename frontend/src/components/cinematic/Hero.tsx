import React from 'react';
import { motion } from 'framer-motion';
import { cinematicReveal, fadeUp, staggerContainer } from '../motion/variants';
import { Eyebrow, DisplayBackground } from '../ui/Typography';

interface HeroProps {
  title: string;
  subtitle: string;
  imageUrl: string;
  backgroundText: string;
}

export const Hero: React.FC<HeroProps> = ({ title, subtitle, imageUrl, backgroundText }) => {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#151111] font-sans py-24">
      {/* Giant faded background typography */}
      <DisplayBackground text={backgroundText} className="opacity-40" />

      {/* Main cinematic image and content */}
      <motion.div 
        className="relative z-10 container mx-auto px-6 flex flex-col items-center text-center"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="relative w-full max-w-4xl aspect-[21/9] md:aspect-[16/9] rounded-[2.5rem] overflow-hidden shadow-2xl mb-12 border border-white/10"
          variants={cinematicReveal}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#151111]/80 via-transparent to-transparent z-10" />
          <img 
            src={imageUrl} 
            alt="Hero Cinematic" 
            className="w-full h-full object-cover filter contrast-110"
          />
        </motion.div>

        <motion.div variants={fadeUp} className="mb-3">
          <Eyebrow accent>CHAPTER 01 • PROLOGUE</Eyebrow>
        </motion.div>

        <motion.h1 
          className="font-display italic text-display-lg text-[#f5f1e8] mb-6 max-w-3xl leading-tight"
          variants={fadeUp}
        >
          {title}
        </motion.h1>

        <motion.p 
          className="font-body text-base md:text-lg text-white/70 max-w-xl leading-relaxed"
          variants={fadeUp}
        >
          {subtitle}
        </motion.p>
      </motion.div>
    </section>
  );
};
