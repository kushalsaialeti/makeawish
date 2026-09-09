import { Router } from 'express';
import { 
  getAllWishes,
  claimWish,
  createWish, 
  getWishBySlug, 
  getWishById, 
  updateWishContent, 
  uploadMedia,
  deleteWish
} from '../controllers/cms.controller';
import { upload } from '../middlewares/upload';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Protected User Wishes Management
router.get('/', authMiddleware, getAllWishes);
router.post('/', authMiddleware, createWish);
router.post('/:id/claim', authMiddleware, claimWish);
router.get('/id/:id', authMiddleware, getWishById);
router.get('/:id', authMiddleware, getWishById);
router.put('/:id', authMiddleware, updateWishContent);
router.delete('/:id', authMiddleware, deleteWish);

// Public Recipient Route (by slug - no login required)
router.get('/slug/:slug', getWishBySlug);

// Media Upload Route
router.post('/upload', authMiddleware, upload.single('file'), uploadMedia);

export default router;
