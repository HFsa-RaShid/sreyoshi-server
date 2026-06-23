import express from 'express';
import { ProductController } from './product.controller';
import { upload } from '../../utils/uploadConfig';

const router = express.Router();

const productUpload = upload.fields([
  { name: 'commonImages', maxCount: 5 },
  { name: 'shadeImages', maxCount: 15 }
]);

router.post('/', productUpload, ProductController.createProduct);
router.patch('/:productCode', productUpload, ProductController.updateProduct);
router.get('/', ProductController.getAllProducts);
router.get('/:productCode', ProductController.getSingleProduct);
router.delete('/:productCode', ProductController.deleteProduct);

router.post('/validate-cart', ProductController.validateCartItems);

export const ProductRoutes = router;