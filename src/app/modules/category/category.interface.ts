import { Document } from 'mongoose';

// ১. সাব-ক্যাটাগরির ভেতরের প্রতিটা আইটেমের ইন্টারফেস (আইডি ছাড়া)
export interface ISubCategoryItem {
  name: string;
  status: 'Active' | 'Inactive'; // 👈 আইটেমের নিজস্ব স্ট্যাটাস
}

// ২. সাব-ক্যাটাগরির ইন্টারফেস
export interface ISubCategory {
  id?: string; // সাব-ক্যাটাগরির জন্য আইডিটি অপশনাল রাখা হলো
  title: string;
  status: 'Active' | 'Inactive';
  items: ISubCategoryItem[];      // 👈 অবজেক্ট অ্যারে (আইডি ছাড়া)
}

// ৩. মূল ক্যাটাগরির ইন্টারফেস
export interface ICategory extends Document {
  name: string;
  image?: string;
  status: 'Active' | 'Inactive';
  subCategories: ISubCategory[];
}