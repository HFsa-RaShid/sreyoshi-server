import { ICoupon } from './coupon.interface';
import { Coupon } from './coupon.model';


const createCouponInDB = async (payload: ICoupon): Promise<ICoupon> => {
  return await Coupon.create(payload);
};


const getActiveCouponsFromDB = async (): Promise<ICoupon[]> => {
  const currentDate = new Date();
  return await Coupon.find({
    status: 'Active',
    expiryDate: { $gte: currentDate }, 
  });
};


const getAllCouponsFromDB = async (): Promise<ICoupon[]> => {
  return await Coupon.find().sort({ createdAt: -1 });
};


const updateCouponInDB = async (id: string, payload: Partial<ICoupon>): Promise<ICoupon | null> => {
  return await Coupon.findByIdAndUpdate(
    id,
    { $set: payload },
    { new: true, runValidators: true }
  );
};


const deleteCouponFromDB = async (id: string): Promise<ICoupon | null> => {
  return await Coupon.findByIdAndDelete(id);
};

export const CouponServices = {
  createCouponInDB,
  getActiveCouponsFromDB,
  getAllCouponsFromDB,
  updateCouponInDB,
  deleteCouponFromDB,
};