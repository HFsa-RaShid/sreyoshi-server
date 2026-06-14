import { Request, Response, NextFunction } from 'express';
import { Product } from './product.model';

// Create Product
const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await Product.create(req.body);
    res.status(201).json({ success: true, message: 'Product created!', data: result });
  } catch (error) { next(error); }
};

// Get All Products (ক্যাটাগরির সব ডেটাসহ Populate করা হয়েছে)
const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await Product.find().populate('category');
    res.status(200).json({ success: true, data: result });
  } catch (error) { next(error); }
};

// Get Single Product By productCode
const getSingleProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productCode } = req.params;
    const result = await Product.findOne({ productCode }).populate('category');
    if (!result) throw new Error('Product not found with this code');
    
    res.status(200).json({ success: true, data: result });
  } catch (error) { next(error); }
};

// Update Product By productCode
const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productCode } = req.params;
    const result = await Product.findOneAndUpdate({ productCode }, req.body, { new: true });
    if (!result) throw new Error('Product not found to update');

    res.status(200).json({ success: true, message: 'Product updated!', data: result });
  } catch (error) { next(error); }
};

// Delete Product By productCode
const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productCode } = req.params;
    const result = await Product.findOneAndDelete({ productCode });
    if (!result) throw new Error('Product not found to delete');

    res.status(200).json({ success: true, message: 'Product deleted successfully!' });
  } catch (error) { next(error); }
};

export const ProductController = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct
};