import express from 'express';
import { ProductController } from './product.controller';
import { upload } from '../../utils/uploadConfig';

const router = express.Router();

// যেহেতু শেড ইমেজ ফ্রন্টএ্যান্ড থেকে আসবে না, তাই শুধু commonImages রাখা হলো
const productUpload = upload.fields([
  { name: 'commonImages', maxCount: 4 }
]);

router.post('/', productUpload, ProductController.createProduct);
router.patch('/:productCode', productUpload, ProductController.updateProduct);
router.get('/', ProductController.getAllProducts);
router.get('/:productCode', ProductController.getSingleProduct);
router.delete('/:productCode', ProductController.deleteProduct);

// কার্ট ভ্যালিডেশন রাউট (যদি আপনার প্রজেক্টের প্রয়োজন হয়)
router.post('/validate-cart', ProductController.validateCartItems);

export const ProductRoutes = router;