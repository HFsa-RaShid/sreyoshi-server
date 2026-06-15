import express from 'express';
import { CategoryController } from './category.controller';
import { upload } from '../../utils/uploadConfig'; // মাত্র তৈরি করা কনফিগ

const router = express.Router();

// এখানে upload.single('image') যোগ করা হয়েছে
router.post('/', upload.single('image'), CategoryController.createCategory);
router.get('/', CategoryController.getAllCategories);
router.get('/:id', CategoryController.getSingleCategory);
router.patch('/:id', upload.single('image'), CategoryController.updateCategory); // আপডেটেও লাগতে পারে
router.delete('/:id', CategoryController.deleteCategory);

export const CategoryRoutes = router;