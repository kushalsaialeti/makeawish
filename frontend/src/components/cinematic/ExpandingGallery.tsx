import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GALLERY_DATA = [
  {
    id: 1,
    title: 'NATURE',
    subtitle: 'Floral fields',
    description: 'A vibrant field of flowers under a warm sun, showcasing nature\'s resilience.',
    image: 'https://images.unsplash.com/photo-1490750967868-88cb44cb2720?q=80&w=800&auto=format&fit=crop',
    bgColor: '#7a1022' // Deep red
  },
  {
    id: 2,
    title: 'EXPLORATION',
    subtitle: 'Golden hour',
    description: 'Looking towards the horizon, bathed in the golden light of dusk.',
    image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800&auto=format&fit=crop',
    bgColor: '#b85a1b' // Warm orange/brown
  },
  {
    id: 3,
    title: 'AMECA',
    subtitle: 'Engineered Arts',
    description: 'The latest and most advanced humanoid robot, a development platform where AI and machine learning systems can be tested.',
    image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=800&auto=format&fit=crop',
    bgColor: '#3b5998' // Muted blue
  },
  {
    id: 4,
    title: 'COSMOS',
    subtitle: 'Night sky',
    description: 'Gazing at the moon through a vibrant purple atmosphere.',
    image: 'https://images.unsplash.com/photo-1505672678657-cc7037095e60?q=80&w=800&auto=format&fit=crop',
    bgColor: '#4a154b' // Deep purple
  },
  {
    id: 5,
    title: 'DISCOVERY',
    subtitle: 'New frontiers',
    description: 'Finding life in unexpected places across the universe.',
    image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=800&auto=format&fit=crop',
    bgColor: '#2d4a22' // Dark green
  }
];

export const ExpandingGallery = () => {
  const [activeIndex, setActiveIndex] = useState(2);

  return (
    <motion.section 
      animate={{ backgroundColor: GALLERY_DATA[activeIndex].bgColor }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="relative w-full min-h-screen py-24 px-6 md:px-16 flex flex-col justify-center items-center overflow-hidden transition-colors"
    >
      
      {/* Top Header Placeholder */}
      <div className="absolute top-8 left-8 right-8 flex justify-between items-center text-white/80 font-sans text-xs font-bold tracking-widest">
        <div className="flex space-x-8">
          <span className="hover:text-white cursor-pointer transition-colors">NEW RELEASES</span>
          <span className="hover:text-white cursor-pointer transition-colors">3D ILLUS</span>
          <span className="hover:text-white cursor-pointer transition-colors">DIGITAL</span>
          <span className="hover:text-white cursor-pointer transition-colors">ART</span>
          <span className="hover:text-white cursor-pointer transition-colors">CUSTOMIZE</span>
        </div>
        <div className="flex space-x-4">
          <span className="cursor-pointer">USER</span>
          <span className="cursor-pointer">BAG</span>
        </div>
      </div>

      {/* Main Gallery Container */}
      <div className="flex flex-row items-center justify-center gap-4 w-full max-w-5xl h-[60vh] min-h-[400px]">
        {GALLERY_DATA.map((item, index) => {
          const isActive = activeIndex === index;
          
          return (
            <motion.div
              key={item.id}
              onClick={() => setActiveIndex(index)}
              layout
              initial={false}
              animate={{ 
                flex: isActive ? 3 : 1,
                borderRadius: isActive ? "32px" : "999px",
                opacity: isActive ? 1 : 0.7
              }}
              transition={{ 
                duration: 0.7, 
                ease: [0.32, 0.72, 0, 1] 
              }}
              className={`relative h-full overflow-hidden cursor-pointer group ${isActive ? 'shadow-2xl' : 'shadow-md hover:opacity-90'}`}
              style={{ minWidth: isActive ? "300px" : "80px" }}
            >
              <motion.img 
                src={item.image} 
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                animate={{ scale: isActive ? 1 : 1.1 }}
                transition={{ duration: 0.7 }}
              />
              
              {/* Overlay Gradient for text readability */}
              <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-700 ${isActive ? 'opacity-100' : 'opacity-0'}`} />

              {/* Text Content */}
              <AnimatePresence>
                {isActive && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, transition: { duration: 0.2 } }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="absolute bottom-0 left-0 w-full p-8 text-white"
                  >
                    <h3 className="text-3xl font-bold mb-2 tracking-wide">{item.title}</h3>
                    <p className="text-sm text-white/80 leading-relaxed max-w-sm">
                      {item.description}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Text Area to match reference */}
      <div className="w-full max-w-5xl mt-16 flex flex-col md:flex-row justify-between items-start text-white/80">
        <div className="mb-8 md:mb-0">
          <h2 className="text-3xl font-sans font-medium tracking-widest mb-4">AI ROBOTS</h2>
          <div className="text-xs uppercase tracking-widest leading-loose">
            <p>PUBLISHED</p>
            <p>NOV 06, 2020</p>
            <p className="mt-2">MORE DIGITAL ART:</p>
            <p className="font-bold text-white">BEHANCE MORE</p>
          </div>
        </div>
        
        <div className="max-w-md text-xs leading-relaxed opacity-80">
          <p>
            While many humanoid robots are still in the early stages of development, a few have escaped research and development, entering the real world as bartenders, receptionists, and companions.
          </p>
        </div>
      </div>

    </motion.section>
  );
};
