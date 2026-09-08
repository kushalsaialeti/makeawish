import { Router } from 'express';
import { 
  getAllWishes,
  getAdminAllWishes,
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

// Master Admin All-Wishes Showcase Endpoint
router.get('/admin/all-wishes', authMiddleware, getAdminAllWishes);

// Wishes CRUD endpoints
router.get('/', authMiddleware, getAllWishes);
router.post('/', authMiddleware, createWish);
router.post('/:id/claim', authMiddleware, claimWish);
router.get('/id/:id', authMiddleware, getWishById);
router.get('/:id', authMiddleware, getWishById);
router.put('/:id', authMiddleware, updateWishContent);
router.delete('/:id', authMiddleware, deleteWish);

// Public User route (by slug)
router.get('/slug/:slug', getWishBySlug);

// Shared media upload route
router.post('/upload', authMiddleware, upload.single('file'), uploadMedia);

export default router;
