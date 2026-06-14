import { Model } from 'mongoose';

export type IUser = {
  name: string;
  email: string;
  password?: string; // ওয়ানাল বা রেসপন্স থেকে হাইড করার জন্য ওয়ানাল রাখা হয়েছে
  role: 'user' | 'admin';
};

export type UserModel = Model<IUser, Record<string, unknown>>;