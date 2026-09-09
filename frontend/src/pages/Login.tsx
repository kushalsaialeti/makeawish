import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Eyebrow } from '../components/ui/Typography';
import { GoogleLoginButton } from '../components/auth/GoogleLoginButton';
import {
  Mail,
  Lock,
  KeyRound,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [pinDigits, setPinDigits] = useState<string[]>(['', '', '', '']);
  const [rememberMe, setRememberMe] = useState(true);
  const [countdown, setCountdown] = useState(60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const {
    login,
    verifyLoginOtp,
    verifySecurityPin,
    resendOtp,
    loginStep,
    setLoginStep,
    isSandboxRestricted,
    devOtp,
  } = useAuthStore();

  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/wishes';

  // Step 1: Submit Credentials
  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsSubmitting(true);
    setAuthError(null);
    setStatusMessage(null);

    const res = await login(email, password);
    setIsSubmitting(false);

    if (res.success) {
      setStatusMessage('Verification code sent to your email.');
      setCountdown(60);
    } else {
      setAuthError(res.error || 'Failed to sign in. Please check your credentials.');
    }
  };

  // Step 2: Verify 6-Digit Email OTP
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otpDigits.join('');
    if (otpCode.length !== 6) {
      setAuthError('Please enter all 6 digits of the verification code.');
      return;
    }

    setIsSubmitting(true);
    setAuthError(null);
    const res = await verifyLoginOtp(email, otpCode);
    setIsSubmitting(false);

    if (res.success) {
      setStatusMessage('OTP verified. Please enter your 4-digit Security PIN.');
    } else {
      setAuthError(res.error || 'Invalid verification code.');
    }
  };

  // Step 3: Verify 4-Digit Security PIN
  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const pinCode = pinDigits.join('');
    if (pinCode.length !== 4) {
      setAuthError('Please enter all 4 digits of your Security PIN.');
      return;
    }

    setIsSubmitting(true);
    setAuthError(null);
    const res = await verifySecurityPin(email, pinCode, rememberMe);
    setIsSubmitting(false);

    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setAuthError(res.error || 'Incorrect Security PIN.');
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (countdown > 0 || isSubmitting) return;
    setIsSubmitting(true);
    setAuthError(null);
    const res = await resendOtp(email);
    setIsSubmitting(false);

    if (res.success) {
      setStatusMessage('A fresh verification code has been dispatched to your email.');
      setCountdown(60);
      setOtpDigits(['', '', '', '', '', '']);
    } else {
      setAuthError(res.error || 'Failed to resend code.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0c0d] text-[#e6d0d2] relative flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden select-none font-sans selection:bg-[#7a1022]">
      {/* Refined Ambient Glow */}
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
            {loginStep === 'credentials' && <Lock className="w-6 h-6" />}
            {loginStep === 'otp' && <Mail className="w-6 h-6" />}
            {loginStep === 'pin' && <KeyRound className="w-6 h-6" />}
          </div>
        </div>

        {/* Dynamic Header & Step Indicator */}
        <Eyebrow accent className="mb-1 text-rose-400">
          {loginStep === 'credentials' && 'STEP 1 OF 3 • SIGN IN'}
          {loginStep === 'otp' && 'STEP 2 OF 3 • EMAIL VERIFICATION'}
          {loginStep === 'pin' && 'STEP 3 OF 3 • SECURITY PIN'}
        </Eyebrow>

        <h1 className="font-display italic text-3xl sm:text-4xl text-white mb-2 leading-tight">
          {loginStep === 'credentials' && 'Welcome Back'}
          {loginStep === 'otp' && 'Enter Email Code'}
          {loginStep === 'pin' && 'Enter Security PIN'}
        </h1>

        <p className="font-body text-xs sm:text-sm text-white/50 mb-6">
          {loginStep === 'credentials' && 'Sign in to access your celebration studio and manage experiences.'}
          {loginStep === 'otp' && `We sent a 6-digit verification code to ${email}`}
          {loginStep === 'pin' && 'Enter your 4-digit Security PIN to complete login.'}
        </p>

        {/* Error / Status Alert */}
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

        {statusMessage && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 bg-emerald-950/50 border border-emerald-500/30 rounded-2xl p-3.5 text-xs font-body text-emerald-200 text-left flex items-start gap-2.5"
          >
            <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-400" />
            <span className="leading-snug">{statusMessage}</span>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {loginStep === 'credentials' && (
            <motion.div
              key="step-credentials"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <GoogleLoginButton rememberMe={rememberMe} buttonText="Continue with Google" className="mb-4" />

              <div className="flex items-center gap-3 my-4">
                <div className="h-px bg-white/10 flex-1" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/30">or with email</span>
                <div className="h-px bg-white/10 flex-1" />
              </div>

              <form onSubmit={handleCredentialsSubmit} className="space-y-4 text-left">
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
                    placeholder="••••••••"
                    required
                    disabled={isSubmitting}
                    className="w-full bg-black/50 border border-white/15 focus:border-rose-500 rounded-xl px-4 py-3 font-body text-sm text-white placeholder:text-white/20 transition-all outline-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-1 pb-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-white/20 bg-black/40 text-rose-500 focus:ring-rose-500/50 accent-rose-500 cursor-pointer"
                    />
                    <span className="text-xs font-body text-white/60 hover:text-white/80 transition-colors">
                      Remember me (36h session)
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !email || !password}
                  className="w-full mt-2 bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 text-white py-3.5 rounded-xl font-body font-bold text-xs uppercase tracking-[0.18em] shadow-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Sending OTP...</span>
                    </>
                  ) : (
                    <>
                      <span>Next: Verify Email</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-white/10 text-center font-body text-xs text-white/50">
                Don't have an account yet?{' '}
                <Link to="/signup" state={{ from: location.state?.from }} className="text-rose-400 hover:text-rose-300 font-bold underline underline-offset-4 transition-colors">
                  Create Account
                </Link>
              </div>
            </motion.div>
          )}

          {loginStep === 'otp' && (
            <motion.form
              key="step-otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleOtpSubmit}
              className="space-y-6"
            >
              {/* Resend Sandbox Diagnostic Notice */}
              {isSandboxRestricted && devOtp && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-2.5">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-amber-300">Resend Testing Sandbox Notice:</span>
                      <p className="text-amber-200/80 mt-1 leading-relaxed">
                        The test sender (<code className="bg-black/40 px-1 py-0.5 rounded text-amber-300">onboarding@resend.dev</code>) only delivers live inbox emails to the account owner (<code className="bg-black/40 px-1 py-0.5 rounded text-amber-300">kushalsaialeti98@gmail.com</code>).
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-amber-500/20">
                    <span className="font-mono text-xs text-amber-300 font-bold">Code: {devOtp}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const cleanDigits = devOtp.replace(/\D/g, '').slice(0, 6).split('');
                        const next = ['', '', '', '', '', ''];
                        cleanDigits.forEach((d, i) => { if (i < 6) next[i] = d; });
                        setOtpDigits(next);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-[11px] font-semibold transition-colors border border-amber-500/30 cursor-pointer"
                    >
                      Auto Fill Code
                    </button>
                  </div>
                </div>
              )}

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
                        (document.getElementById(`login-otp-${index + 1}`) as HTMLInputElement)?.focus();
                      }
                    }}
                    id={`login-otp-${index}`}
                    className="w-11 h-14 sm:w-13 sm:h-16 text-center text-2xl font-bold font-mono text-white bg-black/60 border border-white/20 focus:border-rose-500 focus:bg-rose-500/[0.08] rounded-2xl outline-none transition-all shadow-inner"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || otpDigits.join('').length !== 6}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 text-white font-body font-black text-xs uppercase tracking-[0.18em] shadow-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <>
                    <span>Next: Security PIN</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-xs text-white/50 pt-1">
                <button
                  type="button"
                  onClick={() => setLoginStep('credentials')}
                  className="text-white/60 hover:text-white transition-colors underline underline-offset-4 cursor-pointer"
                >
                  ← Back to Email
                </button>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={countdown > 0 || isSubmitting}
                  className="text-rose-400 hover:text-rose-300 transition-colors disabled:text-white/30 cursor-pointer"
                >
                  {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
                </button>
              </div>
            </motion.form>
          )}

          {loginStep === 'pin' && (
            <motion.form
              key="step-pin"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handlePinSubmit}
              className="space-y-6"
            >
              <div className="flex justify-center items-center gap-3">
                {pinDigits.map((digit, index) => (
                  <input
                    key={index}
                    type="password"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/\D/g, '');
                      const next = [...pinDigits];
                      next[index] = clean;
                      setPinDigits(next);
                      if (clean && index < 3) {
                        (document.getElementById(`login-pin-${index + 1}`) as HTMLInputElement)?.focus();
                      }
                    }}
                    id={`login-pin-${index}`}
                    className="w-14 h-16 sm:w-16 sm:h-18 text-center text-3xl font-bold font-mono text-white bg-black/60 border border-white/20 focus:border-rose-500 focus:bg-rose-500/[0.08] rounded-2xl outline-none transition-all shadow-inner"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || pinDigits.join('').length !== 4}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 text-white font-body font-black text-xs uppercase tracking-[0.18em] shadow-2xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Authorizing Session...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Enter Studio</span>
                  </>
                )}
              </button>

              <div className="text-center text-xs text-white/50 pt-1">
                <button
                  type="button"
                  onClick={() => setLoginStep('otp')}
                  className="text-white/60 hover:text-white transition-colors underline underline-offset-4 cursor-pointer"
                >
                  ← Back to OTP
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
