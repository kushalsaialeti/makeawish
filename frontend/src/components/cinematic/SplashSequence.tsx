import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCmsStore } from '../../store/cmsStore';
import confetti from 'canvas-confetti';
import { Eyebrow, Handwritten } from '../ui/Typography';

interface SplashSequenceProps {
  onComplete: () => void;
  skipToPrompt?: boolean;
}

export const SplashSequence: React.FC<SplashSequenceProps> = ({ onComplete, skipToPrompt = false }) => {
  const { splashScreen, setUnlocked } = useCmsStore();
  const [step, setStep] = useState<'locked' | 'prompt'>(skipToPrompt ? 'prompt' : 'locked');
  const [phase, setPhase] = useState<'countdown' | 'explosion'>('countdown');

  if (!splashScreen) return null;

  return (
    <div className="fixed inset-0 z-[100] text-white font-sans flex flex-col items-center justify-center overflow-x-hidden overflow-y-auto bg-[#151111]">
      {/* Global Birthday Backdrop */}
      <div 
        className="absolute inset-0 z-[-1] scale-105 transition-transform duration-1000 pointer-events-none"
        style={{ 
          backgroundImage: `url("${splashScreen.bgImage || 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=2000&auto=format&fit=crop'}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(6px) brightness(0.4)'
        }} 
      />

      {/* Subtle Rose Overlay */}
      <motion.div 
        className="absolute inset-0 z-[-2] bg-pink-900/15 pointer-events-none"
        initial={false}
        animate={{ opacity: phase === 'explosion' ? 1 : 0 }}
      />

      {/* Rope Polaroids Background */}
      <RopePolaroids images={splashScreen.ropePolaroids || []} />

      {/* Gradient Overlay for superior contrast */}
      <div className="absolute inset-0 z-[-1] bg-gradient-to-b from-black/60 via-black/30 to-black/70 pointer-events-none" />
      
      <AnimatePresence mode="wait">
        {step === 'locked' && (
          <CombinedLockScreen 
            key="locked" 
            targetDate={splashScreen.targetDate}
            correctPin={{ m: splashScreen.correctMonth, d: splashScreen.correctDay, y: splashScreen.correctYear }}
            recipientName={splashScreen.recipientName || 'Beautiful'}
            clockText={splashScreen.clockText || 'TIME IS TICKING'}
            splashImage={splashScreen.splashImage}
            lockHeading={splashScreen.lockHeading}
            lockSubtext={splashScreen.lockSubtext}
            birthdayHeading={splashScreen.birthdayHeading}
            currentPhase={phase}
            onPhaseChange={setPhase}
            onUnlock={() => { setUnlocked(true); setStep('prompt'); }} 
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

// --- Rope Polaroids Component ---
const RopePolaroids: React.FC<{ images: string[] }> = ({ images }) => {
  if (images.length === 0) return null;
  
  return (
    <div className="absolute inset-0 z-[-1] pointer-events-none opacity-20 sm:opacity-25 overflow-hidden">
      <div className="absolute top-[10%] sm:top-[12%] left-0 w-full h-[1px] bg-white/25 shadow-[0_0_15px_rgba(255,255,255,0.4)]" />
      <div className="absolute top-[10%] sm:top-[12%] left-0 w-full flex justify-around px-4 sm:px-10">
        {images.slice(0, 4).map((img, i) => (
          <motion.div 
            key={i}
            initial={{ y: -20, rotate: i % 2 === 0 ? -10 : 10 }}
            animate={{ 
              rotate: [i % 2 === 0 ? -12 : 8, i % 2 === 0 ? -8 : 12, i % 2 === 0 ? -12 : 8],
              y: [0, 5, 0]
            }}
            transition={{ duration: 4 + Math.random() * 2, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-4 bg-amber-100/60 rounded-sm z-10" />
            <div className="w-16 h-20 sm:w-24 sm:h-28 md:w-32 md:h-40 bg-white p-1 sm:p-1.5 pb-4 sm:pb-6 md:pb-8 shadow-2xl rounded-sm">
              <img src={img} className="w-full h-full object-cover grayscale-[0.6]" alt="bg-mem" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// --- POLAROID & DIAL PAD LAYOUT ---
const CombinedLockScreen: React.FC<{ 
  targetDate: string, 
  correctPin: {m:string, d:string, y:string}, 
  recipientName: string,
  clockText: string,
  splashImage: string,
  lockHeading?: string,
  lockSubtext?: string,
  birthdayHeading?: string,
  currentPhase: 'countdown' | 'explosion',
  onPhaseChange: (phase: 'countdown' | 'explosion') => void,
  onUnlock: () => void
}> = ({ targetDate, correctPin, recipientName, splashImage, lockHeading, lockSubtext, birthdayHeading, currentPhase, onPhaseChange, onUnlock }) => {
  const [time, setTime] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const phase = currentPhase;
  const setPhase = onPhaseChange;
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
        if (phase !== 'countdown') {
          setPhase('countdown');
        }
      } else {
        setTime({ days: 0, hours: 0, mins: 0, secs: 0 });
        if (phase !== 'explosion') {
          setPhase('explosion');
          triggerBlast();
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
      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 70 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  const handleKeyPress = (val: string) => {
    if (unlocked || phase === 'countdown') return;
    
    if (val === 'ENTER') {
      const expectedPin = `${correctPin.m}${correctPin.d}${correctPin.y}`;
      if (pin === expectedPin || pin === '12162005') {
        setUnlocked(true);
        triggerBlast();
        setTimeout(onUnlock, 2200);
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
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0, scale: 1.05 }}
      className="flex flex-col items-center justify-start w-full min-h-screen p-4 py-8 sm:py-12 md:py-16 relative overflow-y-auto"
    >
      {/* Timer Section */}
      <div className="w-full flex justify-center mb-8 sm:mb-12 pointer-events-none px-2">
        <div className="flex flex-col items-center">
          {phase === 'explosion' ? (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center px-3">
              <Eyebrow accent className="mb-2 text-[10px] sm:text-xs">A SPECIAL MILESTONE</Eyebrow>
              <h1 className="font-display italic text-3xl sm:text-4xl md:text-6xl text-white drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]">
                {(birthdayHeading || `Happy Birthday ${recipientName}!`)}
              </h1>
            </motion.div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-4 md:gap-5 bg-black/40 backdrop-blur-xl px-4 sm:px-8 py-3 sm:py-4 rounded-2xl sm:rounded-[2rem] border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              <TimeDigit value={time.days} label="Days" />
              <span className="text-base sm:text-xl font-light text-pink-400 opacity-60">:</span>
              <TimeDigit value={time.hours} label="Hours" />
              <span className="text-base sm:text-xl font-light text-pink-400 opacity-60">:</span>
              <TimeDigit value={time.mins} label="Mins" />
              <span className="text-base sm:text-xl font-light text-pink-400 opacity-60">:</span>
              <TimeDigit value={time.secs} label="Secs" />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-8 sm:gap-12 md:gap-16 w-full max-w-5xl px-2">
        
        {/* Left Side: Polaroid */}
        <motion.div 
          initial={{ rotate: -5, x: -30, opacity: 0 }} 
          animate={{ rotate: -2, x: 0, opacity: 1 }}
          className="relative bg-white p-3 sm:p-4 pb-10 sm:pb-14 shadow-2xl rounded-sm border border-white/20"
        >
          <div className="w-52 h-52 sm:w-64 sm:h-64 md:w-80 md:h-80 overflow-hidden bg-gray-100 rounded-sm">
            <img src={splashImage} className="w-full h-full object-cover contrast-110" alt="Special Memory" />
          </div>
          <div className="absolute bottom-3 sm:bottom-4 left-0 w-full text-center">
            <Handwritten color="#5c381c" className="text-sm sm:text-base md:text-lg">a memory of you</Handwritten>
          </div>
        </motion.div>

        {/* Right Side: Countdown Message or Passcode Pad */}
        <div className="flex flex-col items-center w-full max-w-sm">
          {phase === 'countdown' ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center text-center max-w-sm space-y-4 sm:space-y-6"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl sm:text-3xl shadow-xl">
                🔒
              </div>
              
              <div className="space-y-2 sm:space-y-3">
                <h2 className="font-display italic text-2xl sm:text-3xl text-white leading-snug">
                  {new Date(targetDate).getTime() > new Date().getTime() ? (
                    <span>
                      Opens precisely at <br />
                      <span className="text-pink-300 font-sans not-italic font-bold text-base sm:text-lg md:text-xl">
                        {(() => {
                          const date = new Date(targetDate);
                          return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) +
                                 ' • ' +
                                 date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                        })()}
                      </span>
                    </span>
                  ) : (
                    <span>The Moment Has Arrived ✨</span>
                  )}
                </h2>
                <p className="font-body text-xs sm:text-sm text-white/70 leading-relaxed max-w-xs mx-auto">
                  Your personalized birthday experience is locked until the countdown completes.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center bg-[#1e1a1a]/85 backdrop-blur-xl p-5 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border border-white/10 shadow-2xl w-full"
            >
              <div className="flex flex-col items-center mb-5 text-center">
                <Eyebrow accent className="mb-1 text-[10px] sm:text-xs">SECURITY ACCESS</Eyebrow>
                <h2 className="font-display italic text-2xl sm:text-3xl text-white">
                  {lockHeading || 'Enter Passcode'}
                </h2>
                {lockSubtext && (
                  <p className="font-body text-[10px] sm:text-[11px] text-white/50 mt-0.5 uppercase tracking-widest">
                    {lockSubtext}
                  </p>
                )}
              </div>
              
              {/* PIN Boxes (8 numbers) */} 
              <div className="flex gap-1.5 sm:gap-2 mb-5">
                {['M', 'M', 'D', 'D', 'Y', 'Y', 'Y', 'Y'].map((char, i) => (
                  <motion.div 
                    key={i}
                    animate={error ? { x: [-4, 4, -4, 4, 0] } : {}}
                    className={`w-7 h-9 sm:w-8 sm:h-10 md:w-9 md:h-11 border rounded-lg sm:rounded-xl flex items-center justify-center font-body text-xs sm:text-sm md:text-base font-bold transition-all ${
                      pin.length > i 
                        ? 'bg-gradient-to-br from-pink-500 to-rose-600 text-white border-transparent shadow-[0_0_12px_rgba(219,39,119,0.5)]' 
                        : 'border-white/15 bg-black/30 text-white/30'
                    }`}
                  >
                    {pin.length > i ? '•' : char}
                  </motion.div>
                ))}
              </div>

              {/* Dial Pad */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3 md:gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'].map((val) => (
                  <motion.button
                    key={val}
                    whileHover={{ scale: 1.08 }} 
                    whileTap={{ scale: 0.92 }}
                    onClick={() => typeof val === 'number' && handleKeyPress(val.toString())}
                    className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl bg-white/10 hover:bg-white/20 text-white font-body font-bold text-base sm:text-lg border border-white/10 shadow-lg transition-all flex items-center justify-center"
                  >
                    {val}
                  </motion.button>
                ))}
                <div className="col-span-3 flex justify-center gap-2 sm:gap-3 mt-2">
                  <button
                    onClick={() => handleKeyPress('DEL')}
                    className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white font-body text-[11px] sm:text-xs font-bold uppercase tracking-widest border border-white/10 transition-all"
                  >
                    DELETE
                  </button>
                  <button
                    onClick={() => handleKeyPress('ENTER')}
                    className={`px-5 sm:px-7 py-2 sm:py-2.5 rounded-xl font-body text-[11px] sm:text-xs font-black uppercase tracking-widest transition-all shadow-lg ${
                      unlocked ? 'bg-green-500 text-white' : 'bg-gradient-to-r from-pink-600 to-rose-600 text-white'
                    }`}
                  >
                    {unlocked ? 'UNLOCKED ✨' : 'ENTER →'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>

      </div>
    </motion.div>
  );
};

const TimeDigit = ({ value, label }: { value: number, label: string }) => (
  <div className="flex flex-col items-center min-w-[42px] sm:min-w-[54px]">
    <div className="font-body text-xl sm:text-2xl md:text-3xl font-black text-white tabular-nums tracking-tight">
      {value.toString().padStart(2, '0')}
    </div>
    <div className="font-body text-[9px] sm:text-[10px] font-semibold text-white/40 uppercase tracking-[0.16em] sm:tracking-[0.18em] mt-0.5">
      {label}
    </div>
  </div>
);

const PromptScreen: React.FC<{ heading: string, btnNow: string, btnLater: string, onNext: () => void }> = ({ heading, btnNow, btnLater, onNext }) => {
  const { giftSequence } = useCmsStore();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center w-full min-h-screen px-4 py-8 text-center relative max-w-2xl mx-auto"
    >
      <Eyebrow accent className="mb-4 text-[10px] sm:text-xs">SPECIAL INVITATION</Eyebrow>

      <h1 className="font-display italic text-2xl sm:text-3xl md:text-5xl text-white mb-6 sm:mb-8 drop-shadow-lg leading-tight px-2">
        {heading}
      </h1>

      {giftSequence?.promptSticker && (
        <motion.div
          animate={{ y: [0, -8, 0], rotate: [0, 4, -4, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="mb-8 sm:mb-10"
        >
          <img src={giftSequence.promptSticker} alt="sticker" className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 object-contain drop-shadow-xl" />
        </motion.div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full justify-center max-w-xs sm:max-w-none">
        <button 
          onClick={onNext} 
          className="px-8 sm:px-10 py-3.5 sm:py-4 bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 text-white font-body font-black rounded-2xl shadow-xl hover:opacity-90 transition-all uppercase tracking-[0.16em] sm:tracking-[0.18em] text-xs active:scale-95"
        >
          {btnNow} ✨
        </button>
        <button 
          onClick={onNext} 
          className="px-6 sm:px-8 py-3.5 sm:py-4 bg-white/5 hover:bg-white/10 border border-white/15 text-white/80 font-body font-bold rounded-2xl transition-all uppercase tracking-[0.16em] sm:tracking-[0.18em] text-xs"
        >
          {btnLater}
        </button>
      </div>
    </motion.div>
  );
};
