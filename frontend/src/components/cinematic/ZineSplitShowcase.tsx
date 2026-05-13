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

  if (!zineSplitShowcase || !zineSplitShowcase.items) return null;

  return (
    <section className="bg-[#151111] text-[#e6d0d2] py-24 md:py-32 overflow-hidden border-b border-white/10">
      <motion.div 
        className="max-w-[1600px] mx-auto px-4 md:px-8"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.div className="mb-20 text-center" variants={cinematicReveal}>
           <h2 className="text-6xl md:text-9xl font-black italic tracking-tighter leading-none text-[#f3d4d6] drop-shadow-[0_10px_30px_rgba(243,212,214,0.2)]">
            LIVING ART
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-12 gap-y-24 items-start">
          {zineSplitShowcase.items.map((item, index) => {
            // Create a varied rotation based on index
            const rotations = ["-rotate-3", "rotate-2", "-rotate-1", "rotate-3", "-rotate-2"];
            const rotation = rotations[index % rotations.length];
            const hoverRotation = "hover:rotate-0";
            
            return (
              <motion.div 
                key={index} 
                variants={fadeUp} 
                className="flex justify-center w-full"
              >
                <FlipCard 
                  image={item.image} 
                  backText={item.backText} 
                  desc={item.desc}
                  rotateClass={`${rotation} ${hoverRotation}`}
                />
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
};
