import { IUser } from './user.interface';
import { User } from './user.model';
import bcryptjs from 'bcryptjs';
import config from '../../../config';

const createUser = async (payload: IUser): Promise<IUser> => {
  const result = await User.create(payload);
  return result;
};

const getMyProfile = async (id: string): Promise<IUser | null> => {
  return await User.findById(id);
};


const updateProfileInDB = async (userId: string, payload: any) => {
  const updateData: any = {};

  if (payload.name) updateData.name = payload.name;
  if (payload.phone) updateData.phone = payload.phone;
  if (payload.email) updateData.email = payload.email;
  if (payload.profileImage) updateData.profileImage = payload.profileImage;

 
  if (payload.preferences) {
    for (const key in payload.preferences) {
      updateData[`preferences.${key}`] = payload.preferences[key];
    }
  }

  return await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true, runValidators: true }
  );
};


const changePasswordInDB = async (userId: string, payload: any) => {
  const user = await User.findById(userId).select('+password');
  if (!user || !user.password) {
    throw new Error('User not found!');
  }

  const isPasswordMatched = await bcryptjs.compare(payload.oldPassword, user.password);
  if (!isPasswordMatched) {
    throw new Error('Old password does not match!');
  }

 
  user.password = payload.newPassword;
  await user.save();
  return { message: 'Password changed successfully!' };
};


const terminateSessionInDB = async (userId: string, sessionId: string) => {
  return await User.findByIdAndUpdate(
    userId,
    { $pull: { activeSessions: { _id: sessionId } } },
    { new: true }
  );
};


const deleteAccountFromDB = async (userId: string) => {
  return await User.findByIdAndDelete(userId);
};

export const UserService = {
  createUser,
  getMyProfile,
  updateProfileInDB,
  changePasswordInDB,
  terminateSessionInDB,
  deleteAccountFromDB,
};