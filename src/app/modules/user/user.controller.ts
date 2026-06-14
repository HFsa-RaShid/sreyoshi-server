import { Request, Response, NextFunction } from 'express';
import { UserService } from './user.service';

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await UserService.createUser(req.body);
    res.status(201).json({
      success: true,
      message: 'User created successfully!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getMyProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id; // মিডলওয়্যার থেকে পাওয়া
    const result = await UserService.getMyProfile(userId);
    res.status(200).json({
      success: true,
      message: 'User profile fetched successfully!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const UserController = {
  createUser,
  getMyProfile,
};