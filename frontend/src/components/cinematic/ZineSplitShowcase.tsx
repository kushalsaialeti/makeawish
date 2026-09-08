import { useState } from 'react';
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '../motion/variants';
import { useCmsStore } from '../../store/cmsStore';
import { Eyebrow, Handwritten, DisplayBackground } from '../ui/Typography';

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
            className="absolute inset-0 backface-hidden border border-white/20 p-2.5 bg-[#1a1616] rounded-2xl shadow-xl overflow-hidden"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="w-full h-full relative overflow-hidden rounded-xl">
              <img 
                src={image} 
                alt="Front"
                className="w-full h-full object-cover grayscale-[30%] contrast-125 group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-500" />
              
              <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center text-[10px] font-body uppercase tracking-widest text-white/70">
                <span>Memory</span>
                <span className="text-pink-300">Flip ↺</span>
              </div>
            </div>
          </div>

          {/* Back: Handwritten Note */}
          <div 
            className="absolute inset-0 backface-hidden border border-[#d4c8a8] bg-[#f8f5ee] p-6 md:p-8 flex flex-col items-center justify-center text-center shadow-2xl rounded-2xl paper-texture overflow-hidden"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <div className="w-8 h-0.5 bg-[#8c6b4f]/30 mb-4" />
            <Handwritten color="#24211d" className="text-xl md:text-2xl leading-snug px-2">
              "{backText}"
            </Handwritten>
            <div className="w-8 h-0.5 bg-[#8c6b4f]/30 mt-4" />
          </div>
        </motion.div>
      </div>
      
      {/* Description below */}
      {desc && (
        <div className={`text-center font-body text-xs text-white/60 px-4 leading-relaxed ${rotateClass}`}>
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
    <section className="relative bg-[#151111] text-[#e6d0d2] py-28 md:py-36 overflow-hidden border-b border-white/10">
      <DisplayBackground text="GALLERY" className="top-[15%] opacity-40" />

      <motion.div 
        className="max-w-[1600px] mx-auto px-4 md:px-8 relative z-10"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        <motion.div className="mb-20 text-center flex flex-col items-center gap-3" variants={fadeUp}>
          <Eyebrow accent>EXHIBIT • CHAPTER 02</Eyebrow>
          <h2 className="font-display italic text-display-xl text-[#f5f1e8] drop-shadow-[0_10px_30px_rgba(243,212,214,0.15)] leading-none">
            Living Art & Fleeting Moments
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-10 gap-y-20 items-start">
          {zineSplitShowcase.items.map((item, index) => {
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
