import { Request, Response, NextFunction } from 'express';
import { Category } from './category.model';

// Create Category
const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await Category.create(req.body);
    res.status(201).json({ success: true, message: 'Category created!', data: result });
  } catch (error) { next(error); }
};

// Get All Categories
const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await Category.find();
    res.status(200).json({ success: true, data: result });
  } catch (error) { next(error); }
};

// Get Single Category By MongoDB _id
const getSingleCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await Category.findById(req.params.id);
    if (!result) throw new Error('Category not found');
    res.status(200).json({ success: true, data: result });
  } catch (error) { next(error); }
};

// Update Category By MongoDB _id
const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, message: 'Category updated!', data: result });
  } catch (error) { next(error); }
};

// Delete Category By MongoDB _id
const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Category deleted successfully!' });
  } catch (error) { next(error); }
};

export const CategoryController = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory
};