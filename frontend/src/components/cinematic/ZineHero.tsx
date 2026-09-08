import { motion } from 'framer-motion';
import { Eyebrow, DisplayBackground } from '../ui/Typography';

export const ZineHero = () => {
  return (
    <section className="relative min-h-[90vh] w-full flex flex-col justify-center overflow-hidden bg-[#151111] px-6 md:px-16 pt-24 border-b border-white/10 font-sans">
      <DisplayBackground text="UNFILTERED" className="opacity-30" />

      {/* Background Graphic elements representing the gold flares */}
      <div className="absolute inset-0 pointer-events-none opacity-30 z-0">
        <div className="absolute top-[-20%] left-[20%] w-[1px] h-[150%] bg-gradient-to-b from-transparent via-[#cca471] to-transparent transform rotate-12 blur-[2px]" />
        <div className="absolute top-[-10%] left-[50%] w-[1px] h-[150%] bg-gradient-to-b from-transparent via-[#cca471] to-transparent transform -rotate-12 blur-[2px]" />
        <div className="absolute top-[10%] right-[30%] w-[2px] h-[120%] bg-gradient-to-b from-transparent via-[#cca471] to-transparent transform rotate-45 blur-[4px]" />
      </div>

      <div className="relative z-10 max-w-5xl">
        <div className="mb-4">
          <Eyebrow accent>CURATED MEMORY ARCHIVE</Eyebrow>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col mb-8"
        >
          <h1 className="font-display italic text-display-hero text-[#f5f1e8] leading-[0.84]">
            RAW
          </h1>
          <h1 className="font-display italic text-display-hero text-pink-300 -mt-3 md:-mt-6 leading-[0.84]">
            MEMORIES
          </h1>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="max-w-md space-y-8"
        >
          <p className="font-body text-sm md:text-base text-white/70 leading-relaxed">
            A visceral archive of the unfiltered. A digital scrapbook for a generation that cherishes authentic emotion.
          </p>

          <button className="bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 text-white font-body font-black text-xs uppercase tracking-[0.2em] px-8 py-4 rounded-2xl shadow-xl hover:opacity-90 transition-all active:scale-95">
            Enter the Void ✨
          </button>
        </motion.div>
      </div>

      {/* Floating Image Top Right */}
      <motion.div 
        initial={{ opacity: 0, rotate: 10, x: 50 }}
        animate={{ opacity: 1, rotate: -5, x: 0 }}
        transition={{ delay: 0.6, duration: 1.2, ease: "easeOut" }}
        className="absolute top-32 right-12 md:right-32 w-48 md:w-64 aspect-[3/4] border border-white/20 z-20 shadow-2xl rounded-2xl overflow-hidden bg-black/40 p-2"
      >
        <img 
          src="https://images.unsplash.com/photo-1517486430290-3565714faec7?q=80&w=800&auto=format&fit=crop" 
          alt="Vintage memory" 
          className="w-full h-full object-cover filter grayscale contrast-125 rounded-xl"
        />
        <div className="tape-strip top-[-8px] right-4 w-16 h-5 transform rotate-3 rounded-sm" />
      </motion.div>
    </section>
  );
};
