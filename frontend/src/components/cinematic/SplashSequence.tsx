import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCmsStore } from '../../store/cmsStore';
import confetti from 'canvas-confetti';

interface SplashSequenceProps {
  onComplete: () => void;
}

export const SplashSequence: React.FC<SplashSequenceProps> = ({ onComplete }) => {
  const { splashScreen } = useCmsStore();
  const [step, setStep] = useState<'locked' | 'prompt'>('locked');

  useEffect(() => {
    // Content is now fetched by the parent component (WishView or AdminDashboard)
  }, []);

  if (!splashScreen) return null;

  return (
    <div className="fixed inset-0 z-[100] text-white font-sans flex flex-col items-center justify-center overflow-hidden">
      {/* Global Birthday Backdrop */}
      <div 
        className="absolute inset-0 z-[-1] scale-110"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=2000&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(8px) brightness(0.6)'
        }} 
      />
      {/* Gradient Overlay for better text readability */}
      <div className="absolute inset-0 z-[-1] bg-gradient-to-b from-black/20 via-transparent to-black/40" />
      <AnimatePresence mode="wait">
        {step === 'locked' && (
          <CombinedLockScreen 
            key="locked" 
            targetDate={splashScreen.targetDate}
            correctPin={{ m: splashScreen.correctMonth, d: splashScreen.correctDay, y: splashScreen.correctYear }}
            recipientName={splashScreen.recipientName || 'Beautiful'}
            clockText={splashScreen.clockText || 'TIME IS TICKING'}
            splashImage={splashScreen.splashImage}
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

// --- STEP 1: NEW POLAROID & DIAL PAD LAYOUT ---
const CombinedLockScreen: React.FC<{ 
  targetDate: string, 
  correctPin: {m:string, d:string, y:string}, 
  recipientName: string,
  clockText: string,
  splashImage: string,
  onUnlock: () => void 
}> = ({ targetDate, correctPin, recipientName, clockText, splashImage, onUnlock }) => {
  const [time, setTime] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [phase, setPhase] = useState<'countdown' | 'explosion'>('countdown');
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference > 0) {
        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const m = Math.floor((difference / 1000 / 60) % 60);
        const s = Math.floor((difference / 1000) % 60);
        setTime({ days: d, hours: h, mins: m, secs: s });
      } else {
        setTime({ days: 0, hours: 0, mins: 0, secs: 0 });
        if (phase !== 'explosion') {
          setPhase('explosion');
          triggerBlast(); // Trigger blast when timer hits zero
        }
      }
    };
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate, phase]);

  const triggerBlast = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 45, spread: 360, ticks: 100, zIndex: 1000 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 70 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  const handleKeyPress = (val: string) => {
    if (unlocked) return;
    if (val === 'ENTER') {
      const expectedPin = `${correctPin.m}${correctPin.d}${correctPin.y}`;
      if (pin === expectedPin || pin === '12162005') {
        setUnlocked(true);
        triggerBlast();
        setTimeout(onUnlock, 2500);
      } else {
        setError(true);
        setPin('');
        setTimeout(() => setError(false), 1000);
      }
    } else if (val === 'DEL') {
      setPin(prev => prev.slice(0, -1));
    } else if (pin.length < 8) {
      setPin(prev => prev + val);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1, backgroundColor: phase === 'explosion' ? '#ff85a1' : '#3a86ff' }} 
      exit={{ opacity: 0, scale: 1.1 }}
      className="flex flex-col items-center justify-start w-full min-h-screen p-4 py-12 md:py-20 relative overflow-y-auto scrollbar-hide"
    >
      {/* Independent Timer (In-flow to prevent overlap) */}
      <div className="w-full flex justify-center mb-12 md:mb-16 pointer-events-none">
        <div className="flex flex-col items-center">
          {phase === 'explosion' ? (
            <motion.h1 
              initial={{ scale: 0.5 }} animate={{ scale: 1.2 }}
              className="text-3xl md:text-6xl font-black text-white text-center drop-shadow-lg px-4"
            >
              HAPPY BIRTHDAY {recipientName.toUpperCase()}!
            </motion.h1>
          ) : (
            <div className="flex space-x-2 md:space-x-4 bg-white/10 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/20 shadow-2xl">
               <TimeDigit value={time.days} label="D" />
               <span className="text-xl md:text-2xl font-bold animate-pulse pt-1">:</span>
               <TimeDigit value={time.hours} label="H" />
               <span className="text-xl md:text-2xl font-bold animate-pulse pt-1">:</span>
               <TimeDigit value={time.mins} label="M" />
               <span className="text-xl md:text-2xl font-bold animate-pulse pt-1">:</span>
               <TimeDigit value={time.secs} label="S" />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24 w-full max-w-6xl">
        
        {/* Left Side: Polaroid */}
        <motion.div 
          initial={{ rotate: -5, x: -50, opacity: 0 }} animate={{ rotate: -2, x: 0, opacity: 1 }}
          className="relative bg-white p-4 pb-16 shadow-2xl rounded-sm"
        >
          {/* Blue Bow Decoration */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20 w-24 md:w-32">
            <svg viewBox="0 0 100 60" className="drop-shadow-md">
              <path d="M50 30 C 30 10, 10 10, 10 30 C 10 50, 30 50, 50 30 C 70 10, 90 10, 90 30 C 90 50, 70 50, 50 30" fill="#a2d2ff" stroke="white" strokeWidth="2" />
              <circle cx="50" cy="30" r="5" fill="#a2d2ff" stroke="white" strokeWidth="2" />
              <path d="M50 35 L 40 55 M 50 35 L 60 55" stroke="#a2d2ff" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </div>

          <div className="w-64 h-64 md:w-80 md:h-80 overflow-hidden bg-gray-100">
            <img src={splashImage} className="w-full h-full object-cover" alt="Memory" />
          </div>

          {/* Teddy Bear Decoration */}
          <div className="absolute -bottom-10 -left-10 w-24 md:w-32 z-20">
             <TeddyBear />
          </div>
        </motion.div>

        {/* Right Side: Dial Pad */}
        <div className="flex flex-col items-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 tracking-wide drop-shadow-md">Enter the passcode</h2>
          
          {/* PIN Boxes (8 numbers) */} 
          <div className="flex gap-2 mb-8">
            {['M', 'M', 'D', 'D', 'Y', 'Y', 'Y', 'Y'].map((char, i) => (
              <motion.div 
                key={i}
                animate={error ? { x: [-5, 5, -5, 5, 0] } : {}}
                className={`w-8 h-10 md:w-10 md:h-12 border-2 rounded-lg flex items-center justify-center text-xl font-bold transition-all ${
                  pin.length > i ? 'bg-white text-[#3a86ff] border-white' : 'border-white/40 bg-transparent text-white/30'
                }`}
              >
                {pin.length > i ? '*' : char}
              </motion.div>
            ))}
          </div>

          {/* Circular Dial Pad */}
          <div className="grid grid-cols-3 gap-4 md:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'].map((val) => (
              <motion.button
                key={val}
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={() => typeof val === 'number' && handleKeyPress(val.toString())}
                className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white text-[#3a86ff] text-xl font-bold shadow-lg hover:bg-gray-100 transition-colors"
              >
                {val}
              </motion.button>
            ))}
            {/* Control Buttons Below */}
            <div className="col-span-3 flex justify-center gap-4 mt-2">
               <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => handleKeyPress('DEL')}
                className="px-6 py-2 rounded-full bg-red-400 text-white font-bold text-sm shadow-md"
              >
                DELETE
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => handleKeyPress('ENTER')}
                className={`px-8 py-2 rounded-full font-bold text-sm shadow-md transition-colors ${
                  unlocked ? 'bg-green-500 text-white' : 'bg-white text-[#3a86ff]'
                }`}
              >
                {unlocked ? 'UNLOCKED' : 'ENTER'}
              </motion.button>
            </div>
          </div>
        </div>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;700&display=swap');
        * { font-family: 'Fredoka', sans-serif; }
      `}</style>
    </motion.div>
  );
};

// --- COMPONENTS ---

const TimeDigit = ({ value, label }: { value: number, label: string }) => (
  <div className="flex flex-col items-center min-w-[50px]">
    <div className="text-2xl font-black">{value.toString().padStart(2, '0')}</div>
    <div className="text-[10px] font-bold opacity-70 uppercase tracking-tighter">{label}</div>
  </div>
);

const TeddyBear = () => (
  <svg viewBox="0 0 100 100" className="drop-shadow-lg">
    <circle cx="50" cy="55" r="30" fill="#f8f9fa" stroke="#e9ecef" strokeWidth="2" /> {/* Body */}
    <circle cx="50" cy="35" r="22" fill="#f8f9fa" stroke="#e9ecef" strokeWidth="2" /> {/* Head */}
    <circle cx="32" cy="22" r="8" fill="#f8f9fa" stroke="#e9ecef" strokeWidth="2" /> {/* Ear L */}
    <circle cx="68" cy="22" r="8" fill="#f8f9fa" stroke="#e9ecef" strokeWidth="2" /> {/* Ear R */}
    <circle cx="43" cy="32" r="3" fill="#333" /> {/* Eye L */}
    <circle cx="57" cy="32" r="3" fill="#333" /> {/* Eye R */}
    <path d="M45 42 Q 50 47 55 42" fill="none" stroke="#ff85a1" strokeWidth="2" strokeLinecap="round" /> {/* Mouth */}
    <circle cx="35" cy="80" r="10" fill="#f8f9fa" stroke="#e9ecef" strokeWidth="2" /> {/* Leg L */}
    <circle cx="65" cy="80" r="10" fill="#f8f9fa" stroke="#e9ecef" strokeWidth="2" /> {/* Leg R */}
    <circle cx="28" cy="50" r="8" fill="#f8f9fa" stroke="#e9ecef" strokeWidth="2" /> {/* Arm L */}
    <circle cx="72" cy="50" r="8" fill="#f8f9fa" stroke="#e9ecef" strokeWidth="2" /> {/* Arm R */}
  </svg>
);

const PromptScreen: React.FC<{ heading: string, btnNow: string, btnLater: string, onNext: () => void }> = ({ heading, btnNow, btnLater, onNext }) => {
  const { giftSequence } = useCmsStore();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center w-full h-full px-4 text-center relative"
    >
      {/* Background Polaroids */}
      {giftSequence && (
        <>
          {giftSequence.questionBgImageLeft && (
            <motion.div 
              initial={{ x: -100, rotate: -25, opacity: 0 }}
              animate={{ x: 0, rotate: -15, opacity: 0.4 }}
              className="absolute top-20 left-10 w-40 h-48 md:w-56 md:h-64 bg-white p-2 shadow-2xl border border-gray-200 hidden sm:block"
            >
              <img src={giftSequence.questionBgImageLeft} alt="bg" className="w-full h-32 md:h-48 object-cover" />
              <div className="h-8" />
            </motion.div>
          )}

          {giftSequence.questionBgImageRight && (
            <motion.div 
              initial={{ x: 100, rotate: 25, opacity: 0 }}
              animate={{ x: 0, rotate: 12, opacity: 0.4 }}
              className="absolute bottom-20 right-10 w-40 h-48 md:w-56 md:h-64 bg-white p-2 shadow-2xl border border-gray-200 hidden sm:block"
            >
              <img src={giftSequence.questionBgImageRight} alt="bg" className="w-full h-32 md:h-48 object-cover" />
              <div className="h-8" />
            </motion.div>
          )}
        </>
      )}

      <h1 className="text-3xl md:text-5xl font-black mb-12 drop-shadow-lg max-w-2xl leading-tight z-10">
        {heading}
      </h1>

      {giftSequence?.promptSticker && (
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="mb-12 z-10"
        >
          <img src={giftSequence.promptSticker} alt="sticker" className="w-32 h-32 md:w-48 md:h-48 object-contain" />
        </motion.div>
      )}

      <div className="flex gap-6 z-10">
        <button onClick={onNext} className="px-10 py-4 bg-white text-[#3a86ff] font-black rounded-full shadow-xl hover:bg-gray-100 transition-all uppercase tracking-widest">{btnNow}</button>
        <button onClick={onNext} className="px-10 py-4 border-2 border-white/50 text-white font-black rounded-full shadow-xl hover:bg-white/10 transition-all uppercase tracking-widest">{btnLater}</button>
      </div>
    </motion.div>
  );
};
