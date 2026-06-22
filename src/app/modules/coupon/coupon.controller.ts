import { Request, Response, NextFunction } from 'express';
import { CouponServices } from './coupon.service';

const createCoupon = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await CouponServices.createCouponInDB(req.body);
    res.status(201).json({
      success: true,
      message: 'Coupon created successfully!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getActiveCoupons = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await CouponServices.getActiveCouponsFromDB();
    res.status(200).json({
      success: true,
      message: 'Available coupons fetched successfully!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllCoupons = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await CouponServices.getAllCouponsFromDB();
    res.status(200).json({
      success: true,
      message: 'All coupons fetched successfully!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateCoupon = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await CouponServices.updateCouponInDB(id as string, req.body);
    res.status(200).json({
      success: true,
      message: 'Coupon updated successfully!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteCoupon = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await CouponServices.deleteCouponFromDB(id as string);
    res.status(200).json({
      success: true,
      message: 'Coupon permanently deleted.',
    });
  } catch (error) {
    next(error);
  }
};

export const CouponControllers = {
  createCoupon,
  getActiveCoupons,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
};