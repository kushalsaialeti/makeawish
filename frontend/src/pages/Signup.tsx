import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Eyebrow } from '../components/ui/Typography';
import { GoogleLoginButton } from '../components/auth/GoogleLoginButton';
import { OtpVerificationCard } from '../components/auth/OtpVerificationCard';
import {
  User,
  Mail,
  Lock,
  KeyRound,
  Sparkles,
  AlertCircle,
  RefreshCw,
  ArrowRight,
} from 'lucide-react';

export const Signup: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showOtpScreen, setShowOtpScreen] = useState(false);

  const { signup, pendingEmail } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/wishes';

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    if (password.length < 6) {
      setAuthError('Password must be at least 6 characters long.');
      return;
    }

    if (pin && !/^\d{4}$/.test(pin.trim())) {
      setAuthError('Security PIN must be exactly 4 digits.');
      return;
    }

    setIsSubmitting(true);
    setAuthError(null);

    const res = await signup(fullName || 'Dreamer', email, password, pin || '1622');
    setIsSubmitting(false);

    if (res.success) {
      setShowOtpScreen(true);
    } else {
      setAuthError(res.error || 'Failed to create account. Please try again.');
    }
  };

  if (showOtpScreen || pendingEmail) {
    return (
      <div className="min-h-screen bg-[#0e0c0d] text-[#e6d0d2] relative flex flex-col items-center justify-center pt-24 pb-12 px-4 sm:px-6 overflow-hidden select-none font-sans selection:bg-[#7a1022]">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-rose-600/15 via-pink-900/10 to-amber-600/10 rounded-full blur-[140px] pointer-events-none" />
        <OtpVerificationCard
          email={pendingEmail || email}
          onBack={() => setShowOtpScreen(false)}
          onSuccess={() => navigate(from, { replace: true })}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0e0c0d] text-[#e6d0d2] relative flex flex-col items-center justify-center pt-24 pb-12 px-4 sm:px-6 overflow-hidden select-none font-sans selection:bg-[#7a1022]">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-rose-600/15 via-pink-900/10 to-amber-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-900/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Signup Card */}
      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-md w-full bg-[#181415]/95 backdrop-blur-2xl border border-white/10 p-6 sm:p-10 rounded-[2.5rem] shadow-[0_25px_80px_rgba(0,0,0,0.8)] text-center flex flex-col"
      >
        {/* Brand Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-rose-400 shadow-inner">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

        <Eyebrow accent className="mb-1 text-rose-400">CREATE ACCOUNT • CELEBRATION STUDIO</Eyebrow>
        <h1 className="font-display italic text-3xl sm:text-4xl text-white mb-2 leading-tight">
          Craft Magical Stories
        </h1>
        <p className="font-body text-xs sm:text-sm text-white/50 mb-6">
          Join MakeAWish to design and share personalized celebration experiences.
        </p>

        {/* Error Notification */}
        {authError && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 bg-red-950/60 border border-red-500/40 rounded-2xl p-3.5 text-xs font-body text-red-200 text-left flex items-start gap-2.5"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400" />
            <span className="leading-snug">{authError}</span>
          </motion.div>
        )}

        {/* Google Sign-In */}
        <GoogleLoginButton buttonText="Sign Up with Google" className="mb-4" />

        {/* Divider */}
        <div className="flex items-center gap-3 my-4">
          <div className="h-px bg-white/10 flex-1" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-white/30">or with email</span>
          <div className="h-px bg-white/10 flex-1" />
        </div>

        {/* Email Registration Form */}
        <form onSubmit={handleEmailSignup} className="space-y-4 text-left">
          <div>
            <label className="block text-[11px] font-body font-semibold uppercase tracking-[0.16em] text-white/60 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-rose-400/70" />
              <span>Full Name</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Kushal Sai"
              disabled={isSubmitting}
              className="w-full bg-black/50 border border-white/15 focus:border-rose-500 rounded-xl px-4 py-3 font-body text-sm text-white placeholder:text-white/20 transition-all outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-body font-semibold uppercase tracking-[0.16em] text-white/60 mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-rose-400/70" />
              <span>Email Address</span>
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

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-[11px] font-body font-semibold uppercase tracking-[0.16em] text-white/60 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-rose-400/70" />
                <span>Password</span>
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[10px] font-mono text-rose-400/80 hover:text-rose-300 uppercase tracking-wider transition-colors"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
              minLength={6}
              disabled={isSubmitting}
              className="w-full bg-black/50 border border-white/15 focus:border-rose-500 rounded-xl px-4 py-3 font-body text-sm text-white placeholder:text-white/20 transition-all outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-body font-semibold uppercase tracking-[0.16em] text-white/60 mb-1.5 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-rose-400/70" />
              <span>4-Digit Security PIN (For Account Login)</span>
            </label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              placeholder="e.g. 1622"
              required
              disabled={isSubmitting}
              className="w-full bg-black/50 border border-white/15 focus:border-rose-500 rounded-xl px-4 py-3 font-mono text-center text-lg tracking-[0.3em] text-white placeholder:text-white/20 transition-all outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !email || !password || pin.length !== 4}
            className="w-full mt-2 bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 text-white py-3.5 rounded-xl font-body font-bold text-xs uppercase tracking-[0.18em] shadow-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Sending Verification Code...</span>
              </>
            ) : (
              <>
                <span>Create Account & Send OTP</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-6 pt-5 border-t border-white/10 text-center font-body text-xs text-white/50">
          Already have an account?{' '}
          <Link to="/login" state={{ from: location.state?.from }} className="text-rose-400 hover:text-rose-300 font-bold underline underline-offset-4 transition-colors">
            Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
