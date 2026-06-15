import { Request, Response, NextFunction } from 'express';
import { ProductServices } from './product.service';

// ১. মেইন প্রোডাক্ট তৈরি করার কন্ট্রোলার (সব ইমেজ ও ডাটা একসাথে হ্যান্ডেল করবে)
const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productData = req.body.data ? JSON.parse(req.body.data) : req.body;
    
    // এক্সপ্রেস মাল্টি-ফিল্ড ফাইল রিসিভ করার টাইপ কাস্টিং
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const result = await ProductServices.createProductIntoDB(productData, files);

    res.status(201).json({
      success: true,
      message: 'Product created successfully with all dynamic fields!',
      data: result,
    });
  } catch (error) { next(error); }
};

// ২. সব প্রোডাক্ট একসাথে গেট করার কন্ট্রোলার
const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await ProductServices.getAllProductsFromDB();
    res.status(200).json({ success: true, data: result });
  } catch (error) { next(error); }
};

// ৩. সিঙ্গেল প্রোডাক্ট গেট করার কন্ট্রোলার
const getSingleProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productCode } = req.params;
    const result = await ProductServices.getSingleProductFromDB(productCode as string);
    
    if (!result) throw new Error('Product not found with this code!');

    res.status(200).json({ success: true, data: result });
  } catch (error) { next(error); }
};

// ৪. প্রোডাক্ট আপডেট করার কন্ট্রোলার
const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productCode } = req.params;
    const productData = req.body.data ? JSON.parse(req.body.data) : req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const result = await ProductServices.updateProductInDB(productCode as string, productData, files);
    if (!result) throw new Error('Product not found to update!');

    res.status(200).json({
      success: true,
      message: 'Product updated successfully!',
      data: result,
    });
  } catch (error) { next(error); }
};

// ৫. প্রোডাক্ট ডিলিট করার কন্ট্রোলার
const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productCode } = req.params;
    const result = await ProductServices.deleteProductFromDB(productCode as string);
    if (!result) throw new Error('Product not found to delete!');

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully!',
    });
  } catch (error) { next(error); }
};

export const ProductController = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};