import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useCmsStore } from '../store/cmsStore';

export const Memories: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { memories, currentWishSlug, fetchWishBySlug, subscribeToWish, isLoading } = useCmsStore();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (slug && slug !== currentWishSlug) {
      fetchWishBySlug(slug);
    }
    if (slug) {
      const unsubscribe = subscribeToWish(slug);
      return () => unsubscribe();
    }
  }, [slug, currentWishSlug, fetchWishBySlug, subscribeToWish]);

  useEffect(() => {
    if (memories?.tvType === 'slideshow' && memories.tvSlideshowImages && memories.tvSlideshowImages.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % memories.tvSlideshowImages.length);
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [memories]);

  if (isLoading) return (
    <div className="min-h-screen bg-[#1c1917] flex items-center justify-center">
      <div className="text-white font-serif italic text-2xl animate-pulse">Loading Memories...</div>
    </div>
  );

  if (!memories || !memories.polaroids) return null;

  const displayPolaroids = memories.polaroids;

  const handleBack = () => {
    if (slug) {
      navigate(`/${slug}`);
    } else if (currentWishSlug) {
      navigate(`/${currentWishSlug}`);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#1c1917] relative overflow-hidden flex flex-col items-center py-12 px-4 md:px-10">
      {/* Background Image (Decorated Wall with Balloons/Lights) */}
      <div 
        className="absolute inset-0 z-0 opacity-40 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=2000&auto=format&fit=crop")' }} 
      />
      
      {/* Fairy Lights Effect Overlay */}
      <div className="absolute top-0 left-0 w-full h-20 z-[2] flex justify-around pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 2 + Math.random() * 2 }}
            className="w-1 h-1 bg-yellow-200 rounded-full shadow-[0_0_10px_#fef08a]"
            style={{ marginTop: Math.random() * 20 + 'px' }}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,transparent_20%,#1c1917_90%)] z-[1] pointer-events-none" />

      {/* Navigation: Back to Home */}
      <div className="fixed top-6 left-6 z-[100]">
        <motion.button
          whileHover={{ scale: 1.1, x: -5 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleBack}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full backdrop-blur-xl text-white/80 transition-colors border border-white/20 font-bold uppercase tracking-widest text-[10px] shadow-2xl"
        >
          <span className="text-sm">←</span>
          <span>Back to Site</span>
        </motion.button>
      </div>

      {/* Hero Section: Vintage TV */}
      <div className="relative z-10 w-full max-w-5xl mb-16 md:mb-32 mt-10 px-2 md:px-0">
        <div className="relative aspect-[4/3] bg-[#2d2a28] rounded-[2rem] md:rounded-[4rem] p-3 md:p-10 shadow-[0_0_80px_rgba(0,0,0,0.8)] border-[8px] md:border-[18px] border-[#3f3b39]">
          <div className="w-full h-full bg-black rounded-[1.2rem] md:rounded-[3rem] overflow-hidden relative border-2 md:border-8 border-[#1c1917]">
             {/* TV Scanlines */}
            <div className="absolute inset-0 pointer-events-none z-30 opacity-30 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />
            
            {/* Old Film Overlay */}
            <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden mix-blend-overlay opacity-60">
                <div className="absolute inset-0 animate-flicker bg-white/5" />
                <div className="absolute inset-0 bg-[url('https://media.giphy.com/media/3o7TKMGpxPucV53Wnu/giphy.gif')] opacity-20 bg-cover mix-blend-screen grayscale" />
            </div>

            {memories.tvType === 'video' ? (
              <div className="w-full h-full bg-black">
                {memories.tvVideoUrls && memories.tvVideoUrls.length > 0 ? (
                  <video 
                    key={currentVideoIndex}
                    src={memories.tvVideoUrls[currentVideoIndex]} 
                    autoPlay muted playsInline 
                    onEnded={() => setCurrentVideoIndex((prev) => (prev + 1) % memories.tvVideoUrls.length)}
                    className="w-full h-full object-cover grayscale-[0.4] sepia-[0.3] contrast-125"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/10 font-mono text-[10px] uppercase tracking-widest">No Video Content</div>
                )}
              </div>
            ) : (
              <AnimatePresence mode="wait">
                  {memories.tvSlideshowImages[currentSlide] ? (
                    <motion.img
                      key={currentSlide}
                      src={memories.tvSlideshowImages[currentSlide]}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1 }}
                      className="w-full h-full object-cover grayscale-[0.4] sepia-[0.3] contrast-125"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/10 font-mono text-[10px] uppercase tracking-widest">No Slideshow Content</div>
                  )}
              </AnimatePresence>
            )}
          </div>
          {/* TV Details: Knobs & Buttons */}
          <div className="absolute right-[1%] top-1/2 -translate-y-1/2 flex flex-col gap-3 md:gap-8 items-center pr-1 md:pr-4">
            <div className="w-6 h-6 md:w-16 md:h-16 rounded-full bg-[#3f3b39] shadow-inner border-2 md:border-4 border-black/30 flex items-center justify-center">
              <div className="w-1 h-3 md:w-2 md:h-8 bg-black/40 rounded-full rotate-45" />
            </div>
            <div className="w-6 h-6 md:w-16 md:h-16 rounded-full bg-[#3f3b39] shadow-inner border-2 md:border-4 border-black/30 flex items-center justify-center">
              <div className="w-1 h-3 md:w-2 md:h-8 bg-black/40 rounded-full -rotate-12" />
            </div>
            <div className="hidden md:flex flex-col gap-2 mt-4">
              <div className="w-12 h-1 bg-black/20 rounded-full" />
              <div className="w-12 h-1 bg-black/20 rounded-full" />
              <div className="w-12 h-1 bg-black/20 rounded-full" />
            </div>
          </div>
        </div>
        {/* Shadow floor */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-4/5 h-10 bg-black/60 blur-3xl rounded-full" />
      </div>

      {/* Dynamic Polaroids Grid - Responsive and Collision-free */}
      <div className="relative z-10 w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-12 pb-20">
        {displayPolaroids.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9, rotate: i % 2 === 0 ? -3 : 3 }}
            animate={{ opacity: 1, scale: 1, rotate: i % 2 === 0 ? -2 : 2 }}
            transition={{ delay: (i % 8) * 0.1 }}
            className="relative aspect-[4/5] perspective-1000"
          >
            <motion.div
              animate={{ rotateY: flippedIndex === i ? 180 : 0 }}
              transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
              className="w-full h-full relative"
              style={{ transformStyle: 'preserve-3d' }}
              onClick={() => setFlippedIndex(flippedIndex === i ? null : i)}
            >
              {/* Front: Image */}
              <div 
                className="absolute inset-0 bg-white p-3 pb-12 shadow-2xl rounded-sm border border-gray-100 cursor-pointer overflow-hidden"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <div className="w-full h-full bg-gray-50 overflow-hidden rounded-sm relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-amber-900/10 via-transparent to-white/10 pointer-events-none" />
                  {item.url ? (
                    <img src={item.url} alt="Memory" className="w-full h-full object-cover sepia-[0.15] contrast-110" />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300 font-serif italic text-[10px]">No Image</div>
                  )}
                </div>
                {/* Decorative Scotch Tape Effect */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-6 bg-white/20 backdrop-blur-sm border border-white/10 -rotate-3 z-10" />
                
                <div className="absolute bottom-3 left-0 w-full text-[11px] text-center text-gray-400 font-serif italic tracking-wide">
                  Click to Read Note
                </div>
              </div>

              {/* Back: Text */}
              <div 
                className="absolute inset-0 bg-[#fffef0] p-6 md:p-8 shadow-2xl rounded-sm border border-gray-100 flex flex-col items-center justify-center text-center cursor-pointer"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                <div className="w-8 h-0.5 bg-amber-200/50 mb-6" />
                <p className="text-amber-950 font-serif italic text-sm md:text-base leading-relaxed overflow-y-auto max-h-[80%] px-2">
                  "{item.text}"
                </p>
                <div className="mt-6 w-8 h-0.5 bg-amber-200/50" />
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Floating Fairy Lights scattered */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ 
            y: [0, -10, 0],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 3 + Math.random() * 2,
            delay: Math.random() * 2
          }}
          className="fixed w-2 h-2 bg-yellow-100 rounded-full blur-[2px] z-[3] pointer-events-none"
          style={{ 
            left: Math.random() * 100 + '%', 
            top: Math.random() * 100 + '%' 
          }}
        />
      ))}

      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        @keyframes flicker {
          0% { opacity: 0.1; }
          5% { opacity: 0.2; }
          10% { opacity: 0.1; }
          15% { opacity: 0.3; }
          20% { opacity: 0.15; }
          25% { opacity: 0.1; }
          30% { opacity: 0.25; }
          35% { opacity: 0.1; }
          40% { opacity: 0.15; }
          45% { opacity: 0.2; }
          50% { opacity: 0.1; }
          55% { opacity: 0.3; }
          60% { opacity: 0.15; }
          65% { opacity: 0.1; }
          70% { opacity: 0.25; }
          75% { opacity: 0.1; }
          80% { opacity: 0.15; }
          85% { opacity: 0.2; }
          90% { opacity: 0.1; }
          95% { opacity: 0.3; }
          100% { opacity: 0.15; }
        }
        .animate-flicker {
          animation: flicker 0.15s infinite;
        }
      `}</style>
    </div>
  );
};
