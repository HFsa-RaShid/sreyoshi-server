import express from 'express';
import { ReviewControllers } from './review.controller';

const router = express.Router();

router.post('/', ReviewControllers.createReview);
router.get('/', ReviewControllers.getAllReviews);
router.get('/product/:productId', ReviewControllers.getProductReviews);
router.patch('/:id', ReviewControllers.updateReview);
router.delete('/:id', ReviewControllers.deleteReview);

// 🔒 এডমিন ড্যাশবোর্ড থেকে স্ট্যাটাস পরিবর্তন করার জন্য কাস্টম রাউট
router.patch('/:id/status', ReviewControllers.updateReviewStatus);

export const ReviewRoutes = router;