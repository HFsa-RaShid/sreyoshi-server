import { Request, Response, NextFunction } from 'express';
import { ProductServices } from './product.service';

const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productData = req.body.data ? JSON.parse(req.body.data) : req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const result = await ProductServices.createProductIntoDB(productData, files);
    res.status(201).json({ success: true, message: 'Product created successfully!', data: result });
  } catch (error) { next(error); }
};

const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await ProductServices.getAllProductsFromDB();
    res.status(200).json({ success: true, data: result });
  } catch (error) { next(error); }
};

const getSingleProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await ProductServices.getSingleProductFromDB(req.params.productCode as string);
    if (!result) throw new Error('Product not found!');
    res.status(200).json({ success: true, data: result });
  } catch (error) { next(error); }
};

const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productData = req.body.data ? JSON.parse(req.body.data) : req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const result = await ProductServices.updateProductInDB(req.params.productCode as string, productData, files);
    res.status(200).json({ success: true, message: 'Product updated successfully!', data: result });
  } catch (error) { next(error); }
};

const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await ProductServices.deleteProductFromDB(req.params.productCode as string);
    if (!result) throw new Error('Product not found to delete!');
    res.status(200).json({ success: true, message: 'Product deleted successfully!' });
  } catch (error) { next(error); }
};

export const ProductController = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};