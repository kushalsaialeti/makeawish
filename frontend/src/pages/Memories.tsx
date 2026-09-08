import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useCmsStore } from '../store/cmsStore';
import { Eyebrow, Handwritten, DisplayBackground } from '../components/ui/Typography';

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
    <div className="min-h-screen bg-[#151111] flex flex-col items-center justify-center gap-4">
      <Eyebrow accent>LOADING ARCHIVE</Eyebrow>
      <div className="font-display italic text-3xl text-white animate-pulse">Loading Memories...</div>
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
    <div className="min-h-screen bg-[#151111] relative overflow-hidden flex flex-col items-center py-12 sm:py-16 px-3 sm:px-6 md:px-10 text-[#e6d0d2] font-sans">
      {/* Background Atmosphere */}
      <DisplayBackground text="MEMORIES" className="top-[5%] opacity-30" />

      {/* Decorated Wall Backdrop */}
      <div 
        className="absolute inset-0 z-0 opacity-30 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=2000&auto=format&fit=crop")' }} 
      />
      
      {/* Fairy Lights Overlay */}
      <div className="absolute top-0 left-0 w-full h-24 z-[2] flex justify-around pointer-events-none overflow-hidden">
        {[...Array(14)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.3, 0.9, 0.3] }}
            transition={{ repeat: Infinity, duration: 2 + Math.random() * 2 }}
            className="w-1.5 h-1.5 bg-amber-200 rounded-full shadow-[0_0_12px_#fef08a]"
            style={{ marginTop: Math.random() * 24 + 'px' }}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,transparent_20%,#151111_90%)] z-[1] pointer-events-none" />

      {/* Navigation: Back to Home */}
      <div className="fixed top-4 left-4 sm:top-6 sm:left-6 z-[100]">
        <motion.button
          whileHover={{ scale: 1.06, x: -3 }}
          whileTap={{ scale: 0.94 }}
          onClick={handleBack}
          className="flex items-center gap-2 bg-black/40 hover:bg-black/60 px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl backdrop-blur-xl text-white/90 transition-all border border-white/15 font-body font-bold uppercase tracking-[0.18em] text-xs shadow-2xl"
        >
          <span>←</span>
          <span>Return</span>
        </motion.button>
      </div>

      {/* Header Eyebrow & Title */}
      <div className="relative z-10 text-center mb-8 sm:mb-10 mt-6 px-2">
        <Eyebrow accent className="mb-2">EXHIBIT • MEMORY ARCHIVE</Eyebrow>
        <h1 className="font-display italic text-display-lg text-[#f5f1e8]">
          The Moments That Stayed
        </h1>
      </div>

      {/* Hero Section: Cinematic Monitor */}
      <div className="relative z-10 w-full max-w-5xl mb-16 sm:mb-20 md:mb-28 px-1 sm:px-2 md:px-0">
        <div className="relative aspect-video bg-[#1a1a1a] rounded-xl sm:rounded-2xl md:rounded-[2.5rem] p-1.5 sm:p-3 md:p-5 shadow-[0_25px_80px_rgba(0,0,0,0.8)] border-2 sm:border-4 md:border-8 border-[#2d2828]">
          <div className="w-full h-full bg-black rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden relative border border-white/10">
            {/* Scanlines */}
            <div className="absolute inset-0 pointer-events-none z-30 opacity-15 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_3px]" />
            
            {memories.tvType === 'video' ? (
              <div className="w-full h-full bg-black">
                {memories.tvVideoUrls && memories.tvVideoUrls.length > 0 ? (
                  <video 
                    key={currentVideoIndex}
                    src={memories.tvVideoUrls[currentVideoIndex]} 
                    autoPlay muted playsInline 
                    onEnded={() => setCurrentVideoIndex((prev) => (prev + 1) % memories.tvVideoUrls.length)}
                    className="w-full h-full object-cover grayscale-[20%] sepia-[15%] contrast-125"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/30 font-body text-xs uppercase tracking-widest">No Video Content</div>
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
                    className="w-full h-full object-cover grayscale-[20%] sepia-[15%] contrast-125"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/30 font-body text-xs uppercase tracking-widest">No Slideshow Content</div>
                )}
              </AnimatePresence>
            )}
          </div>
          
          {/* Monitor Indicator */}
          <div className="absolute bottom-3 right-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.8)] animate-pulse" />
            <span className="font-body text-[9px] uppercase tracking-widest text-white/40">LIVE REEL</span>
          </div>
        </div>
      </div>

      {/* Dynamic Polaroids Wall */}
      <div className="relative z-10 w-full max-w-7xl">
        <div className="flex flex-col items-center mb-12 text-center">
          <Eyebrow className="mb-2">POLAROID COLLECTION</Eyebrow>
          <p className="font-body text-xs md:text-sm text-white/50 tracking-wider">
            Tap any polaroid to flip and read handwritten memories
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 md:gap-10 pb-20">
          {displayPolaroids.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95, rotate: i % 2 === 0 ? -3 : 3 }}
              whileInView={{ opacity: 1, scale: 1, rotate: i % 2 === 0 ? -2 : 2 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 8) * 0.08 }}
              className="relative aspect-[4/5]"
            >
              <motion.div
                animate={{ rotateY: flippedIndex === i ? 180 : 0 }}
                transition={{ duration: 0.7, type: 'spring', stiffness: 200, damping: 20 }}
                className="w-full h-full relative cursor-pointer"
                style={{ transformStyle: 'preserve-3d' }}
                onClick={() => setFlippedIndex(flippedIndex === i ? null : i)}
              >
                {/* Front: Image */}
                <div 
                  className="absolute inset-0 bg-white p-3 pb-12 shadow-2xl rounded-sm border border-gray-100 overflow-hidden"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <div className="w-full h-full bg-gray-50 overflow-hidden rounded-sm relative">
                    {item.url ? (
                      <img src={item.url} alt="Memory" className="w-full h-full object-cover sepia-[0.1] contrast-110" />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 font-body text-xs">No Image</div>
                    )}
                  </div>
                  {/* Scotch Tape Effect */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-6 bg-white/30 backdrop-blur-sm border border-white/20 -rotate-3 z-10" />
                  
                  <div className="absolute bottom-3 left-0 w-full text-center">
                    <Handwritten color="#8a6b4f" className="text-sm">Click to flip note ↺</Handwritten>
                  </div>
                </div>

                {/* Back: Handwritten Note */}
                <div 
                  className="absolute inset-0 bg-[#faf6ee] p-6 md:p-8 shadow-2xl rounded-sm border border-[#e2dac8] flex flex-col items-center justify-center text-center paper-texture overflow-hidden"
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                  <div className="w-8 h-0.5 bg-[#8a6b4f]/30 mb-4" />
                  <Handwritten color="#24211d" className="text-xl md:text-2xl leading-relaxed overflow-y-auto max-h-[80%] px-2">
                    "{item.text}"
                  </Handwritten>
                  <div className="mt-4 w-8 h-0.5 bg-[#8a6b4f]/30" />
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
