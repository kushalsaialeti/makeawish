import { Router } from 'express';
import {
  signup,
  verifyOtp,
  resendOtp,
  login,
  googleAuth,
  getMe,
  verifyAdminPasscode,
  adminRequestOtp,
  adminVerifyOtp,
} from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Public Authentication Endpoints
router.post('/signup', signup);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
router.post('/login', login);
router.post('/google', googleAuth);

// Admin Passcode & OTP Security Gate (Passcode 1622 + Admin Email Verification)
router.post('/verify-admin-passcode', verifyAdminPasscode);
router.post('/admin-request-otp', adminRequestOtp);
router.post('/admin-verify-otp', adminVerifyOtp);

// Protected Authentication Endpoints
router.get('/me', authMiddleware, getMe);

export default router;
