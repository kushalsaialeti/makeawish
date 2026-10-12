import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const isImage = file.mimetype ? file.mimetype.startsWith('image/') : true;
    if (isImage) {
      return {
        folder: 'makeawish',
        resource_type: 'image',
        format: 'webp',
        transformation: [
          { width: 2400, height: 2400, crop: 'limit' },
          { quality: 'auto:good' },
        ],
        flags: 'strip_profile',
      };
    }
    return {
      folder: 'makeawish',
      resource_type: 'auto',
    };
  },
});

export const upload = multer({ storage: storage });
