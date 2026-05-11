import { motion } from 'framer-motion';
import { useCmsStore } from '../../store/cmsStore';

export const ZineArchive = () => {
  const { zineArchive } = useCmsStore();
  
  if (!zineArchive) return null;

  return (
    <section className="relative w-full bg-[#151111] py-24 px-6 md:px-16 overflow-hidden">
      
      {/* Section Header */}
      <div className="flex justify-between items-end mb-16 border-b border-white/10 pb-4">
        <h2 className="text-5xl md:text-7xl font-black text-[#e6d0d2] tracking-wider uppercase">
          {zineArchive.sectionHeading}
        </h2>
        <a href="#memories" className="hidden md:block text-xs font-mono uppercase tracking-widest border-b border-white/30 hover:border-white pb-1">
          {zineArchive.viewAllText}
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 relative z-10">
        
        {/* Main Large Image (Left) */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="md:col-span-6 relative"
        >
          <div className="border border-white/20 p-2 bg-[#100c0c] shadow-2xl relative group">
            <div className="relative aspect-[4/5] overflow-hidden">
              <img 
                src={zineArchive.leftImage} 
                alt="Vintage camera" 
                className="w-full h-full object-cover filter grayscale contrast-125 transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-red-900/20 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            
            {/* Metadata Footer */}
            <div className="flex justify-between items-center mt-2 text-[10px] font-mono text-white/50 border-t border-white/10 pt-2 uppercase">
              <span>{zineArchive.leftImageName}</span>
              <span className="text-[#7a1022]">{zineArchive.leftImageStatus}</span>
            </div>
            
            {/* Red Border Overlay */}
            <div className="absolute -inset-1 border border-[#7a1022] z-[-1] transform translate-x-3 translate-y-3 opacity-50" />
          </div>

          {/* Overlapping Sticky Note */}
          <motion.div 
            initial={{ opacity: 0, rotate: -15 }}
            whileInView={{ opacity: 1, rotate: -5 }}
            viewport={{ once: true }}
            className="absolute -bottom-12 -right-8 md:-right-16 w-64 aspect-square paper-texture p-6 flex items-center justify-center border border-[#151111] shadow-xl z-30"
          >
            <p className="font-mono text-sm text-center font-bold text-[#151111] transform rotate-2">
              {zineArchive.stickyNoteText}
            </p>
          </motion.div>
        </motion.div>

        {/* Right Column (Small Image + Form) */}
        <div className="md:col-span-6 flex flex-col space-y-16 mt-16 md:mt-0">
          
          {/* Top Right Image */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full max-w-md mx-auto relative group"
          >
            <div className="border border-white/20 p-2 bg-[#100c0c]">
              <div className="aspect-square overflow-hidden relative">
                <img 
                  src={zineArchive.rightImage} 
                  alt="Roses and ticket" 
                  className="w-full h-full object-cover filter contrast-125 saturate-50 group-hover:saturate-100 transition-all duration-700"
                />
              </div>
              <div className="mt-2 text-[10px] font-mono text-white/50 border-t border-white/10 pt-2 uppercase">
                <span>{zineArchive.rightImageName}</span>
                <span className="block mt-1">{zineArchive.rightImageDate}</span>
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
            <div className="bg-[#7a1022] p-8 border border-[#e6d0d2]/20 transform rotate-2 shadow-2xl relative z-10">
              <h3 className="text-2xl font-black text-[#e6d0d2] mb-4 uppercase tracking-widest">
                {zineArchive.formHeading}
              </h3>
              <p className="font-mono text-[10px] text-[#e6d0d2]/80 uppercase leading-relaxed mb-6">
                {zineArchive.formDesc}
              </p>
              
              <div className="flex">
                <input 
                  type="text" 
                  placeholder={zineArchive.formPlaceholder} 
                  className="w-full bg-transparent border border-[#e6d0d2]/30 p-2 font-mono text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-white"
                />
                <button className="bg-[#e6d0d2] text-[#7a1022] font-black uppercase px-4 text-xs ml-2 hover:bg-white transition-colors">
                  {zineArchive.formBtnText}
                </button>
              </div>
            </div>
            
            {/* Decorative Tape */}
            <div className="tape-strip -top-4 right-10 w-20 h-6 transform -rotate-6" />
          </motion.div>

        </div>
      </div>
    </section>
  );
};
