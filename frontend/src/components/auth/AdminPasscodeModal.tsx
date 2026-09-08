import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { ShieldAlert, KeyRound, Lock } from 'lucide-react';
import { Eyebrow } from '../ui/Typography';

interface AdminPasscodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminPasscodeModal: React.FC<AdminPasscodeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [digits, setDigits] = useState<string[]>(['', '', '', '']);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { verifyAdminPasscode } = useAuthStore();

  useEffect(() => {
    if (isOpen) {
      setDigits(['', '', '', '']);
      setErrorMessage(null);
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDigitChange = (index: number, value: string) => {
    if (value.length > 1) {
      const pasted = value.replace(/\D/g, '').slice(0, 4).split('');
      const nextDigits = [...digits];
      pasted.forEach((d, i) => {
        if (i < 4) nextDigits[i] = d;
      });
      setDigits(nextDigits);
      inputRefs.current[Math.min(pasted.length, 3)]?.focus();
      return;
    }

    const clean = value.replace(/\D/g, '');
    const nextDigits = [...digits];
    nextDigits[index] = clean;
    setDigits(nextDigits);

    if (clean && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const passcode = digits.join('');

    if (passcode.length !== 4) {
      setErrorMessage('Please enter the complete 4-digit passcode.');
      return;
    }

    setIsVerifying(true);
    setErrorMessage(null);

    const res = await verifyAdminPasscode(passcode);
    setIsVerifying(false);

    if (res.success) {
      onSuccess();
    } else {
      setErrorMessage(res.error || 'Incorrect admin passcode.');
      setDigits(['', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        className="relative w-full max-w-md rounded-[2.5rem] bg-[#1e1919] border border-red-500/30 p-8 sm:p-10 shadow-[0_25px_80px_rgba(244,63,94,0.25)] text-center overflow-hidden"
      >
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-gradient-to-br from-rose-500/20 to-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Shield Icon */}
        <div className="w-16 h-16 mx-auto mb-4 rounded-3xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-[0_0_30px_rgba(244,63,94,0.2)]">
          <KeyRound className="w-8 h-8" />
        </div>

        <Eyebrow accent className="mb-1 text-rose-400">MASTER ADMIN GATE</Eyebrow>
        <h3 className="font-display italic text-2xl sm:text-3xl text-white mb-2 leading-tight">
          Admin Showcase Console
        </h3>
        <p className="font-body text-xs sm:text-sm text-white/50 mb-6">
          Enter the 4-digit security passcode to access all previous wishes and showcase mode.
        </p>

        {/* Error Alert */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-3.5 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center justify-center gap-2"
          >
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </motion.div>
        )}

        {/* 4-Digit Passcode Input */}
        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex justify-center items-center gap-3 sm:gap-4">
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="password"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-14 h-16 sm:w-16 sm:h-18 text-center text-3xl font-bold font-mono text-white bg-black/50 border border-white/20 focus:border-rose-500 focus:bg-rose-500/[0.08] rounded-2xl outline-none transition-all shadow-inner focus:shadow-[0_0_20px_rgba(244,63,94,0.3)]"
              />
            ))}
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <button
              type="submit"
              disabled={isVerifying || digits.join('').length !== 4}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 text-white font-body font-black text-xs uppercase tracking-[0.18em] shadow-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {isVerifying ? (
                <span>Unlocking Master Console...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Unlock Admin Console →</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white font-body text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Return to Service Studio
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
