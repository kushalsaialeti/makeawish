import { Router } from 'express';
import {
  signup,
  verifyOtp,
  resendOtp,
  login,
  verifyLoginOtp,
  forgotPassword,
  resetPassword,
  googleAuth,
  getMe,
} from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Registration Endpoints
router.post('/signup', signup);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);

// 2-Step OTP-Based Authentication Login Endpoints
router.post('/login', login);                                 // Step 1: Email + Password -> Sends Email OTP
router.post('/verify-login-otp', verifyLoginOtp);             // Step 2: Email + 6-digit OTP -> Issues 36h JWT

// Password Reset Flow Endpoints
router.post('/forgot-password', forgotPassword);              // Step 1: Request 6-digit OTP for password reset
router.post('/reset-password', resetPassword);                // Step 2: Verify OTP + set new password

// Google OAuth
router.post('/google', googleAuth);

// Protected User Profile
router.get('/me', authMiddleware, getMe);

export default router;
