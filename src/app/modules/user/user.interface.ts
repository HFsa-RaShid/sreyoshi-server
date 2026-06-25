import { Model, Types } from 'mongoose';

export type IUserPreferences = {
  language: string;
  orderNotifications: boolean;
  promotionalAlerts: boolean;
  smsAlerts: boolean;
  marketingEmails: boolean;
};

export type IActiveSession = {
  _id?: Types.ObjectId;
  device: string;
  location: string;
  lastActive: Date;
};

export type IUser = {
  name: string;
  phone: string; 
  email?: string; 
  password?: string; 
  role: 'user' | 'admin';
  status: 'active' | 'blocked'; 
  profileImage?: string; 
  isSocialLogin?: boolean;
  refreshToken?: string; 
  preferences: IUserPreferences; 
  activeSessions: IActiveSession[]; 
};

export type UserModel = Model<IUser, Record<string, unknown>>;