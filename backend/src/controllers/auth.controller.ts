import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import {
  findUserByEmail,
  findUserById,
  createOrUpdateSignupUser,
  updateUserOtp,
  verifyUserWithOtp,
  verifyPassword,
  findOrCreateGoogleUser,
  generateUserToken,
  JWT_EXPIRES_SECONDS,
} from '../services/user.service';
import { sendVerificationOtpEmail } from '../services/email.service';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

const JWT_SECRET = process.env.JWT_SECRET || 'makeawish_jwt_secret_key_72hrs_timeout_2026_super_secure';
const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || '1622';

/**
 * Generate 6-digit OTP
 */
const generateOtpCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Parse Google ID Token (JWT) payload
 */
const parseGoogleCredential = (credential: string): { email?: string; name?: string; picture?: string; sub?: string } => {
  try {
    const parts = credential.split('.');
    if (parts.length < 2) return {};
    const payloadJson = Buffer.from(parts[1], 'base64').toString('utf8');
    return JSON.parse(payloadJson);
  } catch (err) {
    console.error('[Google Credential Parse Error]:', err);
    return {};
  }
};

/**
 * POST /api/auth/signup
 */
export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required.' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters long.' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ error: 'Please provide a valid email address.' });
      return;
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser && existingUser.is_verified) {
      res.status(409).json({ error: 'An account with this email already exists. Please sign in.' });
      return;
    }

    const otpCode = generateOtpCode();
    const user = await createOrUpdateSignupUser(name || 'Dreamer', email, password, otpCode);

    // Send email with OTP via Resend
    const emailResult = await sendVerificationOtpEmail(email, otpCode, user.name);

    res.status(200).json({
      success: true,
      message: emailResult.isMock
        ? 'Verification code generated! (Dev mode: check server logs)'
        : 'A 6-digit verification code has been sent to your email.',
      email: user.email,
      isMock: emailResult.isMock,
    });
  } catch (error: any) {
    console.error('[Auth Signup Error]:', error);
    res.status(500).json({ error: 'Failed to process signup. Please try again.' });
  }
};

/**
 * POST /api/auth/verify-otp
 */
export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      res.status(400).json({ error: 'Email and 6-digit OTP code are required.' });
      return;
    }

    const result = await verifyUserWithOtp(email, otp);

    if (!result.success || !result.user) {
      res.status(400).json({ error: result.message });
      return;
    }

    // Generate 72-hour JWT
    const token = generateUserToken(result.user);

    res.status(200).json({
      success: true,
      message: 'Account verified successfully!',
      token,
      expiresIn: JWT_EXPIRES_SECONDS,
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        avatar: result.user.avatar,
      },
    });
  } catch (error: any) {
    console.error('[Auth Verify OTP Error]:', error);
    res.status(500).json({ error: 'Failed to verify code. Please try again.' });
  }
};

/**
 * POST /api/auth/resend-otp
 */
export const resendOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ error: 'Email is required.' });
      return;
    }

    const user = await findUserByEmail(email);
    if (!user) {
      res.status(404).json({ error: 'No account found with this email. Please sign up first.' });
      return;
    }

    const otpCode = generateOtpCode();
    await updateUserOtp(email, otpCode);

    const emailResult = await sendVerificationOtpEmail(email, otpCode, user.name);

    res.status(200).json({
      success: true,
      message: 'A fresh 6-digit verification code has been sent.',
      email: user.email,
      isMock: emailResult.isMock,
    });
  } catch (error: any) {
    console.error('[Auth Resend OTP Error]:', error);
    res.status(500).json({ error: 'Failed to resend verification code.' });
  }
};

/**
 * POST /api/auth/login
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required.' });
      return;
    }

    const user = await findUserByEmail(email);
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    const isMatch = await verifyPassword(password, user.password_hash);
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    // Check if account is verified
    if (!user.is_verified) {
      const otpCode = generateOtpCode();
      await updateUserOtp(email, otpCode);
      await sendVerificationOtpEmail(email, otpCode, user.name);

      res.status(403).json({
        error: 'Your account is not verified. We sent a new 6-digit verification code to your email.',
        needsOtpVerification: true,
        email: user.email,
      });
      return;
    }

    // Generate 72-hour JWT
    const token = generateUserToken(user);

    res.status(200).json({
      success: true,
      token,
      expiresIn: JWT_EXPIRES_SECONDS,
      rememberMe: !!rememberMe,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      },
    });
  } catch (error: any) {
    console.error('[Auth Login Error]:', error);
    res.status(500).json({ error: 'Failed to sign in. Please try again.' });
  }
};

/**
 * POST /api/auth/google
 */
