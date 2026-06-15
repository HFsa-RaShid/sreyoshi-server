import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import config from '../../config';


// Cloudinary কনফিগারেশন
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer মেমোরি স্টোরেজ (ফাইলটি হার্ডডিস্কে সেভ না হয়ে র‍্যামে সাময়িক থাকবে)
const storage = multer.memoryStorage();
export const upload = multer({ storage });

// Cloudinary-তে ইমেজ আপলোড করার ফাংশন
export const uploadToCloudinary = (file: Express.Multer.File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'sreyoshi-backend' }, // ক্লাউডিনারিতে ফোল্ডারের নাম
      (error, result) => {
        if (error) return reject(error);
        resolve(result?.secure_url || '');
      }
    );
    uploadStream.end(file.buffer);
  });
};