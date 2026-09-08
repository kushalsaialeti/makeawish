import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Eyebrow } from '../components/ui/Typography';
import { GoogleLoginButton } from '../components/auth/GoogleLoginButton';
import { OtpVerificationCard } from '../components/auth/OtpVerificationCard';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showOtpScreen, setShowOtpScreen] = useState(false);

  const { login } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/wishes';

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsSubmitting(true);
    setAuthError(null);

    const res = await login(email, password, rememberMe);
    setIsSubmitting(false);

    if (res.success) {
      navigate(from, { replace: true });
    } else if (res.needsOtpVerification) {
      setShowOtpScreen(true);
    } else {
      setAuthError(res.error || 'Failed to sign in. Please check your credentials.');
    }
  };

  if (showOtpScreen) {
    return (
      <div className="min-h-screen bg-[#151111] text-[#e6d0d2] relative flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden select-none font-sans selection:bg-[#7a1022] selection:text-[#f3d3d3]">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-pink-600/15 via-rose-900/10 to-amber-600/10 rounded-full blur-[140px] pointer-events-none" />
        <OtpVerificationCard
          email={email}
          onBack={() => setShowOtpScreen(false)}
          onSuccess={() => navigate(from, { replace: true })}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#151111] text-[#e6d0d2] relative flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden select-none font-sans selection:bg-[#7a1022] selection:text-[#f3d3d3]">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-pink-600/15 via-rose-900/10 to-amber-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-900/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Floating starry particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(16)].map((_, i) => (
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

      {/* Main Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-md w-full bg-[#1e1919]/90 backdrop-blur-xl border border-white/15 p-6 sm:p-10 rounded-[2.5rem] shadow-[0_25px_80px_rgba(0,0,0,0.7)] text-center flex flex-col"
      >
        {/* Brand Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500/20 via-rose-600/15 to-transparent border border-pink-500/30 flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(244,63,94,0.2)]">
            ✨
          </div>
        </div>

        <Eyebrow accent className="mb-1">SIGN IN • CELEBRATION STUDIO</Eyebrow>
        <h1 className="font-display italic text-3xl sm:text-4xl text-[#f5f1e8] mb-2 leading-tight">
          Welcome Back
        </h1>
        <p className="font-body text-xs sm:text-sm text-white/50 mb-8">
          Sign in to design, manage, and share your special occasion stories.
        </p>

        {/* Error Notification */}
        {authError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-red-950/50 border border-red-500/40 rounded-2xl p-3.5 text-xs font-body text-red-200 text-left flex items-start gap-2"
          >
            <span className="text-base leading-none">⚠️</span>
            <span className="leading-snug">{authError}</span>
          </motion.div>
        )}

        {/* Google One-Click Login Button */}
        <GoogleLoginButton rememberMe={rememberMe} buttonText="Continue with Google" className="mb-6" />

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px bg-white/10 flex-1" />
          <span className="text-[10px] font-body uppercase tracking-widest text-white/30">or with email</span>
          <div className="h-px bg-white/10 flex-1" />
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleEmailLogin} className="space-y-4 text-left">
          <div>
            <label className="block text-[11px] font-body font-semibold uppercase tracking-[0.16em] text-white/60 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              disabled={isSubmitting}
              className="w-full bg-black/40 border border-white/15 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 rounded-xl px-4 py-3 font-body text-sm text-white placeholder:text-white/20 transition-all outline-none"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-[11px] font-body font-semibold uppercase tracking-[0.16em] text-white/60">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[10px] font-body text-pink-400/80 hover:text-pink-300 uppercase tracking-wider transition-colors"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={isSubmitting}
              className="w-full bg-black/40 border border-white/15 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 rounded-xl px-4 py-3 font-body text-sm text-white placeholder:text-white/20 transition-all outline-none"
            />
          </div>

          {/* Remember Me Option */}
          <div className="flex items-center justify-between pt-1 pb-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-white/20 bg-black/40 text-pink-500 focus:ring-pink-500/50 accent-pink-500 cursor-pointer"
              />
              <span className="text-xs font-body text-white/60 hover:text-white/80 transition-colors">
                Remember me (72h session)
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !email || !password}
            className="w-full mt-2 bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 text-white py-4 rounded-2xl font-body font-black text-xs uppercase tracking-[0.18em] shadow-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin">✨</span>
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign In to Studio →</span>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center font-body text-xs text-white/50">
          Don't have an account yet?{' '}
          <Link to="/signup" state={{ from: location.state?.from }} className="text-pink-400 hover:text-pink-300 font-bold underline underline-offset-4 transition-colors">
            Create Account
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
