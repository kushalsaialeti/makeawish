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

const JWT_SECRET = process.env.JWT_SECRET || 'makeawish_jwt_secret_key_36hrs_timeout_2026_super_secure';
export const JWT_EXPIRES_IN = '36h';
export const JWT_EXPIRES_SECONDS = 36 * 60 * 60; // 129600 seconds (36 Hours)

/**
 * Generate 36-Hour JWT Auth Token
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
 * Retrieve or create valid Supabase Auth User ID to guarantee PostgreSQL FK integrity
 */
export const getOrCreateSupabaseAuthId = async (email: string, name?: string): Promise<string> => {
  const normEmail = email.trim().toLowerCase();
  try {
    const { data: listData } = await supabase.auth.admin.listUsers();
    const existing = listData?.users?.find(u => u.email === normEmail);
    if (existing) {
      return existing.id;
    }
    const { data: newUser } = await supabase.auth.admin.createUser({
      email: normEmail,
      email_confirm: true,
      user_metadata: { name: name || 'Dreamer' }
    });
    if (newUser?.user?.id) {
      return newUser.user.id;
    }
  } catch (err: any) {
    console.warn('[User Service] Supabase Auth ID note:', err.message);
  }
  return randomUUID();
};

/**
 * Links puppy and luckyyyy-thallii wishes to kushalsaialeti98@gmail.com's userId in Supabase
 */
export const ensureUserWishesLinked = async (userId: string, email: string): Promise<void> => {
  const normEmail = (email || '').trim().toLowerCase();
  if (normEmail === 'kushalsaialeti98@gmail.com') {
    try {
      console.log(`[User Service] Linking historical wishes (luckyyyy-thallii, puppy) to ${normEmail} (ID: ${userId})`);
      await supabase
        .from('wishes')
        .update({ user_id: userId })
        .in('slug', ['luckyyyy-thallii', 'puppy', 'lucky-thalli']);
    } catch (err: any) {
      console.error('[User Service] Error linking historical wishes:', err.message);
    }
  }
};

/**
 * Find user by email (checks local cache and Supabase Auth admin)
 */
