import React, { useState } from 'react';
import { motion, useAnimationFrame, useMotionValue, useTransform, wrap } from 'framer-motion';
import { useCmsStore } from '../../store/cmsStore';
import { Eyebrow } from '../ui/Typography';

function InfiniteMarquee({ 
  children, 
  baseVelocity = -5, 
  isHovered = false 
}: { 
  children: React.ReactNode, 
  baseVelocity: number, 
  isHovered: boolean 
}) {
  const baseX = useMotionValue(0);

  useAnimationFrame((_, delta) => {
    if (isHovered) return;
    let moveBy = baseVelocity * (delta / 1000);
    baseX.set(baseX.get() + moveBy);
  });

  const x = useTransform(baseX, (v) => `${wrap(0, -50, v)}%`);

  return (
    <div className="overflow-hidden flex flex-nowrap whitespace-nowrap w-full">
      <motion.div className="flex flex-nowrap gap-6 md:gap-10 min-w-max" style={{ x }}>
        {children}
      </motion.div>
    </div>
  );
}

export const CoverflowGallery = () => {
  const [isHovered, setIsHovered] = useState(false);
  const { coverflowGallery } = useCmsStore();
  
  if (!coverflowGallery || !coverflowGallery.images) return null;

  const images = coverflowGallery.images;
  const doubledImages = [...images, ...images, ...images, ...images];
  
  const textItems = ["AUTHENTICITY", "NO FILTERS", "THE ARCHIVE", "MOMENTS", "TIMELESS", "UNEDITED"];
  const doubledTexts = [...textItems, ...textItems, ...textItems, ...textItems, ...textItems, ...textItems];

  return (
    <section className="py-28 bg-[#100c0c] overflow-hidden relative border-b border-white/10">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 to-transparent pointer-events-none" />
      
      <div className="max-w-[1600px] mx-auto px-8 mb-16">
        <Eyebrow accent className="mb-3">CHAPTER 04 • CINEMATIC PANORAMA</Eyebrow>
        <h2 className="font-display italic text-display-lg text-[#f5f1e8] mb-4">
          Moments & Memories in Motion
        </h2>
        <div className="w-24 h-0.5 bg-gradient-to-r from-pink-500 to-transparent" />
      </div>

      <div 
        className="relative flex flex-col gap-12"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={() => setIsHovered(true)}
        onTouchEnd={() => setIsHovered(false)}
      >
        {/* Top Marquee: Images moving Left */}
        <InfiniteMarquee baseVelocity={-4} isHovered={isHovered}>
          {doubledImages.map((src, i) => (
            <motion.div 
              key={`img-${i}`}
              className="relative w-[65vw] sm:w-[42vw] md:w-[26vw] aspect-[4/5] shrink-0 border border-white/15 bg-[#1a1616] p-2.5 rounded-3xl shadow-2xl cursor-pointer overflow-hidden"
              initial={{ filter: 'grayscale(60%)' }}
              whileHover={{ filter: 'grayscale(0%)', scale: 1.02 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-full h-full relative overflow-hidden rounded-2xl group">
                <img 
                  src={src} 
                  alt={`Moment ${i}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex justify-between items-center">
                  <span className="text-white font-body text-xs tracking-[0.2em] uppercase font-semibold">
                    FRAME.{(i % 6) + 1}
                  </span>
                  <span className="text-pink-300 font-handwriting text-sm">forever</span>
                </div>
              </div>
            </motion.div>
          ))}
        </InfiniteMarquee>

        {/* Bottom Marquee: Text moving Right */}
        <InfiniteMarquee baseVelocity={3} isHovered={isHovered}>
          {doubledTexts.map((text, i) => (
            <div key={`text-${i}`} className="flex items-center gap-12 px-6">
              <span className="font-display italic text-4xl md:text-6xl text-white/25 hover:text-white/70 tracking-tight transition-colors duration-300">
                {text}
              </span>
              <span className="w-2 h-2 rounded-full bg-pink-500/60 shadow-[0_0_8px_rgba(236,72,153,0.8)]" />
            </div>
          ))}
        </InfiniteMarquee>
      </div>
    </section>
  );
};
