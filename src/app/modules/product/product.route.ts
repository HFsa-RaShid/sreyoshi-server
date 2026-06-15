import express from 'express';
import { ProductController } from './product.controller';
import { upload } from '../../utils/uploadConfig'; // আপনার প্রোজেক্টের পাথ অনুযায়ী দিবেন

const router = express.Router();

// 🟢 মুল্টারের মাল্টি-ফিল্ড কনফিগারেশন (একসাথে আলাদা ফিল্ডের ইমেজ হ্যান্ডেল করার জন্য)
const multiUpload = upload.fields([
  { name: 'images', maxCount: 4 },       // প্রোডাক্টের মেইন ৪টি গ্যালারি ইমেজ ফাইল 
  { name: 'shadeImages', maxCount: 15 }  // মেকআপ শেডগুলোর জন্য আলাদা আলাদা ইমেজ ফাইলসমূহ (সর্বোচ্চ ১৫টি)
]);

// 🔵 ক্রিয়েট এবং আপডেট রুটে multiUpload মিডলওয়্যার যুক্ত করা হলো
router.post('/', multiUpload, ProductController.createProduct);
router.patch('/:productCode', multiUpload, ProductController.updateProduct);

// 🟡 সাধারণ এপিআই রাউটসমূহ (আগের মতোই থাকবে)
router.get('/', ProductController.getAllProducts);
router.get('/:productCode', ProductController.getSingleProduct);
router.delete('/:productCode', ProductController.deleteProduct);

export const ProductRoutes = router;