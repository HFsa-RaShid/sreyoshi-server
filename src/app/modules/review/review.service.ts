import { IReview } from './review.interface';
import { Review } from './review.model';

const createReviewIntoDB = async (payload: IReview) => {
  const result = await Review.create(payload);
  return result;
};

const getAllReviewsFromDB = async () => {
  const result = await Review.find().populate('user', 'name email').populate('product', 'name productCode');
  return result;
};

const getProductReviewsFromDB = async (productId: string) => {
  const result = await Review.find({ product: productId }).populate('user', 'name email');
  return result;
};

const updateReviewInDB = async (id: string, payload: Partial<IReview>) => {
  const result = await Review.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

const deleteReviewFromDB = async (id: string) => {
  const result = await Review.findByIdAndDelete(id);
  return result;
};

export const ReviewServices = {
  createReviewIntoDB,
  getAllReviewsFromDB,
  getProductReviewsFromDB,
  updateReviewInDB,
  deleteReviewFromDB,
};