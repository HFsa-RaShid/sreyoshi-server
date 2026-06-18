import express from 'express';
import { BrandControllers } from './brand.controller';
import { upload } from '../../utils/uploadConfig';
// import { upload } from '../../middlewares/multer'; // আপনার প্রোজেক্টের multer মিডিয়লওয়্যার হলে ইমপোর্ট করুন

const router = express.Router();

// Route: /api/brands
router.post('/', upload.single('logo'), BrandControllers.createBrand);

router.get('/', BrandControllers.getAllBrands);
router.get('/:id', BrandControllers.getSingleBrand);
router.patch('/:id', BrandControllers.updateBrand);
router.delete('/:id', BrandControllers.deleteBrand);

export const BrandRoutes = router;