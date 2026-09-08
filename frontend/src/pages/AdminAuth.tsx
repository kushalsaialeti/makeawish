import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, KeyRound, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { Eyebrow } from '../components/ui/Typography';

export const AdminAuth: React.FC = () => {
  const [passcode, setPasscode] = useState('');
  const [email, setEmail] = useState('');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [step, setStep] = useState<'passcode' | 'otp'>('passcode');
  const [countdown, setCountdown] = useState<number>(60);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { adminRequestOtp, adminVerifyOtp } = useAuthStore();
  const navigate = useNavigate();

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setStatusMessage(null);

    if (passcode.trim() !== '1622') {
      setErrorMessage('Invalid Master Security Passcode.');
      return;
    }

    if (!email || !email.includes('@')) {
      setErrorMessage('Please provide a valid admin email address.');
      return;
    }

    setIsSubmitting(true);
    const res = await adminRequestOtp(passcode, email);
    setIsSubmitting(false);

    if (res.success) {
      setStep('otp');
      setStatusMessage(res.message || 'Verification code sent to your email.');
      setCountdown(60);
    } else {
      setErrorMessage(res.error || 'Failed to dispatch admin verification code.');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const otpCode = otpDigits.join('');
    if (otpCode.length !== 6) {
      setErrorMessage('Please enter all 6 digits of the verification code.');
      return;
    }

    setIsSubmitting(true);
    const res = await adminVerifyOtp(passcode, email, otpCode);
    setIsSubmitting(false);

    if (res.success) {
      navigate('/admin-1622');
    } else {
      setErrorMessage(res.error || 'Invalid admin verification code.');
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0 || isSubmitting) return;
    setIsSubmitting(true);
    setErrorMessage(null);
    const res = await adminRequestOtp(passcode, email);
    setIsSubmitting(false);

    if (res.success) {
      setStatusMessage('A fresh verification code has been dispatched.');
      setCountdown(60);
      setOtpDigits(['', '', '', '', '', '']);
    } else {
      setErrorMessage(res.error || 'Failed to resend code.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0d090a] text-[#f3d3d3] relative flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden select-none font-sans selection:bg-[#7a1022]">
      {/* Cybernetic Crimson Ambient Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-red-600/20 via-rose-900/15 to-purple-900/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-red-950/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Admin Gate Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-md w-full bg-[#181112]/95 backdrop-blur-2xl border border-red-500/30 p-8 sm:p-10 rounded-[2.5rem] shadow-[0_30px_90px_rgba(239,68,68,0.2)] text-center flex flex-col overflow-hidden"
      >
        {/* Top Glowing Master Shield */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-red-500/20 via-rose-600/15 to-transparent border border-red-500/40 flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(239,68,68,0.3)] text-red-400">
            🛡️
          </div>
        </div>

        <Eyebrow accent className="mb-1 text-red-400">SUPER ADMIN GATEWAY • PASSCODE 1622</Eyebrow>
        <h1 className="font-display italic text-3xl sm:text-4xl text-[#f5f1e8] mb-2 leading-tight">
          Admin Command Console
        </h1>
        <p className="font-body text-xs sm:text-sm text-white/50 mb-6">
          Authenticate with the Master Security Passcode and Email OTP to access showcase management.
        </p>

        {/* Error / Status Alert */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-red-950/70 border border-red-500/50 rounded-2xl p-3.5 text-xs font-body text-red-200 text-left flex items-start gap-2 shadow-inner"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400" />
            <span className="leading-snug">{errorMessage}</span>
          </motion.div>
        )}

        {statusMessage && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl p-3.5 text-xs font-body text-emerald-200 text-left flex items-start gap-2"
          >
            <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-400" />
            <span className="leading-snug">{statusMessage}</span>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {step === 'passcode' ? (
            /* Step 1: Master Passcode + Email Form */
            <motion.form
              key="step-passcode"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleRequestOtp}
              className="space-y-4 text-left"
            >
              <div>
                <label className="block text-[11px] font-body font-semibold uppercase tracking-[0.16em] text-red-300/80 mb-1.5 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Master Security Passcode</span>
                </label>
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter 4-digit passcode (1622)"
                  required
                  maxLength={4}
                  disabled={isSubmitting}
                  className="w-full bg-black/60 border border-red-500/30 focus:border-red-500 focus:ring-1 focus:ring-red-500 rounded-2xl px-4 py-3.5 font-mono text-center text-lg tracking-[0.3em] text-white placeholder:text-white/20 transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-body font-semibold uppercase tracking-[0.16em] text-red-300/80 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  <span>Admin Verification Email</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@makeawish.app"
                  required
                  disabled={isSubmitting}
                  className="w-full bg-black/60 border border-white/15 focus:border-red-500 focus:ring-1 focus:ring-red-500 rounded-2xl px-4 py-3.5 font-body text-sm text-white placeholder:text-white/20 transition-all outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || passcode.length !== 4 || !email}
                className="w-full mt-2 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white py-4 rounded-2xl font-body font-black text-xs uppercase tracking-[0.18em] shadow-2xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Passcode...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Send Verification OTP →</span>
                  </>
                )}
              </button>
            </motion.form>
          ) : (
            /* Step 2: 6-Digit Email OTP Verification */
            <motion.form
              key="step-otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleVerifyOtp}
              className="space-y-6"
            >
              <div className="flex justify-between items-center gap-2">
                {otpDigits.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/\D/g, '');
                      const next = [...otpDigits];
                      next[index] = clean;
                      setOtpDigits(next);
                      if (clean && index < 5) {
                        (document.getElementById(`admin-otp-${index + 1}`) as HTMLInputElement)?.focus();
                      }
                    }}
                    id={`admin-otp-${index}`}
                    className="w-11 h-14 sm:w-13 sm:h-16 text-center text-2xl font-bold font-mono text-white bg-black/60 border border-red-500/30 focus:border-red-500 focus:bg-red-500/[0.08] rounded-2xl outline-none transition-all shadow-inner"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || otpDigits.join('').length !== 6}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white font-body font-black text-xs uppercase tracking-[0.18em] shadow-2xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Authorizing Super Admin...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Unlock Admin Console 🛡️</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-xs text-white/50 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('passcode')}
                  className="text-white/60 hover:text-white transition-colors underline underline-offset-4"
                >
                  ← Change Email / Passcode
                </button>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={countdown > 0 || isSubmitting}
                  className="text-red-400 hover:text-red-300 transition-colors disabled:text-white/30"
                >
                  {countdown > 0 ? `Resend code in ${countdown}s` : 'Resend Code'}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
