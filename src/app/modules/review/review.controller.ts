import { Request, Response, NextFunction } from 'express';
import { ReviewServices } from './review.service';

const createReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await ReviewServices.createReviewIntoDB(req.body);
    res.status(201).json({ success: true, message: 'Review added successfully!', data: result });
  } catch (error) { next(error); }
};

const getAllReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await ReviewServices.getAllReviewsFromDB();
    res.status(200).json({ success: true, message: 'All reviews fetched successfully!', data: result });
  } catch (error) { next(error); }
};

const getProductReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;
    const result = await ReviewServices.getProductReviewsFromDB(productId as string);
    res.status(200).json({ success: true, message: 'Product reviews fetched successfully!', data: result });
  } catch (error) { next(error); }
};

const updateReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await ReviewServices.updateReviewInDB(id as string, req.body);
    res.status(200).json({ success: true, message: 'Review updated successfully!', data: result });
  } catch (error) { next(error); }
};

const deleteReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await ReviewServices.deleteReviewFromDB(id as string);
    res.status(200).json({ success: true, message: 'Review deleted successfully!' });
  } catch (error) { next(error); }
};

export const ReviewControllers = {
  createReview,
  getAllReviews,
  getProductReviews,
  updateReview,
  deleteReview,
};