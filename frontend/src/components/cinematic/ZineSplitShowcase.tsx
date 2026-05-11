import { useState } from 'react';
import { motion } from 'framer-motion';
import { fadeUp, cinematicReveal, staggerContainer } from '../motion/variants';
import { useCmsStore } from '../../store/cmsStore';

const FlipCard = ({ image, backText, desc, rotateClass }: { image: string, backText: string, desc: string, rotateClass: string }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="space-y-4 w-full">
      <div 
        className={`relative aspect-[3/4] cursor-pointer group perspective-[1000px] ${rotateClass} transition-transform duration-500`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <motion.div 
          className="w-full h-full preserve-3d relative"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.8, type: 'spring', stiffness: 100, damping: 20 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front */}
          <div 
            className="absolute inset-0 backface-hidden border-2 border-[#e6d0d2] p-2 bg-white/5"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="w-full h-full relative overflow-hidden">
              <img 
                src={image} 
                alt="Front"
                className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
            </div>
          </div>

          {/* Back */}
          <div 
            className="absolute inset-0 backface-hidden border-2 border-[#e6d0d2] bg-[#f8f5f2] p-6 flex items-center justify-center text-center shadow-inner"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <p className="text-black font-bold text-2xl md:text-3xl leading-snug tracking-tighter" style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", "Comic Neue", sans-serif' }}>
              {backText}
            </p>
          </div>
        </motion.div>
      </div>
      
      {/* Description below */}
      {desc && (
        <div className={`text-center font-mono text-xs opacity-70 px-4 ${rotateClass}`}>
          {desc}
        </div>
      )}
    </div>
  );
};

export const ZineSplitShowcase = () => {
  const { zineSplitShowcase } = useCmsStore();

  if (!zineSplitShowcase) return null;

  return (
    <section className="bg-[#151111] text-[#e6d0d2] py-24 md:py-32 overflow-hidden border-b border-white/10">
      <motion.div 
        className="max-w-[1600px] mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 items-center"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.div className="md:col-span-4 flex items-center justify-center" variants={fadeUp}>
          <div className="w-3/4 md:w-full">
            <FlipCard 
              image={zineSplitShowcase.image1} 
              backText={zineSplitShowcase.backText1} 
              desc={zineSplitShowcase.desc1}
              rotateClass="-rotate-2 hover:rotate-0"
            />
          </div>
        </motion.div>

        <motion.div className="md:col-span-4 flex flex-col items-center justify-center space-y-12 relative z-10" variants={cinematicReveal}>
          <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter text-center leading-none text-[#f3d4d6]">
            LIVING
            <br />
            ART
          </h2>
          <div className="w-px h-16 bg-white/20 hidden md:block" />
          <div className="w-3/4">
            <FlipCard 
              image={zineSplitShowcase.image2} 
              backText={zineSplitShowcase.backText2} 
              desc={zineSplitShowcase.desc2}
              rotateClass="rotate-3 hover:-rotate-1"
            />
          </div>
        </motion.div>

        <motion.div className="md:col-span-4 flex flex-col justify-center space-y-16 mt-16 md:mt-32 items-center" variants={fadeUp}>
          <div className="w-3/4">
            <FlipCard 
              image={zineSplitShowcase.image3} 
              backText={zineSplitShowcase.backText3} 
              desc={zineSplitShowcase.desc3}
              rotateClass="rotate-1 hover:-rotate-2"
            />
          </div>
          <div className="w-2/3 ml-auto mr-8">
            <FlipCard 
              image={zineSplitShowcase.image4} 
              backText={zineSplitShowcase.backText4} 
              desc={zineSplitShowcase.desc4}
              rotateClass="-rotate-3 hover:rotate-1"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};
