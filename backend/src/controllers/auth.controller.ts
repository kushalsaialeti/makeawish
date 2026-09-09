import { Request, Response } from 'express';
import {
  findUserByEmail,
  findUserById,
  createOrUpdateSignupUser,
  updateUserOtp,
  verifyUserWithOtp,
  verifyPassword,
  verifySecurityPin,
  setSecurityPin,
  findOrCreateGoogleUser,
  generateUserToken,
  ensureUserWishesLinked,
  JWT_EXPIRES_SECONDS,
} from '../services/user.service';
import { sendVerificationOtpEmail } from '../services/email.service';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

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
 * Step 1 of registration: Collects details, 4-digit PIN, and dispatches real-time Email OTP
 */
export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, pin } = req.body;

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

    if (pin && !/^\d{4}$/.test(pin.toString().trim())) {
      res.status(400).json({ error: 'Security PIN must be exactly 4 numeric digits.' });
      return;
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser && existingUser.is_verified) {
      res.status(409).json({ error: 'An account with this email already exists. Please sign in.' });
      return;
    }

    const otpCode = generateOtpCode();
    const user = await createOrUpdateSignupUser(
      name || 'Dreamer',
      email,
      password,
      otpCode,
      pin ? pin.toString().trim() : undefined
    );

    // Send email with OTP via Resend in real time
    const emailResult = await sendVerificationOtpEmail(email, otpCode, user.name);

    res.status(200).json({
      success: true,
      message: emailResult.message,
      email: user.email,
      isMock: emailResult.isMock,
      isSandboxRestricted: emailResult.isSandboxRestricted,
      devOtp: (emailResult.isSandboxRestricted || emailResult.isMock) ? otpCode : undefined,
    });
  } catch (error: any) {
    console.error('[Auth Signup Error]:', error);
    res.status(500).json({ error: 'Failed to process signup. Please try again.' });
  }
};

/**
 * POST /api/auth/login
 * Step 1 of login: Validates email + password and dispatches real-time OTP via Resend
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required.' });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    let user = await findUserByEmail(normalizedEmail);

    // Auto-provision initial account for kushalsaialeti98@gmail.com if logging in first time
    if (!user && normalizedEmail === 'kushalsaialeti98@gmail.com') {
      const initialOtp = generateOtpCode();
      user = await createOrUpdateSignupUser(
        'Kushal Sai',
        normalizedEmail,
        password,
        initialOtp,
        '1622'
      );
    }

    if (!user) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    const isMatch = await verifyPassword(password, user.password_hash);
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    // Generate fresh OTP code and dispatch email in real time
    const otpCode = generateOtpCode();
    await updateUserOtp(normalizedEmail, otpCode);
    const emailResult = await sendVerificationOtpEmail(normalizedEmail, otpCode, user.name);

    res.status(200).json({
      success: true,
      step: 'otp_required',
      email: user.email,
      message: emailResult.message,
      isMock: emailResult.isMock,
      isSandboxRestricted: emailResult.isSandboxRestricted,
      devOtp: (emailResult.isSandboxRestricted || emailResult.isMock) ? otpCode : undefined,
    });
  } catch (error: any) {
    console.error('[Auth Login Step 1 Error]:', error);
    res.status(500).json({ error: 'Failed to process sign in. Please try again.' });
  }
};

/**
 * POST /api/auth/verify-login-otp
 * Step 2 of login: Validates 6-digit Email OTP and moves to 4-digit PIN step
 */
export const verifyLoginOtp = async (req: Request, res: Response): Promise<void> => {
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

    res.status(200).json({
      success: true,
      step: 'pin_required',
      email: result.user.email,
      message: 'OTP verified successfully. Please enter your 4-digit Security PIN.',
    });
  } catch (error: any) {
    console.error('[Auth Verify Login OTP Error]:', error);
    res.status(500).json({ error: 'Failed to verify OTP code.' });
  }
};

/**
 * POST /api/auth/verify-security-pin
 * Step 3 of login: Validates 4-digit Security PIN and issues 36-hour JWT
 */
export const verifySecurityPinHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, pin, rememberMe } = req.body;

    if (!email || !pin) {
      res.status(400).json({ error: 'Email and 4-digit PIN are required.' });
      return;
    }

    const cleanPin = pin.toString().trim();
    if (!/^\d{4}$/.test(cleanPin)) {
      res.status(400).json({ error: 'Security PIN must be exactly 4 digits.' });
      return;
    }

    const user = await findUserByEmail(email);
    if (!user) {
      res.status(404).json({ error: 'User account not found.' });
      return;
    }

    const isPinValid = await verifySecurityPin(cleanPin, user.security_pin_hash);
    if (!isPinValid) {
      res.status(401).json({ error: 'Incorrect 4-digit Security PIN.' });
      return;
    }

    // If user didn't have PIN hash persisted yet, save it now
    if (!user.security_pin_hash) {
      await setSecurityPin(email, cleanPin);
    }

    // Ensure historical wishes are linked
    await ensureUserWishesLinked(user.id, user.email);

    // Issue 36-hour JWT
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
    console.error('[Auth Verify PIN Error]:', error);
    res.status(500).json({ error: 'Failed to verify Security PIN.' });
  }
};

/**
 * POST /api/auth/verify-otp (Registration confirmation)
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

    // Issue 36-hour JWT
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
      message: emailResult.message,
      email: user.email,
      isMock: emailResult.isMock,
      isSandboxRestricted: emailResult.isSandboxRestricted,
      devOtp: (emailResult.isSandboxRestricted || emailResult.isMock) ? otpCode : undefined,
    });
  } catch (error: any) {
    console.error('[Auth Resend OTP Error]:', error);
    res.status(500).json({ error: 'Failed to resend verification code.' });
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

    // Issue 36-hour JWT
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

    // Ensure historical wishes linked for kushalsaialeti98@gmail.com
    await ensureUserWishesLinked(user.id, user.email);

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
