import { Router } from 'express';
import { getMemories, createMemory } from '../controllers/memory.controller';
import { upload } from '../middlewares/upload';

const router = Router();

router.get('/', getMemories);
router.post('/', upload.single('image'), createMemory);

export default router;
