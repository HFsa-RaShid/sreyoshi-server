import express from 'express';
import { CouponControllers } from './coupon.controller';
import auth from '../../../middlewares/auth'; 

const router = express.Router();


router.get('/available-coupons', CouponControllers.getActiveCoupons);


router.post('/create-coupon', auth('admin'), CouponControllers.createCoupon);
router.get('/all-coupons', auth('admin'), CouponControllers.getAllCoupons);
router.patch('/update-coupon/:id', auth('admin'), CouponControllers.updateCoupon);
router.delete('/delete-coupon/:id', auth('admin'), CouponControllers.deleteCoupon);

export const CouponRoutes = router;