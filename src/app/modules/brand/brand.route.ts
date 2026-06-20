import express from 'express';
import { BrandControllers } from './brand.controller';
import { upload } from '../../utils/uploadConfig';

const router = express.Router();

// Route: /api/brands
router.post('/', upload.single('logo'), BrandControllers.createBrand);
router.patch('/:id', upload.single('logo'), BrandControllers.updateBrand); 

router.get('/', BrandControllers.getAllBrands);
router.get('/:id', BrandControllers.getSingleBrand);
router.delete('/:id', BrandControllers.deleteBrand);

export const BrandRoutes = router;