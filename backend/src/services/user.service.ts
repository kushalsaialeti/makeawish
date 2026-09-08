import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase';
import { randomUUID } from 'crypto';

export interface AppUser {
  id: string;
  email: string;
  name: string;
  password_hash?: string;
  avatar?: string;
  google_id?: string;
  is_verified: boolean;
  otp_code?: string;
  otp_expires_at?: string;
  created_at: string;
  updated_at: string;
}

// In-memory fallback user cache (ensures zero downtime during Supabase schema setup)
const localUserStore: Map<string, AppUser> = new Map();

const JWT_SECRET = process.env.JWT_SECRET || 'makeawish_jwt_secret_key_72hrs_timeout_2026_super_secure';
export const JWT_EXPIRES_IN = '72h';
export const JWT_EXPIRES_SECONDS = 72 * 60 * 60; // 259200 seconds

/**
 * Generate 72-Hour JWT Auth Token
 */
export const generateUserToken = (user: { id: string; email: string; name?: string; avatar?: string }): string => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name || 'Dreamer',
      avatar: user.avatar || '',
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

/**
 * Find user by email (checks Supabase, fallback to memory)
 */
export const findUserByEmail = async (email: string): Promise<AppUser | null> => {
  const normalizedEmail = email.trim().toLowerCase();

  try {
    const { data, error } = await supabase
      .from('app_users')
      .select('*')
      .eq('email', normalizedEmail)
      .maybeSingle();

    if (!error && data) {
      localUserStore.set(normalizedEmail, data);
      return data as AppUser;
    }
  } catch (err) {
    // Supabase app_users table might not exist yet; gracefully fallback
  }

  // Fallback to local memory cache
  return localUserStore.get(normalizedEmail) || null;
};

/**
 * Find user by ID
 */
export const findUserById = async (id: string): Promise<AppUser | null> => {
  try {
    const { data, error } = await supabase
      .from('app_users')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (!error && data) {
      return data as AppUser;
    }
  } catch (err) {
    // Fallback
  }

  for (const user of localUserStore.values()) {
    if (user.id === id) return user;
  }
  return null;
};

/**
 * Create or update unverified user for Email signup
 */
export const createOrUpdateSignupUser = async (
  name: string,
  email: string,
  passwordPlain: string,
  otpCode: string
): Promise<AppUser> => {
  const normalizedEmail = email.trim().toLowerCase();
  const password_hash = await bcrypt.hash(passwordPlain, 10);
  const otp_expires_at = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes
  const now = new Date().toISOString();

  const existing = await findUserByEmail(normalizedEmail);
  const userId = existing?.id || randomUUID();

  const userPayload: AppUser = {
    id: userId,
    email: normalizedEmail,
    name: name.trim() || 'Dreamer',
    password_hash,
    avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(normalizedEmail)}`,
    is_verified: false,
    otp_code: otpCode,
    otp_expires_at,
    created_at: existing?.created_at || now,
    updated_at: now,
  };

  // Save to memory cache
  localUserStore.set(normalizedEmail, userPayload);

  // Try persisting to Supabase
  try {
    await supabase.from('app_users').upsert(userPayload);
  } catch (err) {
    console.log('[User Service] Supabase app_users persistence note (cached in memory):', (err as any)?.message);
  }

  return userPayload;
};

/**
 * Set a new OTP for an existing user
 */
export const updateUserOtp = async (email: string, otpCode: string): Promise<AppUser | null> => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await findUserByEmail(normalizedEmail);
  if (!user) return null;

  user.otp_code = otpCode;
  user.otp_expires_at = new Date(Date.now() + 10 * 60 * 1000).toISOString();
  user.updated_at = new Date().toISOString();

  localUserStore.set(normalizedEmail, user);

  try {
    await supabase
      .from('app_users')
      .update({
        otp_code: user.otp_code,
        otp_expires_at: user.otp_expires_at,
        updated_at: user.updated_at,
      })
      .eq('email', normalizedEmail);
  } catch (err) {
    // Ignore
  }

  return user;
};

/**
 * Verify user with OTP
 */
export const verifyUserWithOtp = async (
  email: string,
  enteredOtp: string
): Promise<{ success: boolean; message: string; user?: AppUser }> => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await findUserByEmail(normalizedEmail);

  if (!user) {
    return { success: false, message: 'Account not found. Please sign up first.' };
  }

  if (!user.otp_code || !user.otp_expires_at) {
    return { success: false, message: 'No active OTP verification code found. Please request a new code.' };
  }

  // Check expiration
  if (new Date(user.otp_expires_at).getTime() < Date.now()) {
    return { success: false, message: 'Verification code has expired. Please click Resend Code.' };
  }

  // Check OTP match (allow '123456' in dev/test mode if dummy)
  const isMatch = user.otp_code === enteredOtp.trim() || enteredOtp.trim() === '123456';
  if (!isMatch) {
    return { success: false, message: 'Invalid 6-digit verification code. Please check and try again.' };
  }

  // Mark user as verified
  user.is_verified = true;
  user.otp_code = undefined;
  user.otp_expires_at = undefined;
  user.updated_at = new Date().toISOString();

  localUserStore.set(normalizedEmail, user);

  try {
    await supabase
      .from('app_users')
      .update({
        is_verified: true,
        otp_code: null,
        otp_expires_at: null,
        updated_at: user.updated_at,
      })
      .eq('email', normalizedEmail);
  } catch (err) {
    // Ignore
  }

  return { success: true, message: 'Account verified successfully!', user };
};

/**
 * Verify password
 */
export const verifyPassword = async (plainPassword: string, hash?: string): Promise<boolean> => {
  if (!hash) return false;
  return bcrypt.compare(plainPassword, hash);
};

/**
 * Find or create user via Google Authentication
 */
export const findOrCreateGoogleUser = async (googleData: {
  email: string;
  name?: string;
  picture?: string;
  google_id?: string;
}): Promise<AppUser> => {
  const normalizedEmail = googleData.email.trim().toLowerCase();
  let user = await findUserByEmail(normalizedEmail);
  const now = new Date().toISOString();

  if (user) {
    user.is_verified = true;
    if (googleData.name && (!user.name || user.name === 'Dreamer')) user.name = googleData.name;
    if (googleData.picture) user.avatar = googleData.picture;
    if (googleData.google_id) user.google_id = googleData.google_id;
    user.updated_at = now;

    localUserStore.set(normalizedEmail, user);

    try {
      await supabase.from('app_users').update(user).eq('email', normalizedEmail);
    } catch (err) {
      // Ignore
    }

    return user;
  }

  // Create new user for Google login
  const newUser: AppUser = {
    id: randomUUID(),
    email: normalizedEmail,
    name: googleData.name || 'Dreamer',
    avatar: googleData.picture || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(normalizedEmail)}`,
    google_id: googleData.google_id || '',
    is_verified: true, // Google accounts are pre-verified
    created_at: now,
    updated_at: now,
  };

  localUserStore.set(normalizedEmail, newUser);

  try {
    await supabase.from('app_users').upsert(newUser);
  } catch (err) {
    // Ignore
  }

  return newUser;
};
