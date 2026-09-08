import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCmsStore } from '../../store/cmsStore';
import { Eyebrow, Handwritten } from '../ui/Typography';

interface GiftSequenceProps {
  onComplete: () => void;
  initialStep?: 'questions' | 'gift' | 'letter';
}

export const GiftSequence: React.FC<GiftSequenceProps> = ({ onComplete, initialStep = 'questions' }) => {
  const { giftSequence } = useCmsStore();
  const [step, setStep] = useState<'questions' | 'gift' | 'letter'>(initialStep);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [currentSticker, setCurrentSticker] = useState('');
  const [videoEnded, setVideoEnded] = useState(false);
  const [showPhotoAlert, setShowPhotoAlert] = useState(false);
  const [isSecondTry, setIsSecondTry] = useState(false);
  const [isShowingReaction, setIsShowingReaction] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (giftSequence && !currentSticker) {
      setCurrentSticker(giftSequence.questions[0].sticker);
    }
  }, [giftSequence, currentSticker]);

  if (!giftSequence) return null;

  const getRandomSticker = (isHappy: boolean) => {
    const stickers = isHappy ? giftSequence.happyStickers : giftSequence.sadStickers;
    if (!stickers || stickers.length === 0) return '';
    return stickers[Math.floor(Math.random() * stickers.length)];
  };

  const handleOptionClick = (isCorrect: boolean) => {
    if (isSecondTry) {
      const nextSticker = getRandomSticker(true);
      setCurrentSticker(nextSticker);
      setIsShowingReaction(true);
      setTimeout(() => {
        setStep('gift');
        if (giftSequence.giftType === 'photo') {
          setTimeout(() => setShowPhotoAlert(true), 5000);
        }
      }, 1200);
      return;
    }

    if (questionIndex === 0 && !isCorrect) {
      const nextSticker = getRandomSticker(false);
      setCurrentSticker(nextSticker);
      setIsShowingReaction(true);
      setTimeout(() => {
        setIsSecondTry(true);
        setIsShowingReaction(false);
      }, 1200);
      return;
    }

    const nextSticker = getRandomSticker(isCorrect);
    setCurrentSticker(nextSticker);
    setIsShowingReaction(true);

    setTimeout(() => {
      if (questionIndex < giftSequence.questions.length - 1) {
        setQuestionIndex(prev => prev + 1);
        setCurrentSticker(giftSequence.questions[questionIndex + 1].sticker);
        setIsShowingReaction(false);
      } else {
        setStep('gift');
        if (giftSequence.giftType === 'photo') {
          setTimeout(() => setShowPhotoAlert(true), 5000);
        }
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[110] bg-[#151111] text-white flex flex-col items-center justify-center overflow-hidden font-sans">
      <AnimatePresence mode="wait">
        {step === 'questions' && (
          <motion.div
            key="questions"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, x: -80 }}
            className="flex flex-col items-center text-center p-4 sm:p-6 w-full max-w-2xl relative"
          >
            {/* Background Polaroids */}
            <motion.div 
              initial={{ x: -80, rotate: -20, opacity: 0 }}
              animate={{ x: 0, rotate: -12, opacity: 0.35 }}
              className="absolute -top-16 -left-16 w-44 h-52 bg-white p-2 shadow-2xl border border-white/20 hidden md:block rounded-sm"
            >
              {giftSequence.questionBgImageLeft && (
                <img src={giftSequence.questionBgImageLeft} alt="bg" className="w-full h-36 object-cover" />
              )}
              <div className="pt-2 text-center">
                <Handwritten color="#5c381c" className="text-xs">sweet moments</Handwritten>
              </div>
            </motion.div>

            <motion.div 
              initial={{ x: 80, rotate: 20, opacity: 0 }}
              animate={{ x: 0, rotate: 10, opacity: 0.35 }}
              className="absolute -bottom-16 -right-16 w-44 h-52 bg-white p-2 shadow-2xl border border-white/20 hidden md:block rounded-sm"
            >
              {giftSequence.questionBgImageRight && (
                <img src={giftSequence.questionBgImageRight} alt="bg" className="w-full h-36 object-cover" />
              )}
              <div className="pt-2 text-center">
                <Handwritten color="#5c381c" className="text-xs">unforgettable</Handwritten>
              </div>
            </motion.div>

            <div className="bg-[#241f1f] rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-8 md:p-12 shadow-2xl flex flex-col items-center relative border border-white/10 z-10 w-full max-w-md mx-auto">
              {currentSticker && (
                <motion.div
                  key={currentSticker}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 mb-4 sm:mb-6 flex items-center justify-center"
                >
                  <img src={currentSticker} alt="sticker" className="w-full h-full object-contain drop-shadow-xl" />
                </motion.div>
              )}

              <AnimatePresence mode="wait">
                {isShowingReaction ? (
                  <motion.div
                    key="reaction"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="min-h-[120px] sm:min-h-[140px] flex items-center justify-center"
                  >
                    <p className="font-display italic text-xl sm:text-2xl md:text-3xl text-pink-300">
                      Processing magic... ✨
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="question"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col items-center w-full"
                  >
                    <Eyebrow accent className="mb-2">QUESTION 0{questionIndex + 1}</Eyebrow>

                    <h2 className="font-display italic text-xl sm:text-2xl md:text-3xl text-[#f5f1e8] text-center mb-6 sm:mb-8 leading-snug">
                      {isSecondTry ? "Are you sure? Think again..." : giftSequence.questions[questionIndex]?.question}
                    </h2>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full justify-center">
                      {isSecondTry ? (
                        <motion.button
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => handleOptionClick(true)}
                          className="w-full px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl font-body font-black text-xs md:text-sm uppercase tracking-[0.16em] bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 text-white shadow-xl"
                        >
                          YES, ALWAYS! 💖
                        </motion.button>
                      ) : (
                        giftSequence.questions[questionIndex]?.options.map((opt, i) => (
                          <motion.button
                            key={i}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => handleOptionClick(opt.isCorrect)}
                            className={`w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl font-body font-black text-xs md:text-sm uppercase tracking-[0.16em] transition-all shadow-lg ${
                              i === 0 
                                ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white' 
                                : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                            }`}
                          >
                            {opt.text}
                          </motion.button>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {step === 'gift' && (
          <motion.div
            key="gift"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full h-full flex items-center justify-center bg-[#151111]"
          >
            {/* Step Navigation */}
            <div className="absolute top-4 left-4 sm:top-8 sm:left-8 z-[130]">
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => setStep('questions')}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl backdrop-blur-xl text-white/80 transition-all border border-white/15"
              >
                <span>←</span>
                <span className="text-xs font-body font-bold uppercase tracking-[0.16em]">Back</span>
              </motion.button>
            </div>

            {giftSequence.giftType === 'video' ? (
              <div className="relative w-full h-full flex flex-col items-center justify-center p-3 sm:p-4">
                <div className="relative w-full max-w-4xl aspect-video rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(255,133,161,0.25)] bg-zinc-950 border border-white/15">
                  <video 
                    ref={videoRef}
                    src={giftSequence.giftUrl} 
                    autoPlay
                    controls
                    playsInline
                    onEnded={() => setVideoEnded(true)}
                    className="w-full h-full object-contain"
                  />
                </div>
                
                {videoEnded && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => setStep('letter')}
                    className="mt-6 sm:mt-8 flex flex-col items-center cursor-pointer group"
                  >
                    {giftSequence.giftAlertSticker && (
                      <motion.img 
                        animate={{ y: [0, -8, 0] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        src={giftSequence.giftAlertSticker} 
                        alt="sticker" 
                        className="w-20 h-20 sm:w-24 sm:h-24 mb-3 sm:mb-4 drop-shadow-xl"
                      />
                    )}
                    <h3 className="font-display italic text-xl sm:text-2xl md:text-3xl text-white text-center group-hover:text-pink-300 transition-colors">
                      Click here for your love letter ✨
                    </h3>
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="relative w-full h-full flex flex-col items-center justify-center p-3 sm:p-4">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="max-w-full max-h-[75vh] sm:max-h-[80vh] rounded-2xl sm:rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(255,133,161,0.25)] border-2 sm:border-4 border-white/20 p-2 bg-white/5"
                >
                  {giftSequence.giftUrl && (
                    <img 
                      src={giftSequence.giftUrl} 
                      alt="gift" 
                      className="max-w-full max-h-[70vh] sm:max-h-[75vh] rounded-xl sm:rounded-2xl object-cover"
                    />
                  )}
                </motion.div>

                <AnimatePresence>
                  {showPhotoAlert && (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-50 p-4 sm:p-6"
                    >
                      <motion.div 
                        className="bg-[#241f1f] rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-10 flex flex-col items-center shadow-2xl max-w-sm border border-white/15 text-center"
                        whileHover={{ scale: 1.02 }}
                      >
                        <img src={giftSequence.giftAlertSticker} alt="sticker" className="w-28 h-28 sm:w-36 sm:h-36 mb-4 sm:mb-6 drop-shadow-xl" />
                        <h3 className="font-display italic text-xl sm:text-2xl text-[#f5f1e8] mb-6 leading-snug">
                          Something special is waiting for you! 🎁
                        </h3>
                        <button
                          onClick={() => setStep('letter')}
                          className="w-full sm:w-auto px-8 py-3.5 sm:py-4 bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 text-white rounded-2xl font-body font-black text-xs uppercase tracking-[0.16em] shadow-xl hover:opacity-90 transition-all active:scale-95"
                        >
                          Read Letter ✨
                        </button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        )}

        {step === 'letter' && (
          <motion.div
            key="letter"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="w-full h-full flex flex-col items-center justify-start bg-[#151111] p-3 sm:p-4 overflow-y-auto"
          >
            {/* Back to Gift Button */}
            <div className="fixed top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8 z-[140]">
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => setStep('gift')}
                className="flex items-center gap-2 bg-black/60 hover:bg-black/80 px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl backdrop-blur-xl text-white transition-all border border-white/15 shadow-xl"
              >
                <span>←</span>
                <span className="text-xs font-body font-bold uppercase tracking-[0.16em]">Back</span>
              </motion.button>
            </div>

            <div className="max-w-2xl w-full mt-16 sm:mt-20 mb-10 sm:mb-12 px-1 sm:px-0">
              <motion.div 
                className="bg-[#faf5ea] p-6 sm:p-10 md:p-16 shadow-[0_25px_60px_rgba(0,0,0,0.7)] relative overflow-hidden min-h-[70vh] sm:min-h-[75vh] flex flex-col rounded-2xl sm:rounded-[2rem] border border-[#d4c8a8]"
                style={{ 
                  backgroundImage: "url('https://www.transparenttextures.com/patterns/old-paper.png')"
                }}
              >
                {/* Vintage Vignette */}
                <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_50px_rgba(74,48,22,0.2)] rounded-2xl sm:rounded-[2rem]" />

                <div className="relative z-10 flex flex-col h-full">
                  <div className="text-center mb-6 sm:mb-8">
                    <Eyebrow className="!text-[#8a6b4f] mb-2">A SPECIAL DEDICATION</Eyebrow>
                    <h1 className="font-display italic text-2xl sm:text-3xl md:text-5xl text-[#2d1e11] font-normal leading-tight">
                      {giftSequence.letterTitle}
                    </h1>
                  </div>
                  
                  <div className="font-handwriting text-lg sm:text-2xl md:text-3xl text-[#2c1f14] space-y-4 sm:space-y-6 md:space-y-8 whitespace-pre-wrap leading-[1.65] flex-grow px-1 sm:px-2 font-medium">
                    {giftSequence.letterBody}
                  </div>
                  
                  <div className="mt-10 sm:mt-14 text-right pt-6 border-t border-[#8a6b4f]/20">
                    <p className="font-handwriting text-xl sm:text-3xl md:text-4xl text-[#2d1e11] font-bold">
                      {giftSequence.letterFooter}
                    </p>
                  </div>

                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    onClick={onComplete}
                    className="mt-8 sm:mt-12 w-full py-3.5 sm:py-4 bg-[#2d1e11] hover:bg-black text-[#faf5ea] rounded-2xl font-body font-black text-xs md:text-sm uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95"
                  >
                    {giftSequence.ctaText} ✨
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
