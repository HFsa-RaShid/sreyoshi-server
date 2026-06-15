import { Request, Response, NextFunction } from 'express';
import { CategoryServices } from './category.service';

const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categoryData = req.body.data ? JSON.parse(req.body.data) : req.body;
    const result = await CategoryServices.createCategoryIntoDB(categoryData, req.file);
    res.status(201).json({ success: true, message: 'Category created successfully!', data: result });
  } catch (error) { next(error); }
};

const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await CategoryServices.getAllCategoriesFromDB();
    res.status(200).json({ success: true, data: result });
  } catch (error) { next(error); }
};

const getSingleCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await CategoryServices.getSingleCategoryFromDB(req.params.id as string);
    res.status(200).json({ success: true, data: result });
  } catch (error) { next(error); }
};

const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categoryData = req.body.data ? JSON.parse(req.body.data) : req.body;
    const result = await CategoryServices.updateCategoryInDB(req.params.id as string, categoryData, req.file);
    res.status(200).json({ success: true, message: 'Category updated successfully!', data: result });
  } catch (error) { next(error); }
};

const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await CategoryServices.deleteCategoryFromDB(req.params.id as string);
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