import { motion } from 'framer-motion';

export const ZineHero = () => {
  return (
    <section className="relative min-h-[90vh] w-full flex flex-col justify-center overflow-hidden bg-[#151111] px-6 md:px-16 pt-24 border-b border-white/10">
      
      {/* Background Graphic elements representing the gold flares */}
      <div className="absolute inset-0 pointer-events-none opacity-40 z-0">
        <div className="absolute top-[-20%] left-[20%] w-[1px] h-[150%] bg-gradient-to-b from-transparent via-[#cca471] to-transparent transform rotate-12 blur-[2px]" />
        <div className="absolute top-[-10%] left-[50%] w-[1px] h-[150%] bg-gradient-to-b from-transparent via-[#cca471] to-transparent transform -rotate-12 blur-[2px]" />
        <div className="absolute top-[10%] right-[30%] w-[2px] h-[120%] bg-gradient-to-b from-transparent via-[#cca471] to-transparent transform rotate-45 blur-[4px]" />
      </div>

      <div className="relative z-10 max-w-5xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col mb-8"
        >
          <h1 className="text-[12vw] md:text-[8rem] font-black leading-[0.8] tracking-tighter text-[#e6d0d2]">
            RAW
          </h1>
          <h1 className="text-[12vw] md:text-[8rem] font-black leading-[0.8] tracking-tighter text-[#7a1022] -mt-2">
            MEMORIES
          </h1>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="max-w-md"
        >
          <p className="uppercase text-xs tracking-widest text-white/60 mb-8 leading-relaxed font-mono">
            A visceral archive of the unfiltered. A digital scrapbook for a generation that refuses to be curated.
          </p>

          <button className="paper-texture text-xl font-bold tracking-widest uppercase px-8 py-4 border-2 border-transparent hover:border-white transition-all shadow-[8px_8px_0_0_#7a1022]">
            Enter the Void
          </button>
        </motion.div>
      </div>

      {/* Floating Image Top Right */}
      <motion.div 
        initial={{ opacity: 0, rotate: 10, x: 50 }}
        animate={{ opacity: 1, rotate: -5, x: 0 }}
        transition={{ delay: 0.6, duration: 1.2, ease: "easeOut" }}
        className="absolute top-32 right-12 md:right-32 w-48 md:w-64 aspect-[3/4] border-4 border-white/10 z-20 shadow-2xl"
      >
        {/* Placeholder image from Unsplash matching the vibe */}
        <img 
          src="https://images.unsplash.com/photo-1517486430290-3565714faec7?q=80&w=800&auto=format&fit=crop" 
          alt="Vintage memory" 
          className="w-full h-full object-cover filter grayscale contrast-125 brightness-75"
        />
        <div className="tape-strip top-[-10px] right-4 w-16 h-6 transform rotate-3" />
      </motion.div>

      {/* EST 2024 Badge */}
      <div className="absolute bottom-[-15px] left-1/4 transform -translate-x-1/2 z-30">
        <div className="bg-[#7a1022] text-[#f3d4d6] text-xs font-mono font-bold px-6 py-2 transform -rotate-6 border border-[#151111] shadow-lg">
          EST. 2024
        </div>
      </div>
    </section>
  );
};
