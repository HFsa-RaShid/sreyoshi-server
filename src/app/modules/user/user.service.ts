import { IUser } from './user.interface';
import { User } from './user.model';
import bcryptjs from 'bcryptjs';
import { sendInvitationEmail } from '../../utils/sendEmail';

const createUser = async (payload: IUser): Promise<IUser> => {
  return await User.create(payload);
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
  return await User.findByIdAndUpdate(userId, { $set: updateData }, { new: true, runValidators: true });
};

const changePasswordInDB = async (userId: string, payload: any) => {
  const user = await User.findById(userId).select('+password');
  if (!user || !user.password) throw new Error('User not found!');
  const isPasswordMatched = await bcryptjs.compare(payload.oldPassword, user.password);
  if (!isPasswordMatched) throw new Error('Old password does not match!');
  
  user.password = payload.newPassword;
  await user.save();
  return { message: 'Password changed successfully!' };
};

const terminateSessionInDB = async (userId: string, sessionId: string) => {
  return await User.findByIdAndUpdate(userId, { $pull: { activeSessions: { _id: sessionId } } }, { new: true });
};

const deleteAccountFromDB = async (userId: string) => {
  return await User.findByIdAndDelete(userId);
};

const getAllUsersFromDB = async (searchTerm: string) => {
  const filter: any = {};
  if (searchTerm) {
    filter.$or = [
      { name: { $regex: searchTerm, $options: 'i' } },
      { phone: { $regex: searchTerm, $options: 'i' } },
      { email: { $regex: searchTerm, $options: 'i' } },
    ];
  }
  return await User.find(filter);
};

const inviteUserByEmail = async (email: string, origin: string) => {
  const setupLink = `${origin}/auth/signup?email=${encodeURIComponent(email)}`;
  await sendInvitationEmail(email, setupLink);
  return { success: true };
};

const updateUserRoleInDB = async (userId: string, role: 'user' | 'admin') => {
  return await User.findByIdAndUpdate(userId, { $set: { role } }, { new: true, runValidators: true });
};

// 🎯 নতুন: ব্লক/আনব্লক মেথড এবং সেশন ক্লিয়ারেন্স লজিক
const toggleUserStatusInDB = async (userId: string, status: 'active' | 'blocked') => {
  const updateData: any = { status };
  // ইউজারকে ব্লক করা হলে সাথে সাথে তার কারেন্ট সব অ্যাক্টিভ লগইন ডিভাইস সেশন ফোর্স রিমুভ করে দেওয়া হবে
  if (status === 'blocked') {
    updateData.activeSessions = [];
  }
  return await User.findByIdAndUpdate(userId, { $set: updateData }, { new: true, runValidators: true });
};

export const UserService = {
  createUser,
  getMyProfile,
  updateProfileInDB,
  changePasswordInDB,
  terminateSessionInDB,
  deleteAccountFromDB,
  getAllUsersFromDB,
  inviteUserByEmail,
  updateUserRoleInDB,
  toggleUserStatusInDB,
};