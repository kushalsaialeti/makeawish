import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCmsStore } from '../../store/cmsStore';

interface SplashSequenceProps {
  onComplete: () => void;
}

export const SplashSequence: React.FC<SplashSequenceProps> = ({ onComplete }) => {
  const { splashScreen, fetchCmsContent } = useCmsStore();
  const [step, setStep] = useState<'locked' | 'prompt'>('locked');

  useEffect(() => {
    fetchCmsContent();
  }, [fetchCmsContent]);

  if (!splashScreen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black text-white font-mono flex flex-col items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        {step === 'locked' && (
          <CombinedLockScreen 
            key="locked" 
            targetDate={splashScreen.targetDate}
            correctPin={{ m: splashScreen.correctMonth, d: splashScreen.correctDay, y: splashScreen.correctYear }}
            onUnlock={() => setStep('prompt')} 
          />
        )}
        {step === 'prompt' && (
          <PromptScreen 
            key="prompt" 
            heading={splashScreen.promptHeading}
            btnNow={splashScreen.btnNowText}
            btnLater={splashScreen.btnLaterText}
            onNext={onComplete} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// --- STEP 1: COMBINED TIMER & DOB LOCK ---
const CombinedLockScreen: React.FC<{ targetDate: string, correctPin: {m:string, d:string, y:string}, onUnlock: () => void }> = ({ targetDate, correctPin, onUnlock }) => {
  const [time, setTime] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState(false);

  // Default selections to the first item
  const [selectedM, setSelectedM] = useState('01');
  const [selectedD, setSelectedD] = useState('01');
  const [selectedY, setSelectedY] = useState('1995');

  // Calculate time remaining
  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference > 0) {
        setTime({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          mins: Math.floor((difference / 1000 / 60) % 60),
          secs: Math.floor((difference / 1000) % 60)
        });
      }
    };
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const handleUnlock = () => {
    if (selectedM === correctPin.m && selectedD === correctPin.d && selectedY === correctPin.y) {
      setError(false);
      setUnlocked(true);
      setTimeout(onUnlock, 1500);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, filter: "blur(20px)" }}
      transition={{ duration: 1 }}
      className="flex flex-col items-center justify-start w-full h-full relative pt-20 md:pt-32"
    >
      {/* Top Center Countdown */}
      <div className="flex space-x-3 md:space-x-6 text-3xl md:text-6xl font-black tracking-widest tabular-nums mb-16 md:mb-24">
        <TimeBox value={time.days} label="DAYS" />
        <span className="opacity-50 animate-pulse">:</span>
        <TimeBox value={time.hours} label="HOURS" />
        <span className="opacity-50 animate-pulse">:</span>
        <TimeBox value={time.mins} label="MINUTES" />
        <span className="opacity-50 animate-pulse">:</span>
        <TimeBox value={time.secs} label="SECONDS" />
      </div>

      {/* DOB Lock Below Timer */}
      <div className="flex flex-col items-center">
        <h2 className={`text-xs md:text-sm tracking-[0.3em] uppercase mb-8 transition-colors ${error ? 'text-red-500' : 'text-white/50'}`}>
          {unlocked ? 'ACCESS GRANTED' : error ? 'ACCESS DENIED' : 'ENTER DOB TO UNLOCK'}
        </h2>
        
        <div className="flex space-x-4 md:space-x-8 items-center h-48 md:h-64 relative overflow-hidden mask-edges px-4">
          <div className={`absolute top-1/2 -translate-y-1/2 left-0 w-full h-12 md:h-16 border-y-2 pointer-events-none z-10 transition-colors ${error ? 'border-red-500/50' : 'border-white/20'}`} />
          <div className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-12 text-xl md:text-3xl opacity-50 z-10">&rarr;</div>
          
          <WheelPicker items={Array.from({length: 12}, (_, i) => (i + 1).toString().padStart(2, '0'))} onSelect={setSelectedM} />
          <WheelPicker items={Array.from({length: 31}, (_, i) => (i + 1).toString().padStart(2, '0'))} onSelect={setSelectedD} />
          <WheelPicker items={Array.from({length: 30}, (_, i) => (1995 + i).toString())} onSelect={setSelectedY} />
        </div>

        <button 
          onClick={handleUnlock}
          className={`mt-12 md:mt-16 px-8 md:px-12 py-3 md:py-4 border transition-all text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold ${
            unlocked ? 'bg-white text-black border-white' : error ? 'border-red-500 text-red-500 bg-red-500/10' : 'border-white/20 hover:border-white hover:bg-white/10 text-white'
          }`}
        >
          {unlocked ? 'UNLOCKED' : 'SUBMIT PIN'}
        </button>
      </div>

      <style>{`
        .mask-edges {
          mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
          -webkit-mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
        }
      `}</style>
    </motion.div>
  );
};

const TimeBox = ({ value, label }: { value: number, label: string }) => (
  <div className="flex flex-col items-center">
    <motion.div 
      key={value}
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="relative"
    >
      {value.toString().padStart(2, '0')}
    </motion.div>
    <span className="text-[8px] md:text-[10px] tracking-[0.2em] md:tracking-[0.3em] uppercase mt-2 md:mt-4 opacity-50 font-sans">{label}</span>
  </div>
);

const WheelPicker = ({ items, onSelect }: { items: string[], onSelect: (val: string) => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedValue, setSelectedValue] = useState(items[0]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const val = entry.target.getAttribute('data-val');
            if (val) {
              setSelectedValue(val);
              onSelect(val);
            }
          }
        });
      },
      {
        root: container,
        rootMargin: '-50% 0px -50% 0px', // Trigger when item crosses the absolute center
        threshold: 0
      }
    );

    const children = container.querySelectorAll('.wheel-item');
    children.forEach(child => observer.observe(child));

    return () => observer.disconnect();
  }, [items, onSelect]);

  return (
    <div ref={containerRef} className="h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide flex flex-col px-2 md:px-4 text-3xl md:text-6xl font-bold text-white/80" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      <div className="h-16 md:h-24 shrink-0" />
      {items.map(item => (
        <div 
          key={item} 
          data-val={item} 
          className={`wheel-item h-12 md:h-16 shrink-0 flex items-center justify-center snap-center transition-opacity duration-300 ${item === selectedValue ? 'text-white opacity-100' : 'opacity-30'}`}
        >
          {item}
        </div>
      ))}
      <div className="h-16 md:h-24 shrink-0" />
    </div>
  );
};

// --- STEP 2: PROMPT ---
const PromptScreen: React.FC<{ heading: string, btnNow: string, btnLater: string, onNext: () => void }> = ({ heading, btnNow, btnLater, onNext }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="flex flex-col items-center justify-center w-full h-full px-4"
    >
      <h1 className="text-2xl md:text-5xl font-serif italic mb-8 md:mb-12 text-center leading-relaxed">
        {heading}
      </h1>
      
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
        <button 
          onClick={onNext}
          className="px-6 md:px-8 py-3 md:py-4 bg-white text-black font-bold text-xs md:text-sm tracking-[0.2em] uppercase hover:bg-gray-200 transition-colors w-full md:w-auto"
        >
          {btnNow}
        </button>
        <button 
          onClick={onNext}
          className="px-6 md:px-8 py-3 md:py-4 border border-white/20 text-white font-bold text-xs md:text-sm tracking-[0.2em] uppercase hover:border-white transition-colors w-full md:w-auto"
        >
          {btnLater}
        </button>
      </div>
    </motion.div>
  );
};
