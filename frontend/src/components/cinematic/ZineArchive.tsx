import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCmsStore } from '../../store/cmsStore';
import { Eyebrow, Handwritten, DisplayBackground } from '../ui/Typography';

export const ZineArchive = () => {
  const { zineArchive, currentWishSlug } = useCmsStore();
  
  if (!zineArchive) return null;

  return (
    <section className="relative w-full bg-[#151111] py-16 sm:py-24 md:py-28 px-4 sm:px-8 md:px-16 overflow-hidden border-b border-white/10">
      <DisplayBackground text="ARCHIVE" className="top-[10%] opacity-35" />

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 sm:mb-16 border-b border-white/10 pb-6 gap-4 relative z-10">
        <div>
          <Eyebrow accent className="mb-2 text-[10px] sm:text-xs">CHAPTER 03 • ARCHIVAL VAULT</Eyebrow>
          <h2 className="font-display italic text-display-lg text-[#f5f1e8] tracking-tight">
            {zineArchive.sectionHeading}
          </h2>
        </div>
        <Link 
          to={`/${currentWishSlug}/memories`} 
          className="font-body text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-pink-300/80 hover:text-white border-b border-pink-400/40 hover:border-white pb-1 transition-all inline-flex items-center gap-2"
        >
          <span>{zineArchive.viewAllText}</span>
          <span>→</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 relative z-10 max-w-7xl mx-auto items-start">
        
        {/* Main Large Image (Left) */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="md:col-span-6 relative w-full"
        >
          <div className="border border-white/15 p-2.5 sm:p-3 bg-[#110d0d] shadow-2xl rounded-2xl sm:rounded-3xl relative group overflow-hidden">
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl sm:rounded-2xl">
              <img 
                src={zineArchive.leftImage} 
                alt="Archived capture" 
                className="w-full h-full object-cover filter grayscale-[20%] contrast-125 transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-rose-950/20 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            
            {/* Metadata Footer */}
            <div className="flex justify-between items-center mt-3 text-[10px] sm:text-[11px] font-body text-white/60 border-t border-white/10 pt-2.5 uppercase tracking-widest">
              <span className="font-semibold truncate max-w-[160px] sm:max-w-none">{zineArchive.leftImageName}</span>
              <span className="text-pink-400 font-bold shrink-0">{zineArchive.leftImageStatus}</span>
            </div>
          </div>

          {/* Overlapping Handwritten Sticky Note */}
          <motion.div 
            initial={{ opacity: 0, rotate: -12, scale: 0.9 }}
            whileInView={{ opacity: 1, rotate: -4, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="absolute -bottom-6 sm:-bottom-8 md:-bottom-10 right-0 sm:-right-4 md:-right-8 w-44 sm:w-56 md:w-64 aspect-square paper-texture p-4 sm:p-6 flex items-center justify-center border border-[#3d2f21]/20 shadow-[0_15px_35px_rgba(0,0,0,0.6)] z-30 rounded-lg"
          >
            <Handwritten color="#24211d" className="text-base sm:text-xl md:text-2xl text-center leading-snug">
              {zineArchive.stickyNoteText}
            </Handwritten>
          </motion.div>
        </motion.div>

        {/* Right Column (Small Image + Form) */}
        <div className="md:col-span-6 flex flex-col space-y-10 sm:space-y-12 mt-8 md:mt-0 w-full">
          
          {/* Top Right Image */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full max-w-md mx-auto relative group"
          >
            <div className="border border-white/15 p-2.5 sm:p-3 bg-[#110d0d] rounded-2xl sm:rounded-3xl shadow-xl">
              <div className="aspect-square overflow-hidden relative rounded-xl sm:rounded-2xl">
                <img 
                  src={zineArchive.rightImage} 
                  alt="Archive detail" 
                  className="w-full h-full object-cover filter contrast-125 saturate-75 group-hover:saturate-100 transition-all duration-700 group-hover:scale-105"
                />
              </div>
              <div className="mt-3 text-[10px] sm:text-[11px] font-body text-white/60 border-t border-white/10 pt-2.5 uppercase tracking-widest flex justify-between">
                <span className="font-semibold truncate max-w-[160px] sm:max-w-none">{zineArchive.rightImageName}</span>
                <span className="text-white/40">{zineArchive.rightImageDate}</span>
              </div>
            </div>
          </motion.div>

          {/* Submission Form Block */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full max-w-md mx-auto relative"
          >
            <div className="bg-gradient-to-br from-[#7a1022] to-[#4a0b15] p-6 sm:p-8 rounded-3xl border border-white/20 shadow-2xl relative z-10">
              <h3 className="font-display italic text-2xl md:text-3xl text-white mb-2 leading-tight">
                {zineArchive.formHeading}
              </h3>
              <p className="font-body text-xs text-white/80 leading-relaxed mb-6">
                {zineArchive.formDesc}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="text" 
                  placeholder={zineArchive.formPlaceholder} 
                  className="w-full bg-black/30 border border-white/20 rounded-xl px-4 py-3 font-body text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-white transition-colors"
                />
                <button className="bg-white text-[#7a1022] hover:bg-pink-100 font-body font-black uppercase tracking-widest px-6 py-3 rounded-xl text-xs whitespace-nowrap transition-all shadow-lg active:scale-95">
                  {zineArchive.formBtnText}
                </button>
              </div>
            </div>
            
            {/* Decorative Tape */}
            <div className="tape-strip -top-3 right-6 sm:right-8 w-20 sm:w-24 h-5 sm:h-6 transform -rotate-3 rounded-sm" />
          </motion.div>

        </div>
      </div>
    </section>
  );
};
