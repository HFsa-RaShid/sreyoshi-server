import express from 'express';
import { ProductController } from './product.controller';

const router = express.Router();

router.post('/', ProductController.createProduct);
router.get('/', ProductController.getAllProducts);
router.get('/:productCode', ProductController.getSingleProduct); // productCode রুট প্যারামিটার
router.patch('/:productCode', ProductController.updateProduct);
router.delete('/:productCode', ProductController.deleteProduct);

export const ProductRoutes = router;