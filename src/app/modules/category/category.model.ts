import { Schema, model } from 'mongoose';
import { ICategory, ISubCategory } from './category.interface';

const subCategorySchema = new Schema<ISubCategory>({
  title: { type: String, required: true },
  items: [{ type: String, required: true }]
}, { _id: false }); // subCategories এর ভেতরে আলাদা করে id জেনারেট হবে না

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    subCategories: [subCategorySchema]
  },
  { timestamps: true }
);

export const Category = model<ICategory>('Category', categorySchema);