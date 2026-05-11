import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCmsStore } from '../../store/cmsStore';

export const ScrapbookHero = () => {
  const { scrapbookHero, fetchCmsContent } = useCmsStore();

  useEffect(() => {
    fetchCmsContent();
  }, [fetchCmsContent]);

  if (!scrapbookHero) return null;

  return (
    <section className="relative w-full min-h-[150vh] bg-[#151111] overflow-hidden flex flex-col font-mono text-[#e6d0d2] pb-24">
      
      {/* Floating Pixel Elements (Hearts, Stars, Pluses) */}
      <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden">
        {/* We'll use CSS to draw pixel hearts/stars, or simple unicode with pixel fonts */}
        <div className="absolute top-[10%] left-[15%] text-2xl animate-pulse text-white/80">♥</div>
        <div className="absolute top-[20%] right-[20%] text-xl animate-pulse text-white/50">+</div>
        <div className="absolute top-[40%] left-[30%] text-3xl animate-pulse text-[#f3d4d6]">★</div>
        <div className="absolute top-[50%] right-[10%] text-2xl animate-pulse text-white/70">♥</div>
        <div className="absolute top-[70%] left-[20%] text-xl animate-pulse text-white/40">+</div>
        <div className="absolute top-[85%] right-[25%] text-2xl animate-pulse text-white/90">♥</div>
        <div className="absolute top-[5%] left-[50%] text-3xl animate-pulse text-[#7a1022]">★</div>
      </div>

      {/* TOP SECTION */}
      <div className="relative w-full h-[50vh] md:h-[60vh] mt-20 px-4 md:px-12 z-10">
        <div className="w-full h-full relative group">
          <img 
            src={scrapbookHero.topImage} 
            alt="Hero Top" 
            className="w-full h-full object-cover rounded-[2rem] filter grayscale-[30%] contrast-125 sepia-[20%] transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-[#7a1022]/20 mix-blend-multiply rounded-[2rem]" />
          
          {/* Overlay Text */}
          <div className="absolute bottom-6 right-6 md:bottom-12 md:right-12 text-right">
            <p className="text-sm md:text-lg font-medium text-white drop-shadow-md max-w-sm ml-auto">
              {scrapbookHero.topText}
            </p>
          </div>
        </div>
      </div>

      {/* MIDDLE SECTION - COLLAGE */}
      <div className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center -mt-10 z-20">
        
        {/* Background dark image in the middle */}
        <div className="absolute inset-x-0 h-full opacity-40">
           <img 
              src={scrapbookHero.bgMiddleImage} 
              alt="Background collage" 
              className="w-full h-full object-cover filter grayscale contrast-150"
           />
           <div className="absolute inset-0 bg-[#151111]/80" />
        </div>

        {/* Happy Birthday Text Center */}
        <div className="absolute z-40 text-center pointer-events-none drop-shadow-2xl">
          <h1 className="text-6xl md:text-8xl font-serif italic text-white" style={{ textShadow: '2px 2px 0 #7a1022, 4px 4px 10px rgba(0,0,0,0.5)' }}>
            {scrapbookHero.middleHeading1}
          </h1>
          <h1 className="text-6xl md:text-8xl font-serif italic text-white -mt-4 ml-12" style={{ textShadow: '2px 2px 0 #7a1022, 4px 4px 10px rgba(0,0,0,0.5)' }}>
            {scrapbookHero.middleHeading2}
          </h1>
        </div>

        {/* Stamp Image 1 (Left) */}
        <motion.div 
          initial={{ rotate: -5, x: -50 }}
          whileInView={{ rotate: -8, x: 0 }}
          viewport={{ once: true }}
          className="absolute left-[5%] md:left-[15%] top-[10%] w-48 md:w-64 z-30"
        >
          <div className="stamp-border bg-white p-3 shadow-2xl">
            <div className="aspect-[4/3] overflow-hidden">
              <img 
                src={scrapbookHero.middleImageLeft} 
                alt="Collage Left" 
                className="w-full h-full object-cover filter contrast-125 sepia-[30%]"
              />
            </div>
          </div>
        </motion.div>

        {/* Stamp Image 2 (Right) */}
        <motion.div 
          initial={{ rotate: 10, x: 50 }}
          whileInView={{ rotate: 6, x: 0 }}
          viewport={{ once: true }}
          className="absolute right-[5%] md:right-[15%] top-[20%] md:top-[10%] w-40 md:w-56 z-20"
        >
          <div className="stamp-border bg-[#e6d0d2] p-3 shadow-2xl">
            <div className="aspect-square overflow-hidden">
              <img 
                src={scrapbookHero.middleImageRight} 
                alt="Collage Right" 
                className="w-full h-full object-cover filter contrast-125 sepia-[10%]"
              />
            </div>
          </div>
        </motion.div>

        {/* Bottom text of middle section */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full text-center z-40">
          <p className="text-xl md:text-2xl font-bold text-white tracking-widest drop-shadow-md">
            {scrapbookHero.middleBottomText}
          </p>
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div className="relative w-full h-[50vh] md:h-[60vh] px-4 md:px-12 -mt-4 z-30">
        <div className="w-full h-full relative group">
          <img 
            src={scrapbookHero.bottomImage} 
            alt="Hero Bottom" 
            className="w-full h-full object-cover rounded-[2rem] filter grayscale-[20%] contrast-125"
          />
          {/* subtle vignette */}
          <div className="absolute inset-0 bg-black/20 rounded-[2rem] shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] pointer-events-none" />
        </div>
      </div>

    </section>
  );
};
