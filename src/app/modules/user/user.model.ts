import { Schema, model } from 'mongoose';
import { IUser, UserModel } from './user.interface';
import bcryptjs from 'bcryptjs';
import config from '../../../config';

const userPreferencesSchema = new Schema({
  language: { type: String, default: 'English' },
  orderNotifications: { type: Boolean, default: true },
  promotionalAlerts: { type: Boolean, default: false },
  smsAlerts: { type: Boolean, default: true },
  marketingEmails: { type: Boolean, default: false }
}, { _id: false });

const activeSessionSchema = new Schema({
  device: { type: String, required: true },
  location: { type: String, required: true },
  lastActive: { type: Date, default: Date.now }
});

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true }, 
    email: { type: String, sparse: true, unique: true },
    password: { type: String, select: 0 }, 
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    status: { type: String, enum: ['active', 'blocked'], default: 'active' }, // 🎯 নতুন ফিল্ড
    profileImage: { type: String, default: '' },
    isSocialLogin: { type: Boolean, default: false },
    refreshToken: { type: String, select: 0 },
    preferences: { type: userPreferencesSchema, default: {} },
    activeSessions: [activeSessionSchema]
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password; 
        delete ret.refreshToken; 
        return ret;
      },
    },
  }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return;
  this.password = await bcryptjs.hash(this.password, Number(config.bcrypt_salt_rounds));
});

export const User = model<IUser, UserModel>('User', userSchema);