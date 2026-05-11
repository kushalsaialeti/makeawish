import { Router } from 'express';
import { getCmsContent, updateCmsContent, uploadMedia } from '../controllers/cms.controller';
import { upload } from '../middlewares/upload';

const router = Router();

router.get('/', getCmsContent);
router.post('/upload', upload.single('file'), uploadMedia);
router.put('/:section_id', updateCmsContent);

export default router;
