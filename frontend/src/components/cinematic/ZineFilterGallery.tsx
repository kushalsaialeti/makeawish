import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_DATA = [
  {
    id: 1,
    category: 'GRITTY',
    image: 'https://images.unsplash.com/photo-1516961642265-531546e84af2?q=80&w=800&auto=format&fit=crop',
    caption: 'ENTRY 042 // CAMERA_REDACTED',
    subcaption: 'JULY 26, 1998',
    sticker: 'LOST_SIGHT',
    rotation: -3
  },
  {
    id: 2,
    category: 'CINEMATIC',
    image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=800&auto=format&fit=crop',
    caption: '"THEY NEVER SENT THE FLOWERS BUT I SAVED THE MEMORY ANYWAY."',
    subcaption: '',
    sticker: '',
    rotation: 2
  },
  {
    id: 3,
    category: 'REDACTED',
    image: 'https://images.unsplash.com/photo-1505672678657-cc7037095e60?q=80&w=800&auto=format&fit=crop',
    caption: 'LAST_LOOK',
    subcaption: 'REDACTED_LOCATION',
    sticker: '',
    rotation: 4
  },
  {
    id: 4,
    category: 'WARM',
    image: 'https://images.unsplash.com/photo-1517486430290-3565714faec7?q=80&w=800&auto=format&fit=crop',
    caption: '"THE LIGHTS WERE TOO BRIGHT TO FORGET."',
    subcaption: '',
    sticker: '',
    rotation: -2
  }
];

export const ZineFilterGallery = () => {
  const [filter, setFilter] = useState('ALL');
  const filters = ['ALL', 'GRITTY', 'WARM', 'CINEMATIC', 'REDACTED'];

  const filteredData = filter === 'ALL' ? MOCK_DATA : MOCK_DATA.filter(item => item.category === filter);

  return (
    <section className="relative w-full bg-[#151111] py-24 px-6 md:px-16 min-h-screen border-t border-white/10">
      
      {/* Huge Background Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
        <h2 className="text-[25vw] font-black text-white/5 whitespace-nowrap tracking-tighter mix-blend-overlay">
          UNFILTERED
        </h2>
      </div>

      <div className="relative z-10">
        {/* Filter Navigation */}
        <div className="flex flex-col md:flex-row md:items-center mb-24 space-y-4 md:space-y-0">
          <span className="font-mono text-xs uppercase text-white/50 mr-8 tracking-widest">
            FILTER_BY_VIBE:
          </span>
          <div className="flex flex-wrap gap-2">
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`border border-[#e6d0d2] px-4 py-1 font-mono text-xs uppercase tracking-widest transition-all ${
                  filter === f ? 'bg-[#e6d0d2] text-[#151111]' : 'text-[#e6d0d2] hover:bg-white/10'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid (Scattered) */}
        <div className="relative w-full max-w-6xl mx-auto min-h-[800px]">
          <AnimatePresence>
            {filteredData.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
                className={`md:absolute ${
                  index === 0 ? 'top-0 left-0 md:w-80' :
                  index === 1 ? 'top-10 left-1/2 -translate-x-1/2 md:w-96' :
                  index === 2 ? 'top-40 right-0 md:w-80' :
                  'bottom-0 left-1/3 md:w-72'
                } mb-16 md:mb-0`}
                style={{ rotate: `${item.rotation}deg` }}
              >
                {/* Photo Card */}
                <div className="bg-[#100c0c] border border-white/20 p-2 shadow-2xl relative group">
                  <div className="tape-strip -top-4 -left-4 w-16 h-6 transform -rotate-12" />
                  
                  <div className="aspect-square overflow-hidden bg-black">
                    <img 
                      src={item.image} 
                      alt="Gallery entry" 
                      className="w-full h-full object-cover filter grayscale contrast-125 group-hover:grayscale-0 transition-all duration-700"
                    />
                  </div>
                  
                  {/* Attached Paper Caption */}
                  <div className="absolute -bottom-8 left-4 right-4 bg-[#f3d4d6] p-3 shadow-lg border border-[#151111] transform rotate-1">
                    <p className="font-mono text-[10px] md:text-xs text-[#151111] font-bold uppercase leading-tight">
                      {item.caption}
                    </p>
                    {item.subcaption && (
                      <p className="font-mono text-[8px] text-[#151111]/70 mt-1">
                        {item.subcaption}
                      </p>
                    )}
                  </div>

                  {/* Red Sticker */}
                  {item.sticker && (
                    <div className="absolute -bottom-12 -left-6 bg-[#f3d4d6] text-[#7a1022] font-black text-sm px-3 py-1 transform -rotate-6 border border-[#7a1022]">
                      {item.sticker}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Floating Red Confidential Box */}
          <motion.div 
            initial={{ y: 0 }}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="hidden md:block absolute top-20 right-20 bg-[#7a1022] p-6 border border-[#e6d0d2]/20 transform rotate-12 shadow-2xl z-20 w-64"
          >
            <h4 className="text-[#e6d0d2] font-mono text-xs uppercase tracking-widest mb-4">
              CONFIDENTIAL_ARCHIVE
            </h4>
            <div className="space-y-2 mb-6">
              <div className="w-full h-2 bg-[#e6d0d2]/30" />
              <div className="w-4/5 h-2 bg-[#e6d0d2]/30" />
              <div className="w-1/2 h-2 bg-[#e6d0d2]/30" />
            </div>
            <p className="text-right text-[#e6d0d2] font-mono text-[10px] italic">
              STASH_02
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
