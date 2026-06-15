import { Request, Response, NextFunction } from 'express';
import { Category } from './category.model';
import { uploadToCloudinary } from '../../utils/uploadConfig'; // আপনার পাথ অনুযায়ী ইমপোর্ট করুন

// Create Category (With Cloudinary Image)
const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // form-data থেকে টেক্সট ডাটা পার্স করা
    const categoryData = req.body.data ? JSON.parse(req.body.data) : req.body;

    // ইমেজ আপলোড লজিক
    if (req.file) {
      const imageUrl = await uploadToCloudinary(req.file);
      categoryData.image = imageUrl; // ডাটাবেজের 'image' ফিল্ডে URL সেট করা হলো
    } else {
      throw new Error('Category image is required!');
    }

    const result = await Category.create(categoryData);
    res.status(201).json({ success: true, message: 'Category created!', data: result });
  } catch (error) { next(error); }
};

// Get All Categories (আগের মতোই থাকবে)
const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await Category.find();
    res.status(200).json({ success: true, data: result });
  } catch (error) { next(error); }
};

// Get Single Category By MongoDB _id (আগের মতোই থাকবে)
const getSingleCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await Category.findById(req.params.id);
    if (!result) throw new Error('Category not found');
    res.status(200).json({ success: true, data: result });
  } catch (error) { next(error); }
};

// Update Category By MongoDB _id (With Optional Image Update)
const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categoryData = req.body.data ? JSON.parse(req.body.data) : req.body;

    // যদি অ্যাডমিন নতুন কোনো ইমেজ ফাইল আপলোড করে, তবেই ক্লাউডিনারি কল হবে
    if (req.file) {
      const imageUrl = await uploadToCloudinary(req.file);
      categoryData.image = imageUrl;
    }

    const result = await Category.findByIdAndUpdate(req.params.id, categoryData, { new: true, runValidators: true });
    if (!result) throw new Error('Category not found to update');
    
    res.status(200).json({ success: true, message: 'Category updated!', data: result });
  } catch (error) { next(error); }
};

// Delete Category By MongoDB _id (আগের মতোই থাকবে)
const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await Category.findByIdAndDelete(req.params.id);
    if (!result) throw new Error('Category not found to delete');
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