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

const router = Router();

// Admin routes
router.get('/', getAllWishes);
router.post('/', createWish);
router.get('/id/:id', getWishById);
router.put('/:id', updateWishContent);

// User route (by slug)
router.get('/slug/:slug', getWishBySlug);

// Shared route
router.post('/upload', upload.single('file'), uploadMedia);

export default router;
