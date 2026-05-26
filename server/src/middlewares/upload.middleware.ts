import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'campuscompare/colleges',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1000, height: 667, crop: 'limit' }],
  } as any,
});

export const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

const noticeStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req: any, file: any) => {
    const isImage = file.mimetype.startsWith('image/');
    const ext = file.originalname.split('.').pop() || '';
    return {
      folder: 'campuscompare/notices',
      resource_type: isImage ? 'image' : 'raw',
      format: isImage ? undefined : ext,
      public_id: `${Date.now()}-${Math.round(Math.random() * 1e9)}`,
    };
  },
});

export const uploadNotice = multer({
  storage: noticeStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit for notices
  }
});

const avatarStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'campuscompare/avatars',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }],
  } as any,
});

export const uploadUserAvatar = multer({
  storage: avatarStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});
