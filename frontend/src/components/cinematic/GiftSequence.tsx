import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCmsStore } from '../../store/cmsStore';

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
      // Any option in second try leads to happy reaction and then gift
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
      // First question "No" click
      const nextSticker = getRandomSticker(false);
      setCurrentSticker(nextSticker);
      setIsShowingReaction(true);
      setTimeout(() => {
        setIsSecondTry(true);
        setIsShowingReaction(false);
        // We stay on index 0 but the UI will show second try
      }, 1200);
      return;
    }

    const nextSticker = getRandomSticker(isCorrect);
    setCurrentSticker(nextSticker);
    setIsShowingReaction(true);

    // Short delay to show the reaction sticker before moving on
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
    <div className="fixed inset-0 z-[110] bg-[#1a1616] text-white flex flex-col items-center justify-center overflow-hidden font-sans">
      <AnimatePresence mode="wait">
        {step === 'questions' && (
          <motion.div
            key="questions"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, x: -100 }}
            className="flex flex-col items-center text-center p-6 w-full max-w-2xl relative"
          >
            {/* Background Polaroids */}
            <motion.div 
              initial={{ x: -100, rotate: -25, opacity: 0 }}
              animate={{ x: 0, rotate: -15, opacity: 0.4 }}
              className="absolute -top-20 -left-20 w-48 h-56 bg-white p-2 shadow-xl border border-gray-200 hidden md:block"
            >
              <img src={giftSequence.questionBgImageLeft} alt="bg" className="w-full h-40 object-cover" />
              <div className="h-10" />
            </motion.div>

            <motion.div 
              initial={{ x: 100, rotate: 25, opacity: 0 }}
              animate={{ x: 0, rotate: 12, opacity: 0.4 }}
              className="absolute -bottom-20 -right-20 w-48 h-56 bg-white p-2 shadow-xl border border-gray-200 hidden md:block"
            >
              <img src={giftSequence.questionBgImageRight} alt="bg" className="w-full h-40 object-cover" />
              <div className="h-10" />
            </motion.div>

            <div className={`bg-white rounded-[2rem] p-8 md:p-12 shadow-2xl flex flex-col items-center relative border-8 border-pink-100 z-10 ${questionIndex === 0 ? 'scale-110 md:scale-125' : ''}`}>
              {currentSticker && (
                <motion.div
                  key={currentSticker}
                  initial={{ scale: 0.5, rotate: -20, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  transition={{ type: 'spring', damping: 10 }}
                  className="mb-8"
                >
                  <img 
                    src={currentSticker} 
                    alt="sticker" 
                    className={`${questionIndex === 0 ? 'w-56 h-56 md:w-80 md:h-80' : 'w-40 h-40 md:w-56 md:h-56'} object-contain`}
                  />
                </motion.div>
              )}
              
              <AnimatePresence mode="wait">
                {!isShowingReaction && (
                  <motion.div
                    key={isSecondTry ? 'second-try' : `q-${questionIndex}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col items-center"
                  >
                    <h2 className="text-2xl md:text-3xl font-black text-gray-800 mb-10 tracking-tight leading-tight">
                      {isSecondTry ? 'Do you want to see now?' : giftSequence.questions[questionIndex].question}
                    </h2>

                    <div className="flex flex-wrap justify-center gap-6 w-full">
                      {isSecondTry ? (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleOptionClick(true)}
                            className="px-10 py-4 rounded-full font-black text-lg md:text-xl transition-all shadow-[0_8px_0_rgba(0,0,0,0.1)] active:shadow-none active:translate-y-1 bg-[#ff85a1] text-white"
                          >
                            Yes!
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleOptionClick(true)}
                            className="px-10 py-4 rounded-full font-black text-lg md:text-xl transition-all shadow-[0_8px_0_rgba(0,0,0,0.1)] active:shadow-none active:translate-y-1 bg-[#3a86ff] text-white"
                          >
                            Double Yes!
                          </motion.button>
                        </>
                      ) : (
                        giftSequence.questions[questionIndex].options.map((opt, i) => (
                          <motion.button
                            key={i}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleOptionClick(opt.isCorrect)}
                            className={`px-10 py-4 rounded-full font-black text-lg md:text-xl transition-all shadow-[0_8px_0_rgba(0,0,0,0.1)] active:shadow-none active:translate-y-1 ${
                              i === 0 ? 'bg-[#ff85a1] text-white' : 'bg-[#3a86ff] text-white'
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
            initial={{ opacity: 0, rotateY: -90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0, rotateY: 90 }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className="relative w-full h-full flex items-center justify-center bg-black"
          >
            {/* Step Navigation */}
            <div className="absolute top-8 left-8 z-[130]">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setStep('questions')}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full backdrop-blur-md text-white/80 transition-colors border border-white/20"
              >
                <span>←</span>
                <span className="text-sm font-bold uppercase tracking-wider">Back</span>
              </motion.button>
            </div>

            {giftSequence.giftType === 'video' ? (
              <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
                <div className="relative w-full max-w-4xl aspect-video rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(255,133,161,0.3)] bg-zinc-900 border-4 border-white/10">
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
                    className="mt-8 flex flex-col items-center cursor-pointer group"
                  >
                    {giftSequence.giftAlertSticker && (
                      <motion.img 
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        src={giftSequence.giftAlertSticker} 
                        alt="sticker" 
                        className="w-24 h-24 mb-4 drop-shadow-lg"
                      />
                    )}
                    <h3 className="text-2xl font-black text-white text-center group-hover:text-pink-400 transition-colors">
                      Click here for a surprise! ✨
                    </h3>
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="max-w-full max-h-[80vh] rounded-[2rem] overflow-hidden shadow-[0_0_100px_rgba(58,134,255,0.3)] border-8 border-white p-2 bg-white"
                >
                  {giftSequence.giftUrl && (
                    <img 
                      src={giftSequence.giftUrl} 
                      alt="gift" 
                      className="max-w-full max-h-[75vh] rounded-2xl object-cover"
                    />
                  )}
                </motion.div>

                <AnimatePresence>
                  {showPhotoAlert && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-6"
                    >
                      <motion.div 
                        className="bg-white rounded-[3rem] p-10 flex flex-col items-center shadow-2xl max-w-sm border-8 border-blue-100"
                        whileHover={{ scale: 1.02 }}
                      >
                        <img src={giftSequence.giftAlertSticker} alt="sticker" className="w-40 h-40 mb-6" />
                        <h3 className="text-2xl font-black text-gray-800 text-center mb-8">
                          Something special is waiting for you! 🎁
                        </h3>
                        <button
                          onClick={() => setStep('letter')}
                          className="px-10 py-4 bg-[#3a86ff] text-white rounded-full font-black text-xl shadow-lg hover:bg-blue-600 transition-all active:scale-95"
                        >
                          See Surprise ✨
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
            initial={{ opacity: 0, rotateY: -90, scale: 0.5 }}
            animate={{ opacity: 1, rotateY: 0, scale: 1 }}
            transition={{ duration: 1, type: 'spring', damping: 15 }}
            className="w-full h-full flex items-center justify-center bg-[#1a1616] p-4 overflow-y-auto"
          >
            {/* Back to Gift Button */}
            <div className="absolute top-8 left-8 z-[130]">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setStep('gift')}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full backdrop-blur-md text-white/80 transition-colors border border-white/20"
              >
                <span>←</span>
                <span className="text-sm font-bold uppercase tracking-wider">Back</span>
              </motion.button>
            </div>

            <div className="max-w-2xl w-full perspective-1000 my-8">
              <motion.div 
                className="bg-[#fdfaf3] p-10 md:p-16 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden min-h-[80vh] flex flex-col"
                style={{ 
                  backgroundImage: "url('https://www.transparenttextures.com/patterns/old-paper.png')",
                  borderRadius: "2px 4px 3px 6px"
                }}
              >
                {/* Burnt Edges Effect */}
                <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_60px_rgba(74,48,22,0.4)] border-2 border-[#d4c8a8]" />
                <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-b from-[#4a3016]/20 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-t from-[#4a3016]/20 to-transparent" />
                
                {/* Random paper "burn" spots */}
                <div className="absolute top-[10%] left-[5%] w-12 h-8 bg-[#4a3016]/10 rounded-full blur-xl" />
                <div className="absolute bottom-[15%] right-[8%] w-16 h-10 bg-[#4a3016]/15 rounded-full blur-xl" />

                <div className="relative z-10 flex flex-col h-full">
                  <h1 className="text-4xl md:text-6xl text-[#2d1e11] font-bold mb-12 text-center" style={{ fontFamily: "'Dancing Script', cursive" }}>
                    {giftSequence.letterTitle}
                  </h1>
                  
                  <div className="text-xl md:text-2xl text-[#3d2b1a] space-y-8 whitespace-pre-wrap leading-[1.6] flex-grow" style={{ fontFamily: "'Dancing Script', cursive" }}>
                    {giftSequence.letterBody}
                  </div>
                  
                  <div className="mt-16 text-right pt-8 border-t border-[#4a3016]/10">
                    <p className="text-2xl md:text-3xl font-bold text-[#2d1e11]" style={{ fontFamily: "'Dancing Script', cursive" }}>
                      {giftSequence.letterFooter}
                    </p>
                  </div>

                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5 }}
                    onClick={onComplete}
                    className="mt-16 w-full py-5 bg-[#2d1e11] text-[#fdfaf3] rounded-xl font-black text-xl hover:bg-black transition-all shadow-xl active:scale-95"
                  >
                    {giftSequence.ctaText}
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
};
