import { Request, Response, NextFunction } from 'express';
import { ProductServices } from './product.service';
import { Product } from './product.model';

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

// 💡 কাস্টমাইজড কার্ট ভ্যালিডেশন (শেড ওয়াইজ স্টক চেক করবে)
const validateCartItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { items } = req.body; 
    const stockResult: Record<string, number> = {};

    if (!items || !Array.isArray(items)) {
      throw new Error('Invalid items format! Array expected.');
    }

    for (const item of items) {
      const product = await Product.findById(item.id);
      const shadeKey = `${item.id}-${item.shadeName || 'NoShade'}`;
      
      if (!product) {
        stockResult[shadeKey] = 0;
        continue;
      }

      // 💡 যদি প্রোডাক্টের নির্দিষ্ট শেড থাকে, তবে সেই শেডের নির্দিষ্ট স্টকটাই চেক করবে
      if (item.shadeName && item.shadeName !== 'NoShade') {
        const shade = product.shades?.find(
          (s) => s.shadeName.trim().toLowerCase() === item.shadeName.trim().toLowerCase() && s.status === 'Active'
        );
        stockResult[shadeKey] = shade && product.status === 'Active' ? shade.stock : 0;
      } else {
        // রেগুলার প্রোডাক্ট (যেমন নো-শেড ক্রিম/ফেসওয়াশ) হলে ডিরেক্ট মেইন টোটাল স্টক চেক করবে
        stockResult[shadeKey] = product.status === 'Active' ? product.totalStock : 0;
      }
    }

    res.status(200).json({ success: true, data: stockResult });
  } catch (error) { 
    next(error); 
  }
};

export const ProductController = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  validateCartItems,
};