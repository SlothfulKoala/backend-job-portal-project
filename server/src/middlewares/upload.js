const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Determine the folder based on file type
    const isPdf = file.mimetype === 'application/pdf';
    
    return {
      folder: 'careervista_profiles',
      // 'auto' allows PDFs, Docs, and Images in the same storage instance
      resource_type: 'auto', 
      // We set specific formats to prevent unwanted file types
      allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'pdf'],
      // Only apply transformation if it's an image
      transformation: isPdf ? [] : [{ width: 500, height: 500, crop: 'limit' }],
    };
  },
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit safety check
});

module.exports = upload;