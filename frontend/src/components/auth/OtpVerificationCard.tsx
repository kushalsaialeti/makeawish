import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, RefreshCw, ArrowLeft, Sparkles, AlertCircle } from 'lucide-react';

interface OtpVerificationCardProps {
  email: string;
  onBack: () => void;
  onSuccess?: () => void;
}

export const OtpVerificationCard: React.FC<OtpVerificationCardProps> = ({
  email,
  onBack,
  onSuccess,
}) => {
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState<number>(60);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { verifyOtp, resendOtp, isLoading, rememberMe, devOtp, isSandboxRestricted } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();

    // 60-second countdown timer
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleQuickFill = (code: string) => {
    const cleanDigits = code.replace(/\D/g, '').slice(0, 6).split('');
    const newDigits = ['', '', '', '', '', ''];
    cleanDigits.forEach((digit, i) => {
      if (i < 6) newDigits[i] = digit;
    });
    setDigits(newDigits);
    inputRefs.current[5]?.focus();
  };

  const handleDigitChange = (index: number, value: string) => {
    // Handle multiple characters pasted
    if (value.length > 1) {
      const pastedDigits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newDigits = [...digits];
      pastedDigits.forEach((digit, i) => {
        if (i < 6) newDigits[i] = digit;
      });
      setDigits(newDigits);
      const nextIndex = Math.min(pastedDigits.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    const cleanDigit = value.replace(/\D/g, '');
    const newDigits = [...digits];
    newDigits[index] = cleanDigit;
    setDigits(newDigits);

    // Auto-advance to next input
    if (cleanDigit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pastedData) return;

    const newDigits = [...digits];
    pastedData.split('').forEach((char, i) => {
      if (i < 6) newDigits[i] = char;
    });
    setDigits(newDigits);
    inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
  };

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);
    setStatusMessage(null);

    const otpCode = digits.join('');
    if (otpCode.length !== 6) {
      setErrorMessage('Please enter all 6 digits of the verification code.');
      return;
    }

    const result = await verifyOtp(email, otpCode, rememberMe);
    if (result.success) {
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/wishes');
      }
    } else {
      setErrorMessage(result.error || 'Verification code failed');
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0 || isResending) return;
    setIsResending(true);
    setErrorMessage(null);
    setStatusMessage(null);

    const result = await resendOtp(email);
    setIsResending(false);

    if (result.success) {
      setStatusMessage(result.message || 'A new 6-digit code has been dispatched.');
      setCountdown(60);
      setDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } else {
      setErrorMessage(result.error || 'Failed to resend code');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="relative rounded-3xl bg-neutral-900/80 border border-white/10 p-8 sm:p-10 shadow-2xl backdrop-blur-2xl overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-gradient-to-br from-rose-500/20 to-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Back Button */}
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs text-white/50 hover:text-white/90 transition-colors mb-6 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          <span>Back to edit email</span>
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.15)]">
            <ShieldCheck className="w-7 h-7" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif text-white mb-2">
            Verify Your Email
          </h2>
          <p className="text-sm text-white/60">
            Verification code requested for
          </p>
          <p className="text-sm font-semibold text-rose-300 mt-1 font-mono break-all">
            {email}
          </p>
        </div>

        {/* Resend Sandbox Diagnostic Card */}
        {isSandboxRestricted && devOtp && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-2.5"
          >
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-amber-300">Resend Testing Sandbox Notice:</span>
                <p className="text-amber-200/80 mt-1 leading-relaxed">
                  The default test sender (<code className="bg-black/40 px-1 py-0.5 rounded text-amber-300">onboarding@resend.dev</code>) only delivers real inbox emails to the account owner (<code className="bg-black/40 px-1 py-0.5 rounded text-amber-300">kushalsaialeti98@gmail.com</code>).
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-amber-500/20">
              <span className="font-mono text-xs text-amber-300 font-bold">Code: {devOtp}</span>
              <button
                type="button"
                onClick={() => handleQuickFill(devOtp)}
                className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-[11px] font-semibold transition-colors border border-amber-500/30"
              >
                Auto Fill Code
              </button>
            </div>
          </motion.div>
        )}

        {/* Status / Error Alerts */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-300 text-xs"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </motion.div>
        )}

        {statusMessage && !isSandboxRestricted && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3 text-emerald-300 text-xs"
          >
            <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{statusMessage}</span>
          </motion.div>
        )}

        {/* 6-Digit OTP Form */}
        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex justify-between items-center gap-2 sm:gap-3">
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-11 h-13 sm:w-13 sm:h-15 text-center text-2xl font-bold font-mono text-white bg-white/[0.04] border border-white/15 focus:border-rose-500 focus:bg-rose-500/[0.06] rounded-xl outline-none transition-all shadow-inner focus:shadow-[0_0_15px_rgba(244,63,94,0.3)]"
              />
            ))}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || digits.join('').length !== 6}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-medium shadow-lg shadow-rose-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            {isLoading ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>Verify & Unlock Studio</span>
                <Sparkles className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Resend Section */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-xs text-white/50 mb-3">
            Didn't receive the email code?
          </p>
          <button
            type="button"
            onClick={handleResendCode}
            disabled={countdown > 0 || isResending}
            className="inline-flex items-center gap-2 text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors disabled:text-white/30 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
            {countdown > 0 ? (
              <span>Resend code in {countdown}s</span>
            ) : (
              <span>Resend OTP Code</span>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
