import { create } from 'zustand';
import { API_BASE } from '../config/api';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  loginStep: 'credentials' | 'otp' | 'pin';
  pendingEmail: string | null;
  rememberMe: boolean;
  isSandboxRestricted?: boolean;
  devOtp?: string;
  otpNotice?: string | null;

  // Actions
  initialize: () => Promise<void>;
  setRememberMe: (remember: boolean) => void;
  setLoginStep: (step: 'credentials' | 'otp' | 'pin') => void;
  setPendingEmail: (email: string | null) => void;
  setDevOtp: (otp?: string) => void;
  clearError: () => void;
  login: (email: string, password: string) => Promise<{ success: boolean; step?: string; error?: string; isSandboxRestricted?: boolean; devOtp?: string; message?: string }>;
  verifyLoginOtp: (email: string, otp: string) => Promise<{ success: boolean; step?: string; error?: string }>;
  verifySecurityPin: (email: string, pin: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string, pin?: string) => Promise<{ success: boolean; message?: string; isMock?: boolean; isSandboxRestricted?: boolean; devOtp?: string; error?: string }>;
  verifyOtp: (email: string, otp: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  resendOtp: (email: string) => Promise<{ success: boolean; message?: string; error?: string; isSandboxRestricted?: boolean; devOtp?: string }>;
  googleLogin: (payload: { credential?: string; email?: string; name?: string; picture?: string; sub?: string }, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  claimWish: (wishId: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  getToken: () => string | null;
}

const TOKEN_KEY = 'makeawish_auth_token';
const USER_KEY = 'makeawish_auth_user';

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  loginStep: 'credentials',
  pendingEmail: null,
  rememberMe: true,
  isSandboxRestricted: false,
  devOtp: undefined,
  otpNotice: null,

  setRememberMe: (rememberMe: boolean) => set({ rememberMe }),
  setLoginStep: (loginStep: 'credentials' | 'otp' | 'pin') => set({ loginStep }),
  setPendingEmail: (pendingEmail: string | null) => set({ pendingEmail }),
  setDevOtp: (devOtp?: string) => set({ devOtp }),
  clearError: () => set({ error: null, otpNotice: null }),

  initialize: async () => {
    try {
      set({ isLoading: true });

      const token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
      const savedUserJson = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);

      if (!token) {
        set({ user: null, token: null, isAuthenticated: false, isLoading: false });
        return;
      }

      let parsedUser: AuthUser | null = null;
      if (savedUserJson) {
        try {
          parsedUser = JSON.parse(savedUserJson);
        } catch (e) {
          // Ignore
        }
      }

      // Verify token with backend
      try {
        const response = await fetch(`${API_BASE}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          set({
            user: data.user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
          return;
        }
      } catch (networkErr) {
        if (parsedUser) {
          set({
            user: parsedUser,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
          return;
        }
      }

      // If token verification failed, clear storage
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(USER_KEY);

      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    } catch (err) {
      console.error('[Auth Initialize Error]:', err);
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (email, password) => {
    try {
      set({ isLoading: true, error: null });

      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        set({ error: data.error || 'Failed to sign in', isLoading: false });
        return { success: false, error: data.error || 'Failed to sign in' };
      }

      set({
        loginStep: 'otp',
        pendingEmail: data.email || email.trim(),
        isSandboxRestricted: Boolean(data.isSandboxRestricted),
        devOtp: data.devOtp,
        otpNotice: data.message,
        isLoading: false,
        error: null,
      });

      return {
        success: true,
        step: 'otp',
        isSandboxRestricted: data.isSandboxRestricted,
        devOtp: data.devOtp,
        message: data.message,
      };
    } catch (err: any) {
      const msg = err.message || 'Connection to auth server failed';
      set({ error: msg, isLoading: false });
      return { success: false, error: msg };
    }
  },

  verifyLoginOtp: async (email, otp) => {
    try {
      set({ isLoading: true, error: null });

      const res = await fetch(`${API_BASE}/auth/verify-login-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), otp: otp.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        set({ error: data.error || 'Invalid OTP code', isLoading: false });
        return { success: false, error: data.error || 'Invalid OTP code' };
      }

      set({
        loginStep: 'pin',
        isLoading: false,
        error: null,
      });

      return { success: true, step: 'pin' };
    } catch (err: any) {
      const msg = err.message || 'Verification failed';
      set({ error: msg, isLoading: false });
      return { success: false, error: msg };
    }
  },

  verifySecurityPin: async (email, pin, remember = true) => {
    try {
      set({ isLoading: true, error: null });

      const res = await fetch(`${API_BASE}/auth/verify-security-pin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), pin: pin.trim(), rememberMe: remember }),
      });

      const data = await res.json();

      if (!res.ok) {
        set({ error: data.error || 'Incorrect Security PIN', isLoading: false });
        return { success: false, error: data.error || 'Incorrect Security PIN' };
      }

      const { token, user } = data;

      if (remember) {
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        sessionStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(USER_KEY);
      } else {
        sessionStorage.setItem(TOKEN_KEY, token);
        sessionStorage.setItem(USER_KEY, JSON.stringify(user));
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }

      set({
        token,
        user,
        isAuthenticated: true,
        loginStep: 'credentials',
        pendingEmail: null,
        isSandboxRestricted: false,
        devOtp: undefined,
        otpNotice: null,
        isLoading: false,
        error: null,
      });

      return { success: true };
    } catch (err: any) {
      const msg = err.message || 'PIN verification failed';
      set({ error: msg, isLoading: false });
      return { success: false, error: msg };
    }
  },

  signup: async (name, email, password, pin) => {
    try {
      set({ isLoading: true, error: null });

      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email: email.trim(), password, pin: pin ? pin.trim() : undefined }),
      });

      const data = await res.json();

      if (!res.ok) {
        set({ error: data.error || 'Failed to sign up', isLoading: false });
        return { success: false, error: data.error || 'Failed to sign up' };
      }

      set({
        pendingEmail: email.trim(),
        isSandboxRestricted: Boolean(data.isSandboxRestricted),
        devOtp: data.devOtp,
        otpNotice: data.message,
        isLoading: false,
        error: null,
      });

      return {
        success: true,
        message: data.message,
        isMock: data.isMock,
        isSandboxRestricted: data.isSandboxRestricted,
        devOtp: data.devOtp,
      };
    } catch (err: any) {
      const msg = err.message || 'Connection to auth server failed';
      set({ error: msg, isLoading: false });
      return { success: false, error: msg };
    }
  },

  verifyOtp: async (email, otp, remember = true) => {
    try {
      set({ isLoading: true, error: null });

      const res = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), otp: otp.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        set({ error: data.error || 'Invalid verification code', isLoading: false });
        return { success: false, error: data.error || 'Invalid verification code' };
      }

      const { token, user } = data;

      if (remember) {
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      } else {
        sessionStorage.setItem(TOKEN_KEY, token);
        sessionStorage.setItem(USER_KEY, JSON.stringify(user));
      }

      set({
        token,
        user,
        isAuthenticated: true,
        pendingEmail: null,
        isSandboxRestricted: false,
        devOtp: undefined,
        otpNotice: null,
        isLoading: false,
        error: null,
      });

      return { success: true };
    } catch (err: any) {
      const msg = err.message || 'Verification failed';
      set({ error: msg, isLoading: false });
      return { success: false, error: msg };
    }
  },

  resendOtp: async (email) => {
    try {
      const res = await fetch(`${API_BASE}/auth/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to resend code' };
      }

      set({
        isSandboxRestricted: Boolean(data.isSandboxRestricted),
        devOtp: data.devOtp,
        otpNotice: data.message,
      });

      return {
        success: true,
        message: data.message,
        isSandboxRestricted: data.isSandboxRestricted,
        devOtp: data.devOtp,
      };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to resend code' };
    }
  },

  googleLogin: async (payload, remember = true) => {
    try {
      set({ isLoading: true, error: null });

      const res = await fetch(`${API_BASE}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        set({ error: data.error || 'Google sign-in failed', isLoading: false });
        return { success: false, error: data.error || 'Google sign-in failed' };
      }

      const { token, user } = data;

      if (remember) {
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      } else {
        sessionStorage.setItem(TOKEN_KEY, token);
        sessionStorage.setItem(USER_KEY, JSON.stringify(user));
      }

      set({
        token,
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return { success: true };
    } catch (err: any) {
      const msg = err.message || 'Google sign-in error';
      set({ error: msg, isLoading: false });
      return { success: false, error: msg };
    }
  },

  claimWish: async (wishId: string) => {
    try {
      const token = get().getToken();
      const res = await fetch(`${API_BASE}/cms/${wishId}/claim`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to claim wish' };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to claim wish' };
    }
  },

  signOut: async () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);

    set({
      user: null,
      token: null,
      isAuthenticated: false,
      loginStep: 'credentials',
      pendingEmail: null,
      isLoading: false,
      error: null,
    });
  },

  getToken: () => {
    const { token } = get();
    if (token) return token;
    return (
      localStorage.getItem(TOKEN_KEY) ||
      sessionStorage.getItem(TOKEN_KEY)
    );
  },
}));
