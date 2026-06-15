import { Document } from 'mongoose';

export interface ISubCategory {
  title: string;
  items: string[];
}

export interface ICategory extends Document {
  name: string;
  image?: string;
  status: 'Active' | 'Inactive'; // 👈 স্ট্যাটাস যুক্ত করা হলো
  subCategories: ISubCategory[];
}