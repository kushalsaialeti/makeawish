import React, { useState } from 'react';
import { motion, useAnimationFrame, useMotionValue, useTransform, wrap } from 'framer-motion';
import { useCmsStore } from '../../store/cmsStore';

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
    // velocity is in % per second. delta is ms.
    let moveBy = baseVelocity * (delta / 1000);
    baseX.set(baseX.get() + moveBy);
  });

  // Wraps value between 0 and -50.
  // The children array should contain exactly two identical sets of items.
  const x = useTransform(baseX, (v) => `${wrap(0, -50, v)}%`);

  return (
    <div className="overflow-hidden flex flex-nowrap whitespace-nowrap w-full">
      <motion.div className="flex flex-nowrap gap-4 md:gap-8 min-w-max" style={{ x }}>
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

  // We need to duplicate the items so the marquee can loop smoothly over 50% of the total width
  const doubledImages = [...images, ...images, ...images, ...images];
  
  const textItems = ["AUTHENTICITY", "NO FILTERS", "THE ARCHIVE", "MOMENTS", "NO LIES", "UNEDITED"];
  const doubledTexts = [...textItems, ...textItems, ...textItems, ...textItems, ...textItems, ...textItems];

  return (
    <section className="py-24 bg-[#100c0c] overflow-hidden relative border-b border-white/10">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 to-transparent pointer-events-none" />
      
      <div className="max-w-[1600px] mx-auto px-8 mb-16">
        <h2 className="text-4xl md:text-6xl font-serif italic text-white/40 mb-4">MOMENTS</h2>
        <div className="w-32 h-px bg-white/20" />
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
              className="relative w-[60vw] sm:w-[40vw] md:w-[25vw] aspect-[4/5] shrink-0 border border-white/10 bg-[#e6d0d2] p-2 cursor-pointer"
              initial={{ filter: 'grayscale(100%)' }}
              whileHover={{ filter: 'grayscale(0%)', scale: 1.02 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-full h-full relative overflow-hidden group">
                <img 
                  src={src} 
                  alt={`Moment ${i}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <p className="text-white font-mono text-xs md:text-sm tracking-[0.2em] uppercase">
                    VIEW.{(i % 5) + 1}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </InfiniteMarquee>

        {/* Bottom Marquee: Text moving Right */}
        <InfiniteMarquee baseVelocity={3} isHovered={isHovered}>
          {doubledTexts.map((text, i) => (
            <div key={`text-${i}`} className="flex items-center gap-16 px-8">
              <span className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white/20 to-white/40 tracking-widest uppercase opacity-70 hover:opacity-100 transition-opacity duration-300">
                {text}
              </span>
              <span className="w-3 h-3 rounded-full bg-[#7a1022]" />
            </div>
          ))}
        </InfiniteMarquee>
      </div>
    </section>
  );
};
