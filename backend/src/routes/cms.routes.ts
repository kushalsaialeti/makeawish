import { Router } from 'express';
import { 
  getAllWishes, 
  createWish, 
  getWishBySlug, 
  getWishById, 
  updateWishContent, 
  uploadMedia 
} from '../controllers/cms.controller';
import { upload } from '../middlewares/upload';

import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Admin routes
router.get('/', authMiddleware, getAllWishes);
router.post('/', authMiddleware, createWish);
router.get('/id/:id', authMiddleware, getWishById);
router.get('/:id', authMiddleware, getWishById);
router.put('/:id', authMiddleware, updateWishContent);

// User route (by slug)
router.get('/slug/:slug', getWishBySlug);

// Shared route
router.post('/upload', authMiddleware, upload.single('file'), uploadMedia);

export default router;
