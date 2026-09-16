import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Eyebrow } from '../components/ui/Typography';
import { SmoothOtpInput } from '../components/auth/SmoothOtpInput';
import {
  Mail,
  Lock,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Eye,
  EyeOff,
} from 'lucide-react';

export const ResetPassword: React.FC = () => {
  const [step, setStep] = useState<'email' | 'reset' | 'success'>('email');
  const [email, setEmail] = useState('');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    forgotPassword,
    resetPassword,
    isSandboxRestricted,
    devOtp,
  } = useAuthStore();

  const navigate = useNavigate();

  // Resend countdown timer
  useEffect(() => {
    let timer: any;
    if (step === 'reset' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  // Handle Step 1: Request Password Reset OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const res = await forgotPassword(email);
    setIsSubmitting(false);

    if (res.success) {
      setStep('reset');
      setCountdown(60);
      setSuccessMessage('A 6-digit password reset code has been sent to your email.');
    } else {
      setErrorMessage(res.error || 'Failed to send reset code. Please check your email.');
    }
  };

  // Handle Step 2: Submit OTP and New Password
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otpDigits.join('');

    if (otpCode.length !== 6) {
      setErrorMessage('Please enter all 6 digits of the verification code.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify both fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const res = await resetPassword(email, otpCode, newPassword, true);
    setIsSubmitting(false);

    if (res.success) {
      setStep('success');
      setTimeout(() => {
        navigate('/wishes', { replace: true });
      }, 2400);
    } else {
      setErrorMessage(res.error || 'Failed to reset password. Please verify the code.');
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (countdown > 0 || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    const res = await forgotPassword(email);
    setIsSubmitting(false);

    if (res.success) {
      setCountdown(60);
      setSuccessMessage('A fresh verification code has been dispatched to your email.');
      setOtpDigits(['', '', '', '', '', '']);
    } else {
      setErrorMessage(res.error || 'Failed to resend code.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0c0d] text-[#e6d0d2] relative flex flex-col items-center justify-center pt-24 pb-12 px-4 sm:px-6 overflow-hidden select-none font-sans selection:bg-[#7a1022]">
      {/* Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-rose-600/15 via-pink-900/10 to-amber-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-900/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Container Card */}
      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-md w-full bg-[#181415]/95 backdrop-blur-2xl border border-white/10 p-6 sm:p-10 rounded-[2.5rem] shadow-[0_25px_80px_rgba(0,0,0,0.8)] text-center flex flex-col"
      >
        {/* Top Icon Badge */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-rose-400 shadow-inner">
            {step === 'success' ? (
              <CheckCircle2 className="w-7 h-7 text-emerald-400" />
            ) : step === 'reset' ? (
              <KeyRound className="w-6 h-6 text-rose-400" />
            ) : (
              <Mail className="w-6 h-6 text-rose-400" />
            )}
          </div>
        </div>

        {/* Dynamic Header & Step Indicator */}
        <Eyebrow accent className="mb-1 text-rose-400">
          {step === 'email'
            ? 'PASSWORD RECOVERY • STEP 1'
            : step === 'reset'
            ? 'PASSWORD RECOVERY • STEP 2'
            : 'SUCCESS'}
        </Eyebrow>

        <h1 className="font-display italic text-3xl sm:text-4xl text-white mb-2 leading-tight">
          {step === 'email'
            ? 'Reset Password'
            : step === 'reset'
            ? 'Set New Password'
            : 'Password Reset!'}
        </h1>

        <p className="font-body text-xs sm:text-sm text-white/50 mb-6">
          {step === 'email'
            ? 'Enter your registered email and we will dispatch a 6-digit verification code.'
            : step === 'reset'
            ? `Enter the 6-digit code sent to ${email} along with your new password.`
            : 'Your password has been successfully updated. Preparing your celebration studio...'}
        </p>

        {/* Error Alert */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 bg-red-950/60 border border-red-500/40 rounded-2xl p-3.5 text-xs font-body text-red-200 text-left flex items-start gap-2.5"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400" />
            <span className="leading-snug">{errorMessage}</span>
          </motion.div>
        )}

        {/* Success Alert */}
        {successMessage && step !== 'success' && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 bg-emerald-950/50 border border-emerald-500/30 rounded-2xl p-3.5 text-xs font-body text-emerald-200 text-left flex items-start gap-2.5"
          >
            <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-400" />
            <span className="leading-snug">{successMessage}</span>
          </motion.div>
        )}

        {/* Sandbox Dev Notice */}
        {isSandboxRestricted && devOtp && step === 'reset' && (
          <div className="mb-5 p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-left">
            <div className="flex items-center gap-2 text-amber-300 font-mono text-xs font-bold mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Resend Sandbox Development Code</span>
            </div>
            <p className="text-[11px] text-white/60 leading-relaxed mb-2 font-body">
              Your Resend domain is in sandbox mode. Use your test reset code:
            </p>
            <div className="flex items-center justify-between bg-black/40 px-3 py-1.5 rounded-lg border border-amber-500/20">
              <span className="font-mono text-base font-bold text-amber-300 tracking-wider">
                {devOtp}
              </span>
              <button
                type="button"
                onClick={() => {
                  const digits = devOtp.split('').slice(0, 6);
                  setOtpDigits(digits);
                }}
                className="text-[10px] font-mono uppercase bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 px-2 py-1 rounded transition-colors"
              >
                Auto-fill
              </button>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* STEP 1: Enter Email */}
          {step === 'email' && (
            <motion.form
              key="step-email"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleRequestOtp}
              className="space-y-4 text-left"
            >
              <div>
                <label className="block text-[11px] font-body font-semibold uppercase tracking-[0.16em] text-white/60 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-rose-400/70" />
                  <span>Account Email</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  disabled={isSubmitting}
                  className="w-full bg-black/50 border border-white/15 focus:border-rose-500 rounded-xl px-4 py-3 font-body text-sm text-white placeholder:text-white/20 transition-all outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !email}
                className="w-full mt-2 bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 text-white py-3.5 rounded-xl font-body font-bold text-xs uppercase tracking-[0.18em] shadow-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Sending Code...</span>
                  </>
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="mt-6 pt-5 border-t border-white/10 text-center font-body text-xs text-white/50 flex items-center justify-center gap-1">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-white/70 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Sign In</span>
                </Link>
              </div>
            </motion.form>
          )}

          {/* STEP 2: Enter OTP + New Password */}
          {step === 'reset' && (
            <motion.form
              key="step-reset"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleResetSubmit}
              className="space-y-4 text-left"
            >
              {/* 6-Digit OTP Input */}
              <div className="py-1">
                <label className="block text-[11px] font-body font-semibold uppercase tracking-[0.16em] text-white/60 mb-2.5">
                  6-Digit Verification Code
                </label>
                <SmoothOtpInput
                  value={otpDigits}
                  onChange={setOtpDigits}
                  disabled={isSubmitting}
                  autoFocus={true}
                  idPrefix="reset-otp"
                />
              </div>

              {/* New Password */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-[11px] font-body font-semibold uppercase tracking-[0.16em] text-white/60 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-rose-400/70" />
                    <span>New Password</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[10px] font-mono text-rose-400/80 hover:text-rose-300 uppercase tracking-wider transition-colors flex items-center gap-1"
                  >
                    {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{showPassword ? 'Hide' : 'Show'}</span>
                  </button>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  disabled={isSubmitting}
                  className="w-full bg-black/50 border border-white/15 focus:border-rose-500 rounded-xl px-4 py-3 font-body text-sm text-white placeholder:text-white/20 transition-all outline-none"
                />
              </div>

              {/* Confirm New Password */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-[11px] font-body font-semibold uppercase tracking-[0.16em] text-white/60 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-rose-400/70" />
                    <span>Confirm New Password</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-[10px] font-mono text-rose-400/80 hover:text-rose-300 uppercase tracking-wider transition-colors flex items-center gap-1"
                  >
                    {showConfirmPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{showConfirmPassword ? 'Hide' : 'Show'}</span>
                  </button>
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  required
                  disabled={isSubmitting}
                  className="w-full bg-black/50 border border-white/15 focus:border-rose-500 rounded-xl px-4 py-3 font-body text-sm text-white placeholder:text-white/20 transition-all outline-none"
                />
              </div>

              {/* Resend Code Button & Countdown */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] font-body text-white/40">
                  {countdown > 0 ? `Resend available in ${countdown}s` : "Didn't receive code?"}
                </span>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={countdown > 0 || isSubmitting}
                  className="text-[11px] font-body font-semibold text-rose-400 hover:text-rose-300 disabled:opacity-30 disabled:hover:text-rose-400 transition-colors"
                >
                  Resend Code
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || otpDigits.join('').length !== 6 || !newPassword}
                className="w-full mt-3 bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 text-white py-3.5 rounded-xl font-body font-bold text-xs uppercase tracking-[0.18em] shadow-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <span>Reset Password & Enter</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setStep('email');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className="text-xs font-body text-white/50 hover:text-white/80 transition-colors inline-flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Change Email</span>
                </button>
              </div>
            </motion.form>
          )}

          {/* STEP 3: Success Animation */}
          {step === 'success' && (
            <motion.div
              key="step-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-4 space-y-4"
            >
              <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl text-emerald-200 text-sm font-body">
                Your new password has been safely updated and encrypted. You are now being redirected to your celebration studio.
              </div>
              <button
                type="button"
                onClick={() => navigate('/wishes', { replace: true })}
                className="w-full bg-white/10 hover:bg-white/15 text-white py-3 rounded-xl font-body font-bold text-xs uppercase tracking-[0.18em] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Go to Studio Immediately</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
