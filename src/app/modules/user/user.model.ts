import { Schema, model } from 'mongoose';
import { IUser, UserModel } from './user.interface';
import bcryptjs from 'bcryptjs';
import config from '../../../config';

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: 0 }, 
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password; 
        return ret;
      },
    },
  }
);

// ✨ ফিক্সড মিডলওয়্যার: async ফাংশন হওয়ায় এখানে 'next' ছাড়াই সুন্দর কাজ করবে
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  
  this.password = await bcryptjs.hash(
    this.password!,
    Number(config.bcrypt_salt_rounds)
  );
});

export const User = model<IUser, UserModel>('User', userSchema);