import { Schema, model } from 'mongoose';
import { ICoupon, CouponModel } from './coupon.interface';

const couponSchema = new Schema<ICoupon>(
  {
    code: { 
      type: String, 
      required: true, 
      unique: true, 
      uppercase: true, 
      trim: true 
    },
    discountPercentage: { type: Number, required: true, min: 1, max: 100 },
    minOrderAmount: { type: Number, required: true, min: 0 },
    maxDiscountAmount: { type: Number, required: true, min: 0 },
    expiryDate: { type: Date, required: true },
    status: { 
      type: String, 
      enum: ['Active', 'Inactive'], 
      default: 'Active' 
    },
  },
  {
    timestamps: true,
  }
);

export const Coupon = model<ICoupon, CouponModel>('Coupon', couponSchema);