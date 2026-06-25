import { Request, Response, NextFunction } from 'express';
import { UserService } from './user.service';
import { uploadToCloudinary } from '../../utils/uploadConfig'; 

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await UserService.createUser(req.body);
    res.status(201).json({ success: true, message: 'User created successfully!', data: result });
  } catch (error) { next(error); }
};

const getMyProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id; 
    const result = await UserService.getMyProfile(userId);
    
    // 🎯 সিকিউরিটি গার্ড: যদি রিকোয়েস্ট করা ইউজারটি অলরেডি ব্লকড থাকে
    if (result?.status === 'blocked') {
      return res.status(403).json({ success: false, message: 'Your account has been restricted.' });
    }
    
    res.status(200).json({ success: true, message: 'User profile fetched successfully!', data: result });
  } catch (error) { next(error); }
};

const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
    let updatePayload = { ...req.body };
    if (req.file) {
      updatePayload.profileImage = await uploadToCloudinary(req.file);
    }
    if (typeof updatePayload.preferences === 'string') {
      updatePayload.preferences = JSON.parse(updatePayload.preferences);
    }
    const result = await UserService.updateProfileInDB(userId, updatePayload);
    res.status(200).json({ success: true, message: 'Profile updated successfully!', data: result });
  } catch (error) { next(error); }
};

const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await UserService.changePasswordInDB(req.user?._id, req.body);
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    res.status(400).json({ success: false, message: error instanceof Error ? error.message : 'Error changing password' });
  }
};

const terminateSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await UserService.terminateSessionInDB(req.user?._id, req.params.sessionId as string);
    res.status(200).json({ success: true, message: 'Session terminated!', data: result });
  } catch (error) { next(error); }
};

const deleteAccount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await UserService.deleteAccountFromDB(req.user?._id);
    res.status(200).json({ success: true, message: 'Account permanently deleted.' });
  } catch (error) { next(error); }
};

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await UserService.getAllUsersFromDB(req.query.search as string);
    res.status(200).json({ success: true, message: 'Users fetched successfully!', data: result });
  } catch (error) { next(error); }
};

const inviteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await UserService.inviteUserByEmail(req.body.email, req.headers.origin || 'http://localhost:3000');
    res.status(200).json({ success: true, message: 'Invitation email sent successfully!' });
  } catch (error) { next(error); }
};

const updateUserRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await UserService.updateUserRoleInDB(req.params.userId as string, req.body.role);
    res.status(200).json({ success: true, message: 'Role updated successfully!', data: result });
  } catch (error) { next(error); }
};

// 🎯 নতুন কন্ট্রোলার মেথড
const toggleUserStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await UserService.toggleUserStatusInDB(req.params.userId as string, req.body.status);
    res.status(200).json({ success: true, message: `User access status updated to ${req.body.status}`, data: result });
  } catch (error) { next(error); }
};

export const UserController = {
  createUser, getMyProfile, updateProfile, changePassword, terminateSession, deleteAccount, getAllUsers, inviteUser, updateUserRole, toggleUserStatus
};