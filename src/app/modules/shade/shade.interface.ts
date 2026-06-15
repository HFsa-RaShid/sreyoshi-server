import { Document, Types } from 'mongoose';

export interface IShadeDetails {
  shadeName: string;
  shadeColorCode: string;
}

export interface IShadeManagement extends Document {
  category: Types.ObjectId;
  subCategory: string;
  itemName: string;
  status: 'Active' | 'Inactive'; // 👈 মেইন কনফিগুরেশনের স্ট্যাটাস
  availableShades: IShadeDetails[];
}