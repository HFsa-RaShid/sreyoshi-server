import { Document, Types } from 'mongoose';

export interface IShadeDetails {
  shadeName: string;
  shadeColorCode: string;
  shadeImage: string; // 💡 নতুন যোগ করা হলো (ডিভাইস থেকে আসা Base64 বা URL)
  stock: number;      // 💡 প্রতিটি শেডের নিজস্ব লাইভ স্টক কাউন্ট
  status: 'Active' | 'Inactive'; // 💡 নির্দিষ্ট শেডটি একটিভ নাকি ইনএকটিভ
}

export interface IShadeManagement extends Document {
  category: Types.ObjectId;
  subCategory: string;
  itemName: string;
  status: 'Active' | 'Inactive'; // মেইন কনফিগুরেশনের গ্লোবাল স্ট্যাটাস
  availableShades: IShadeDetails[];
}