import { Request, Response, NextFunction } from 'express';
import { WishlistServices } from './wishlist.service';

const toggleWishlist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.body;
    const userId = req.user?._id || req.body.userId; // যদি অথেনটিকেশন মিডলওয়্যার ব্যবহার করেন তবে req.user থেকে আসবে

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required!' });
    }

    const result = await WishlistServices.toggleWishlistInDB(userId, productId);
    res.status(200).json({
      success: true,
      message: 'Wishlist updated successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getMyWishlist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id || req.params.userId;
    const result = await WishlistServices.getMyWishlistFromDB(userId);

    res.status(200).json({
      success: true,
      data: result || { userId, products: [] }, // উইশলিস্ট না থাকলে খালি অ্যারে পাঠাবে
    });
  } catch (error) {
    next(error);
  }
};

const clearWishlist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id || req.params.userId;
    const result = await WishlistServices.clearWishlistFromDB(userId);

    res.status(200).json({
      success: true,
      message: 'Wishlist cleared successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const WishlistControllers = {
  toggleWishlist,
  getMyWishlist,
  clearWishlist,
};