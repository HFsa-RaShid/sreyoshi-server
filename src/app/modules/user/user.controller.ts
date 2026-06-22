import { Request, Response, NextFunction } from 'express';
import { UserService } from './user.service';
import { uploadToCloudinary } from '../../utils/uploadConfig'; // 👈 আপনার ক্লাউডিনারি আপলোড ফাংশনের সঠিক পাথ দিন

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
    const userId = req.user?._id; 
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

// 🎯 আপডেট করা হলো: ইমেজ ক্লাউডিনারিতে আপলোড করার লজিক সহ
const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
    let updatePayload = { ...req.body };

    // 📸 যদি পোস্টম্যান বা ফ্রন্টএন্ড থেকে ফাইল পাঠানো হয় (যেমন: Change Photo)
    if (req.file) {
      const imageUrl = await uploadToCloudinary(req.file);
      updatePayload.profileImage = imageUrl; // ক্লাউডিনারি ইউআরএল পেলোডে সেট করা হলো
    }

    // ⚙️ পোস্টম্যানে form-data ব্যবহার করলে preferences অবজেক্টটি স্ট্রিং হিসেবে আসতে পারে, সেটিকে অবজেক্টে রূপান্তর
    if (typeof updatePayload.preferences === 'string') {
      updatePayload.preferences = JSON.parse(updatePayload.preferences);
    }

    const result = await UserService.updateProfileInDB(userId, updatePayload);
    res.status(200).json({
      success: true,
      message: 'Profile settings updated successfully!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
    const result = await UserService.changePasswordInDB(userId, req.body);
    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error instanceof Error ? error.message : 'Error changing password' });
  }
};

const terminateSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
    const { sessionId } = req.params;
    const result = await UserService.terminateSessionInDB(userId, sessionId as string);
    res.status(200).json({
      success: true,
      message: 'Session terminated successfully!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteAccount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
    await UserService.deleteAccountFromDB(userId);
    res.status(200).json({
      success: true,
      message: 'Account permanently deleted.',
    });
  } catch (error) {
    next(error);
  }
};

export const UserController = {
  createUser,
  getMyProfile,
  updateProfile,
  changePassword,
  terminateSession,
  deleteAccount,
};