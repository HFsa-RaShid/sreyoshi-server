import express from 'express';
import { CategoryController } from './category.controller';
import { upload } from '../../utils/uploadConfig';

const router = express.Router();

router.post('/', upload.single('image'), CategoryController.createCategory);
router.patch('/:id', upload.single('image'), CategoryController.updateCategory);
router.get('/', CategoryController.getAllCategories);
router.get('/:id', CategoryController.getSingleCategory);
router.delete('/:id', CategoryController.deleteCategory);

export const CategoryRoutes = router;