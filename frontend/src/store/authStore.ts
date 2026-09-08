import { create } from 'zustand';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role?: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  adminToken: string | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  pendingEmailForOtp: string | null;
  rememberMe: boolean;

  // Actions
  initialize: () => Promise<void>;
  setRememberMe: (remember: boolean) => void;
  setPendingEmailForOtp: (email: string | null) => void;
  clearError: () => void;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; needsOtpVerification?: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string; isMock?: boolean; error?: string }>;
  verifyOtp: (email: string, otp: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  resendOtp: (email: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  googleLogin: (payload: { credential?: string; email?: string; name?: string; picture?: string; sub?: string }, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  verifyAdminPasscode: (passcode: string) => Promise<{ success: boolean; error?: string }>;
  adminRequestOtp: (passcode: string, email: string) => Promise<{ success: boolean; message?: string; isMock?: boolean; error?: string }>;
  adminVerifyOtp: (passcode: string, email: string, otp: string) => Promise<{ success: boolean; error?: string }>;
  exitAdminMode: () => void;
  claimWish: (wishId: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  getToken: () => string | null;
}

const TOKEN_KEY = 'makeawish_auth_token';
const USER_KEY = 'makeawish_auth_user';
const ADMIN_TOKEN_KEY = 'makeawish_admin_token';

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  adminToken: null,
  isAdmin: false,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  pendingEmailForOtp: null,
  rememberMe: true,

  setRememberMe: (rememberMe: boolean) => set({ rememberMe }),
  setPendingEmailForOtp: (pendingEmailForOtp: string | null) => set({ pendingEmailForOtp }),
  clearError: () => set({ error: null }),

  initialize: async () => {
    try {
      set({ isLoading: true });

      // Check admin token in sessionStorage
      const savedAdminToken = sessionStorage.getItem(ADMIN_TOKEN_KEY);
      if (savedAdminToken) {
        set({ adminToken: savedAdminToken, isAdmin: true });
      }

      // Look in localStorage first, then sessionStorage
      const token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
      const savedUserJson = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);

      if (!token) {
        // If no regular user token but admin token exists
        if (savedAdminToken) {
          set({
            user: { id: 'super_admin_master', email: 'admin@makeawish.app', name: 'Master Admin', role: 'super_admin' },
            token: savedAdminToken,
            isAuthenticated: true,
            isAdmin: true,
            isLoading: false,
          });
          return;
        }

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

  verifyAdminPasscode: async (passcode: string) => {
    try {
      set({ isLoading: true, error: null });

      const res = await fetch(`${API_BASE}/auth/verify-admin-passcode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: passcode.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        set({ error: data.error || 'Incorrect passcode', isLoading: false });
        return { success: false, error: data.error || 'Incorrect passcode' };
      }

      const { adminToken } = data;
      sessionStorage.setItem(ADMIN_TOKEN_KEY, adminToken);

      set({
        adminToken,
        isAdmin: true,
        isAuthenticated: true,
        user: get().user || {
          id: 'super_admin_master',
          email: 'admin@makeawish.app',
          name: 'Master Admin',
          role: 'super_admin',
        },
        isLoading: false,
        error: null,
      });

      return { success: true };
    } catch (err: any) {
      const msg = err.message || 'Passcode verification failed';
      set({ error: msg, isLoading: false });
      return { success: false, error: msg };
    }
  },

  adminRequestOtp: async (passcode: string, email: string) => {
    try {
      set({ isLoading: true, error: null });

      const res = await fetch(`${API_BASE}/auth/admin-request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: passcode.trim(), email: email.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        set({ error: data.error || 'Failed to dispatch admin verification code', isLoading: false });
        return { success: false, error: data.error || 'Failed to dispatch admin verification code' };
      }

      set({ isLoading: false, error: null, pendingEmailForOtp: email });
      return { success: true, message: data.message, isMock: data.isMock };
    } catch (err: any) {
      const msg = err.message || 'Connection error';
      set({ error: msg, isLoading: false });
      return { success: false, error: msg };
    }
  },

  adminVerifyOtp: async (passcode: string, email: string, otp: string) => {
    try {
      set({ isLoading: true, error: null });

      const res = await fetch(`${API_BASE}/auth/admin-verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: passcode.trim(), email: email.trim(), otp: otp.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        set({ error: data.error || 'Admin verification failed', isLoading: false });
        return { success: false, error: data.error || 'Admin verification failed' };
      }

      const { token, user } = data;
      sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));

      set({
        adminToken: token,
        token,
        user,
        isAdmin: true,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        pendingEmailForOtp: null,
      });

      return { success: true };
    } catch (err: any) {
      const msg = err.message || 'Verification failed';
      set({ error: msg, isLoading: false });
      return { success: false, error: msg };
    }
  },

  exitAdminMode: () => {
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    set({ adminToken: null, isAdmin: false });
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

  login: async (email, password, remember = true) => {
    try {
      set({ isLoading: true, error: null });

      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe: remember }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.needsOtpVerification) {
          set({
            pendingEmailForOtp: data.email || email,
            isLoading: false,
            error: data.error,
          });
          return { success: false, needsOtpVerification: true, error: data.error };
        }

        set({ error: data.error || 'Failed to sign in', isLoading: false });
        return { success: false, error: data.error || 'Failed to sign in' };
      }

      const { token, user } = data;

      // Save token according to rememberMe preference
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
        isLoading: false,
        error: null,
        pendingEmailForOtp: null,
      });

      return { success: true };
    } catch (err: any) {
      const msg = err.message || 'Connection to auth server failed';
      set({ error: msg, isLoading: false });
      return { success: false, error: msg };
    }
  },

  signup: async (name, email, password) => {
    try {
      set({ isLoading: true, error: null });

      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        set({ error: data.error || 'Failed to sign up', isLoading: false });
        return { success: false, error: data.error || 'Failed to sign up' };
      }

      set({
        pendingEmailForOtp: email,
        isLoading: false,
        error: null,
      });

      return {
        success: true,
        message: data.message,
        isMock: data.isMock,
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
        body: JSON.stringify({ email, otp }),
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
        isLoading: false,
        error: null,
        pendingEmailForOtp: null,
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
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to resend code' };
      }

      return { success: true, message: data.message };
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

  signOut: async () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);

    set({
      user: null,
      token: null,
      adminToken: null,
      isAdmin: false,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      pendingEmailForOtp: null,
    });
  },

  getToken: () => {
    const { isAdmin, adminToken, token } = get();
    if (isAdmin && adminToken) return adminToken;
    if (token) return token;
    return (
      sessionStorage.getItem(ADMIN_TOKEN_KEY) ||
      localStorage.getItem(TOKEN_KEY) ||
      sessionStorage.getItem(TOKEN_KEY)
    );
  },
}));
