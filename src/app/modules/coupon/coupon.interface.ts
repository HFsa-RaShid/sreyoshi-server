import { Model } from 'mongoose';

export type ICoupon = {
  code: string;            
  discountPercentage: number; 
  minOrderAmount: number;  
  maxDiscountAmount: number; 
  expiryDate: Date;        
  status: 'Active' | 'Inactive'; 
};

export type CouponModel = Model<ICoupon, Record<string, unknown>>;