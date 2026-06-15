import { Schema, model } from 'mongoose';
import { ICategory, ISubCategory } from './category.interface';

const subCategorySchema = new Schema<ISubCategory>(
  {
    title: { type: String, required: true, uppercase: true, trim: true },
    items: [{ type: String, required: true, trim: true }]
  },
  { _id: false }
);

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    image: { type: String },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }, // 👈 ডিফল্ট Active
    subCategories: [subCategorySchema]
  },
  { timestamps: true }
);

export const Category = model<ICategory>('Category', categorySchema);