export const findUserByEmail = async (email: string): Promise<AppUser | null> => {
  const normalizedEmail = email.trim().toLowerCase();

  // 1. Check local in-memory cache first
  const cached = localUserStore.get(normalizedEmail);
  if (cached && cached.otp_code) {
    return cached;
  }

  // 2. Query Supabase Auth admin (persistent store)
  try {
    const { data: listData, error } = await supabase.auth.admin.listUsers();
    if (!error && listData?.users) {
      const authUser = listData.users.find(u => u.email?.toLowerCase() === normalizedEmail);
      if (authUser) {
        const meta = authUser.user_metadata || {};
        const appUser: AppUser = {
          id: authUser.id,
          email: normalizedEmail,
          name: meta.name || 'Dreamer',
          password_hash: meta.password_hash,
          avatar: meta.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(normalizedEmail)}`,
          is_verified: Boolean(meta.is_verified ?? authUser.email_confirmed_at),
          otp_code: cached?.otp_code || meta.otp_code,
          otp_expires_at: cached?.otp_expires_at || meta.otp_expires_at,
          created_at: authUser.created_at,
          updated_at: authUser.updated_at || new Date().toISOString(),
        };

        localUserStore.set(normalizedEmail, appUser);
        return appUser;
      }
    }
  } catch (err: any) {
    console.warn('[User Service] Supabase Auth lookup note:', err.message);
  }

  return cached || null;
};

/**
 * Find user by ID
 */
export const findUserById = async (id: string): Promise<AppUser | null> => {
  for (const user of localUserStore.values()) {
    if (user.id === id) return user;
  }

  try {
    const { data, error } = await supabase.auth.admin.getUserById(id);
    if (!error && data?.user) {
      const authUser = data.user;
      const meta = authUser.user_metadata || {};
      const normalizedEmail = (authUser.email || '').toLowerCase();
      const appUser: AppUser = {
        id: authUser.id,
        email: normalizedEmail,
        name: meta.name || 'Dreamer',
        password_hash: meta.password_hash,
        avatar: meta.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(normalizedEmail)}`,
        is_verified: Boolean(meta.is_verified ?? authUser.email_confirmed_at),
        otp_code: meta.otp_code,
        otp_expires_at: meta.otp_expires_at,
        created_at: authUser.created_at,
        updated_at: authUser.updated_at || new Date().toISOString(),
      };

      if (normalizedEmail) {
        localUserStore.set(normalizedEmail, appUser);
      }
      return appUser;
    }
  } catch (err) {
    // Ignore
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

  const userId = await getOrCreateSupabaseAuthId(normalizedEmail, name);

  const userPayload: AppUser = {
    id: userId,
    email: normalizedEmail,
    name: name.trim() || 'Dreamer',
    password_hash,
    avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(normalizedEmail)}`,
    is_verified: false,
    otp_code: otpCode,
    otp_expires_at,
    created_at: now,
    updated_at: now,
  };

  // 1. Save to memory cache
  localUserStore.set(normalizedEmail, userPayload);

  // 2. Persist directly to Supabase Auth admin user_metadata
  try {
    await supabase.auth.admin.updateUserById(userId, {
      user_metadata: {
        name: userPayload.name,
        password_hash,
        avatar: userPayload.avatar,
        is_verified: false,
        otp_code: otpCode,
        otp_expires_at,
        updated_at: now,
      }
    });
  } catch (err: any) {
    console.warn('[User Service] Supabase Auth metadata persistence note:', err.message);
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
    await supabase.auth.admin.updateUserById(user.id, {
      user_metadata: {
        name: user.name,
        password_hash: user.password_hash,
        avatar: user.avatar,
        is_verified: user.is_verified,
        otp_code: user.otp_code,
        otp_expires_at: user.otp_expires_at,
        updated_at: user.updated_at,
      }
    });
  } catch (err: any) {
    console.warn('[User Service] Supabase Auth OTP update note:', err.message);
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

  // Check OTP match
  const isMatch = user.otp_code === enteredOtp.trim();
  if (!isMatch) {
    return { success: false, message: 'Invalid 6-digit verification code. Please check your email and try again.' };
  }

  // Mark user as verified
  user.is_verified = true;
  user.otp_code = undefined;
  user.otp_expires_at = undefined;
  user.updated_at = new Date().toISOString();

  localUserStore.set(normalizedEmail, user);

  // Link historical wishes if this is kushalsaialeti98@gmail.com
  await ensureUserWishesLinked(user.id, normalizedEmail);

  try {
    await supabase.auth.admin.updateUserById(user.id, {
      user_metadata: {
        name: user.name,
        password_hash: user.password_hash,
        avatar: user.avatar,
        is_verified: true,
        otp_code: null,
        otp_expires_at: null,
        updated_at: user.updated_at,
      }
    });
  } catch (err: any) {
    console.warn('[User Service] Supabase Auth verify update note:', err.message);
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
 * Update user password (for password reset)
 */
export const updateUserPassword = async (email: string, newPasswordPlain: string): Promise<AppUser | null> => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await findUserByEmail(normalizedEmail);
  if (!user) return null;

  const password_hash = await bcrypt.hash(newPasswordPlain, 10);
  const now = new Date().toISOString();

  user.password_hash = password_hash;
  user.otp_code = undefined;
  user.otp_expires_at = undefined;
  user.is_verified = true;
  user.updated_at = now;

  localUserStore.set(normalizedEmail, user);

  // Link historical wishes if this is kushalsaialeti98@gmail.com
  await ensureUserWishesLinked(user.id, normalizedEmail);

  try {
    await supabase.auth.admin.updateUserById(user.id, {
      password: newPasswordPlain,
      user_metadata: {
        name: user.name,
        password_hash,
        avatar: user.avatar,
        is_verified: true,
        otp_code: null,
        otp_expires_at: null,
        updated_at: now,
      }
    });
  } catch (err: any) {
    console.warn('[User Service] Supabase Auth password update note:', err.message);
  }

  return user;
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

    await ensureUserWishesLinked(user.id, normalizedEmail);

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
    is_verified: true,
    created_at: now,
    updated_at: now,
  };

  localUserStore.set(normalizedEmail, newUser);
  await ensureUserWishesLinked(newUser.id, normalizedEmail);

  try {
    await supabase.from('app_users').upsert(newUser);
  } catch (err) {
    // Ignore
  }

  return newUser;
};
