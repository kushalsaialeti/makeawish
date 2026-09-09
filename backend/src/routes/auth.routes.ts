import { Router } from 'express';
import {
  signup,
  verifyOtp,
  resendOtp,
  login,
  verifyLoginOtp,
  verifySecurityPinHandler,
  googleAuth,
  getMe,
} from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Registration Endpoints
router.post('/signup', signup);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);

// 3-Step Multi-Factor Authentication Login Endpoints
router.post('/login', login);                                 // Step 1: Email + Password -> Sends Email OTP
router.post('/verify-login-otp', verifyLoginOtp);             // Step 2: Email + 6-digit OTP -> Unlocks PIN step
router.post('/verify-security-pin', verifySecurityPinHandler); // Step 3: Email + 4-digit PIN -> Issues 36h JWT

// Google OAuth
router.post('/google', googleAuth);

// Protected User Profile
router.get('/me', authMiddleware, getMe);

export default router;
