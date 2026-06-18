import { Document } from 'mongoose';

// কোর ব্র্যান্ড ডেটা ইন্টারফেস
export interface IBrand {
  name: string;
  slug: string;
  logo?: string;
  status: 'Active' | 'Inactive';
}

// mongoose ডকুমেন্টের জন্য ইন্টারফেস
export interface IBrandDocument extends IBrand, Document {
  createdAt: Date;
  updatedAt: Date;
}