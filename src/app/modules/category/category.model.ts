import { Schema, model } from 'mongoose';
import { ICategory, ISubCategory, ISubCategoryItem } from './category.interface';

// ১. আইটেমের জন্য সাব-স্কিমা (আইডি ছাড়া)
const subCategoryItemSchema = new Schema<ISubCategoryItem>(
  {
    name: { type: String, required: true, trim: true },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
  },
  { _id: false } // 👈 এটি ডাটাবেজে স্বয়ংক্রিয় কোনো _id তৈরি হওয়া বন্ধ করবে
);

// ২. সাব-ক্যাটাগরির জন্য স্কিমা
const subCategorySchema = new Schema<ISubCategory>(
  {
    id: { type: String, default: () => `sub-${Date.now()}-${Math.random().toString(36).substr(2, 5)}` },
    title: { type: String, required: true, uppercase: true, trim: true },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    items: [subCategoryItemSchema]
  },
  { _id: false }
);

// ৩. মেন ক্যাটাগরি স্কিমা
const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    image: { type: String },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    subCategories: [subCategorySchema]
  },
  { timestamps: true }
);

export const Category = model<ICategory>('Category', categorySchema);