import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Eyebrow } from '../components/ui/Typography';

interface NotFoundProps {
  title?: string;
  message?: string;
  showCreateButton?: boolean;
}

export const NotFound: React.FC<NotFoundProps> = ({
  title = "Lost in the Stars",
  message = "The magical wish or page you are looking for doesn't exist, may have expired, or drifted away into the cosmos.",
  showCreateButton = true
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#151111] text-[#e6d0d2] relative flex flex-col items-center justify-center p-6 overflow-hidden select-none font-sans selection:bg-[#7a1022] selection:text-[#f3d3d3]">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-pink-600/15 via-rose-900/10 to-amber-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-900/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Floating starry particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(18)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.6 + 0.2,
            }}
            animate={{
              y: [0, -25, 0],
              opacity: [0.2, 0.9, 0.2],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main Glass Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-xl w-full bg-[#1e1919]/85 backdrop-blur-xl border border-white/15 p-8 md:p-12 rounded-[2.5rem] shadow-[0_25px_80px_rgba(0,0,0,0.7)] text-center flex flex-col items-center"
      >
        {/* Floating Sparkle / Gift Icon */}
        <motion.div
          animate={{
            y: [0, -8, 0],
            rotate: [0, 4, -4, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-gradient-to-br from-pink-500/20 via-rose-600/15 to-transparent border border-pink-500/30 flex items-center justify-center text-4xl md:text-5xl shadow-[0_0_40px_rgba(244,63,94,0.2)] mb-6"
        >
          ✨
        </motion.div>

        {/* Eyebrow */}
        <Eyebrow accent className="mb-3">
          <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping mr-1" />
          404 ERROR • PAGE NOT FOUND
        </Eyebrow>

        {/* Title */}
        <h1 className="font-display italic text-display-md text-white mb-4">
          {title}
        </h1>

        {/* Description */}
        <p className="font-body text-sm md:text-base text-white/70 leading-relaxed mb-8 max-w-md">
          {message}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
          {showCreateButton && (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate('/wishes')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 text-white font-body font-black text-xs md:text-sm uppercase tracking-[0.18em] shadow-[0_10px_30px_rgba(225,29,72,0.4)] hover:shadow-[0_15px_40px_rgba(225,29,72,0.6)] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>✨</span>
              <span>Create a Wish for Your Person</span>
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white font-body font-bold text-xs md:text-sm uppercase tracking-[0.16em] border border-white/10 transition-all cursor-pointer"
          >
            ← Go Back
          </motion.button>
        </div>

        {/* Quick Hint */}
        <div className="mt-8 pt-6 border-t border-white/5 font-body text-xs text-white/40 tracking-wider">
          Tip: You can design, customize, and share personalized birthday experiences from the Wish Factory.
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
