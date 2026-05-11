import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Only visible on the landing page (Home route)
  // We hide it if we are on any other route like /admin or /memories
  const isHomePage = location.pathname === '/' || location.pathname.startsWith('/wish/');

  return (
    <AnimatePresence>
      {isHomePage && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.8, x: 20 }}
          className="fixed top-4 right-4 md:top-8 md:right-8 z-[120]"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/memories')}
            className="relative group flex flex-col items-center"
          >
            {/* The Vintage Zenit-E Camera Body - Scaled Down */}
            <div className="relative w-16 h-11 md:w-20 md:h-14 bg-[#222] rounded-sm shadow-2xl border-x border-[#555] overflow-hidden">
              {/* Silver Top Plate */}
              <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-b from-[#888] to-[#666] border-b border-black/40" />
              
              {/* Silver Bottom Plate */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-[#777]" />
              
              {/* Leather Texture Middle */}
              <div className="absolute top-3 bottom-1 left-0 w-full bg-[#111] opacity-90" style={{ backgroundImage: 'radial-gradient(#222 1px, transparent 0)', backgroundSize: '3px 3px' }} />

              {/* Viewfinder Bump */}
              <div className="absolute top-[-3px] left-1/2 -translate-x-1/2 w-7 h-4 bg-[#666] rounded-t-sm border-t border-x border-white/20" />

              {/* Shutter Button & Dial */}
              <div className="absolute top-[-1px] right-1.5 w-3 h-2 bg-[#888] rounded-full border border-black/20" />
              <div className="absolute top-[-1px] left-1.5 w-2 h-1.5 bg-[#888] rounded-sm" />

              {/* The Big Prominent Lens */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 md:w-11 md:h-11 rounded-full bg-[#333] border-2 border-[#555] flex items-center justify-center shadow-lg">
                <div className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-black border-2 border-white/10 flex items-center justify-center overflow-hidden">
                   {/* Lens Glass Glare */}
                   <div className="w-full h-full bg-gradient-to-tr from-blue-900/20 via-transparent to-white/10" />
                   <div className="absolute w-3 h-3 rounded-full bg-white/5 top-2 right-2 blur-[1px]" />
                </div>
              </div>

              {/* Small Details */}
              <div className="absolute top-4 left-1.5 w-1 h-1 rounded-full bg-red-600 shadow-[0_0_5px_rgba(220,38,38,0.5)] scale-75" /> {/* Red Dot */}
              <div className="absolute top-8 right-1 w-1 h-2 bg-[#444] rounded-full" />
            </div>

            {/* Label */}
            <motion.span 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-[8px] md:text-[10px] font-black text-white/50 uppercase tracking-[0.2em] group-hover:text-white transition-colors"
            >
              Memories
            </motion.span>

            {/* Hover Glare */}
            <motion.div
              animate={{ x: [-100, 200] }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 pointer-events-none"
            />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