export const googleAuth = async (req: Request, res: Response): Promise<void> => {
  try {
    const { credential, email, name, picture, sub } = req.body;

    let googleUserEmail = email;
    let googleUserName = name;
    let googleUserPicture = picture;
    let googleUserId = sub;

    if (credential) {
      const parsed = parseGoogleCredential(credential);
      if (parsed.email) googleUserEmail = parsed.email;
      if (parsed.name) googleUserName = parsed.name;
      if (parsed.picture) googleUserPicture = parsed.picture;
      if (parsed.sub) googleUserId = parsed.sub;
    }

    if (!googleUserEmail) {
      res.status(400).json({ error: 'Unable to extract Google account information.' });
      return;
    }

    const user = await findOrCreateGoogleUser({
      email: googleUserEmail,
      name: googleUserName || 'Google Explorer',
      picture: googleUserPicture,
      google_id: googleUserId,
    });

    // Issue 72-hour JWT
    const token = generateUserToken(user);

    res.status(200).json({
      success: true,
      token,
      expiresIn: JWT_EXPIRES_SECONDS,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      },
    });
  } catch (error: any) {
    console.error('[Auth Google Error]:', error);
    res.status(500).json({ error: 'Google authentication failed.' });
  }
};

/**
 * GET /api/auth/me (Protected)
 */
export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const user = await findUserById(req.user.id);
    if (!user) {
      // Fallback to token decoded data
      res.status(200).json({
        success: true,
        user: {
          id: req.user.id,
          email: req.user.email,
          name: req.user.name || 'Dreamer',
          avatar: req.user.avatar || '',
        },
      });
      return;
    }

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      },
    });
  } catch (error: any) {
    console.error('[Auth Me Error]:', error);
    res.status(500).json({ error: 'Failed to retrieve user profile.' });
  }
};

/**
 * POST /api/auth/verify-admin-passcode
 * Verifies Master Admin Passcode '1622' and issues a Super Admin token
 */
export const verifyAdminPasscode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { passcode } = req.body;

    if (!passcode) {
      res.status(400).json({ error: 'Passcode is required.' });
      return;
    }

    if (passcode.toString().trim() === ADMIN_PASSCODE || passcode.toString().trim() === '1622') {
      const adminToken = jwt.sign(
        {
          id: 'super_admin_master',
          email: 'admin@makeawish.app',
          name: 'Master Admin',
          role: 'super_admin',
        },
        JWT_SECRET,
        { expiresIn: '72h' }
      );

      res.status(200).json({
        success: true,
        adminToken,
        role: 'super_admin',
        message: 'Admin console unlocked successfully.',
      });
    } else {
      res.status(401).json({ error: 'Incorrect passcode. Access to admin console denied.' });
    }
  } catch (error: any) {
    console.error('[Admin Passcode Error]:', error);
    res.status(500).json({ error: 'Failed to verify admin passcode.' });
  }
};

/**
 * POST /api/auth/admin-request-otp
 * Admin authentication Step 1: Validates passcode 1622 and dispatches OTP email
 */
export const adminRequestOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { passcode, email } = req.body;

    if (!passcode || (passcode.toString().trim() !== ADMIN_PASSCODE && passcode.toString().trim() !== '1622')) {
      res.status(401).json({ error: 'Invalid master security passcode.' });
      return;
    }

    if (!email) {
      res.status(400).json({ error: 'Admin email address is required.' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ error: 'Please enter a valid admin email address.' });
      return;
    }

    const otpCode = generateOtpCode();
    await updateUserOtp(email, otpCode);

    // If user does not exist in store, create unverified admin record
    const existing = await findUserByEmail(email);
    if (!existing) {
      await createOrUpdateSignupUser('Master Admin', email, 'admin_pass_protected_2026', otpCode);
    }

    const emailResult = await sendVerificationOtpEmail(email, otpCode, 'Master Administrator');

    res.status(200).json({
      success: true,
      message: emailResult.isMock
        ? 'Admin verification code generated! (Dev mode: check server logs)'
        : `Admin verification code sent to ${email}`,
      email,
      isMock: emailResult.isMock,
    });
  } catch (error: any) {
    console.error('[Admin Request OTP Error]:', error);
    res.status(500).json({ error: 'Failed to dispatch admin verification code.' });
  }
};

/**
 * POST /api/auth/admin-verify-otp
 * Admin authentication Step 2: Validates passcode 1622 + OTP code and grants 72h Super Admin JWT
 */
export const adminVerifyOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { passcode, email, otp } = req.body;

    if (!passcode || (passcode.toString().trim() !== ADMIN_PASSCODE && passcode.toString().trim() !== '1622')) {
      res.status(401).json({ error: 'Invalid master security passcode.' });
      return;
    }

    if (!email || !otp) {
      res.status(400).json({ error: 'Admin email and 6-digit OTP code are required.' });
      return;
    }

    const result = await verifyUserWithOtp(email, otp);
    if (!result.success || !result.user) {
      res.status(400).json({ error: result.message });
      return;
    }

    // Generate 72-Hour Super Admin JWT
    const token = jwt.sign(
      {
        id: result.user.id || 'super_admin_master',
        email: result.user.email,
        name: result.user.name || 'Master Admin',
        avatar: result.user.avatar || '',
        role: 'super_admin',
      },
      JWT_SECRET,
      { expiresIn: '72h' }
    );

    res.status(200).json({
      success: true,
      message: 'Admin console verified and unlocked successfully!',
      token,
      expiresIn: JWT_EXPIRES_SECONDS,
      role: 'super_admin',
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name || 'Master Admin',
        avatar: result.user.avatar,
        role: 'super_admin',
      },
    });
  } catch (error: any) {
    console.error('[Admin Verify OTP Error]:', error);
    res.status(500).json({ error: 'Failed to verify admin authorization code.' });
  }
};


