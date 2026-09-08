import { motion } from 'framer-motion';
import { useCmsStore } from '../../store/cmsStore';
import { DisplayBackground, Eyebrow, Handwritten } from '../ui/Typography';

export const ScrapbookHero = () => {
  const { scrapbookHero } = useCmsStore();

  if (!scrapbookHero) return null;

  return (
    <section className="relative w-full min-h-[140vh] sm:min-h-[150vh] bg-[#151111] overflow-x-clip flex flex-col font-sans text-[#e6d0d2] pb-16 sm:pb-24">
      {/* Giant Atmospheric Background Typography */}
      <DisplayBackground text="CELEBRATION" className="top-[18%] opacity-60" />

      {/* Floating Sparkles */}
      <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden select-none">
        <div className="absolute top-[8%] left-[10%] sm:left-[12%] text-lg sm:text-xl text-pink-300/40 animate-pulse">✦</div>
        <div className="absolute top-[22%] right-[10%] sm:right-[18%] text-xs text-white/30 animate-pulse">✧</div>
        <div className="absolute top-[38%] left-[15%] sm:left-[28%] text-xl sm:text-2xl text-rose-200/50 animate-pulse">✦</div>
        <div className="absolute top-[52%] right-[8%] sm:right-[12%] text-base sm:text-lg text-pink-300/40 animate-pulse">✧</div>
        <div className="absolute top-[72%] left-[12%] sm:left-[18%] text-xs text-white/30 animate-pulse">✦</div>
        <div className="absolute top-[86%] right-[15%] sm:right-[22%] text-lg sm:text-xl text-rose-300/50 animate-pulse">✧</div>
      </div>

      {/* TOP SECTION */}
      <div className="relative w-full h-[45vh] sm:h-[55vh] md:h-[65vh] mt-12 sm:mt-16 md:mt-20 px-3 sm:px-6 md:px-12 z-10">
        <div className="w-full h-full relative group overflow-hidden rounded-2xl sm:rounded-[2.5rem] shadow-2xl border border-white/10">
          <img 
            src={scrapbookHero.topImage} 
            alt="Hero Top" 
            className="w-full h-full object-cover filter grayscale-[25%] contrast-125 sepia-[15%] transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#151111] via-transparent to-black/30" />
          
          {/* Chapter & Overlay Text */}
          <div className="absolute top-4 left-4 sm:top-8 sm:left-8 md:top-10 md:left-10">
            <Eyebrow accent className="text-[10px] sm:text-xs">CHAPTER 01 • THE BEGINNING</Eyebrow>
          </div>

          <div className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 md:bottom-12 md:right-12 text-right max-w-xs sm:max-w-md">
            <p className="font-body text-xs sm:text-sm md:text-base text-white/90 font-medium leading-relaxed drop-shadow-lg">
              {scrapbookHero.topText}
            </p>
          </div>
        </div>
      </div>

      {/* MIDDLE SECTION - COLLAGE & RECIPIENT HERO HEADING */}
      <div className="relative w-full min-h-[55vh] sm:min-h-[65vh] md:min-h-[75vh] flex items-center justify-center -mt-4 sm:-mt-8 z-20 px-2">
        {/* Background collage backdrop */}
        <div className="absolute inset-x-0 h-full opacity-35 overflow-hidden">
          <img 
            src={scrapbookHero.bgMiddleImage} 
            alt="Background collage" 
            className="w-full h-full object-cover filter grayscale contrast-150 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#151111] via-[#151111]/70 to-[#151111]" />
        </div>

        {/* Display Heading / Identity */}
        <div className="relative z-40 text-center pointer-events-none px-3 py-6 max-w-5xl mx-auto flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="font-display italic text-display-hero text-[#f5f1e8] drop-shadow-[0_15px_35px_rgba(0,0,0,0.8)] tracking-[-0.045em] leading-[0.88]">
              {scrapbookHero.middleHeading1}
            </h1>
            <h2 className="font-display italic text-display-hero text-pink-200/95 -mt-2 sm:-mt-4 md:-mt-6 drop-shadow-[0_15px_35px_rgba(122,16,34,0.6)] tracking-[-0.045em] leading-[0.88]">
              {scrapbookHero.middleHeading2}
            </h2>
          </motion.div>
        </div>

        {/* Stamp Image 1 (Left) */}
        <motion.div 
          initial={{ rotate: -5, x: -30, opacity: 0 }}
          whileInView={{ rotate: -7, x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="absolute left-1 sm:left-[4%] md:left-[12%] top-[8%] sm:top-[12%] w-28 sm:w-44 md:w-60 z-30 pointer-events-none sm:pointer-events-auto"
        >
          <div className="stamp-border bg-white p-1.5 sm:p-2.5 shadow-xl sm:shadow-2xl">
            <div className="aspect-[4/3] overflow-hidden">
              <img 
                src={scrapbookHero.middleImageLeft} 
                alt="Collage Left" 
                className="w-full h-full object-cover filter contrast-125 sepia-[20%]"
              />
            </div>
            <div className="pt-1 sm:pt-2 text-center">
              <Handwritten color="#7a1022" className="text-[10px] sm:text-xs md:text-sm">moment in time</Handwritten>
            </div>
          </div>
        </motion.div>

        {/* Stamp Image 2 (Right) */}
        <motion.div 
          initial={{ rotate: 8, x: 30, opacity: 0 }}
          whileInView={{ rotate: 5, x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="absolute right-1 sm:right-[4%] md:right-[12%] top-[18%] sm:top-[22%] md:top-[12%] w-24 sm:w-36 md:w-52 z-20 pointer-events-none sm:pointer-events-auto"
        >
          <div className="stamp-border bg-[#f8f2eb] p-1.5 sm:p-2.5 shadow-xl sm:shadow-2xl">
            <div className="aspect-square overflow-hidden">
              <img 
                src={scrapbookHero.middleImageRight} 
                alt="Collage Right" 
                className="w-full h-full object-cover filter contrast-125 sepia-[10%]"
              />
            </div>
            <div className="pt-1 sm:pt-2 text-center">
              <Handwritten color="#5c381c" className="text-[10px] sm:text-xs md:text-sm">cherished</Handwritten>
            </div>
          </div>
        </motion.div>

        {/* Bottom text of middle section */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 w-full text-center z-40 px-4">
          <p className="font-body text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.2em] sm:tracking-[0.24em] font-semibold text-white/70 drop-shadow-md">
            {scrapbookHero.middleBottomText}
          </p>
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div className="relative w-full h-[45vh] sm:h-[55vh] md:h-[65vh] px-3 sm:px-6 md:px-12 -mt-4 z-30">
        <div className="w-full h-full relative group overflow-hidden rounded-2xl sm:rounded-[2.5rem] shadow-2xl border border-white/10">
          <img 
            src={scrapbookHero.bottomImage} 
            alt="Hero Bottom" 
            className="w-full h-full object-cover filter grayscale-[15%] contrast-125 transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 md:bottom-12 md:left-12">
            <Eyebrow className="text-[10px] sm:text-xs">A LIFETIME OF MEMORIES</Eyebrow>
          </div>
        </div>
      </div>
    </section>
  );
};
