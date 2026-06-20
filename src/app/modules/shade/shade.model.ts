import { Schema, model } from 'mongoose';
import { IShadeManagement, IShadeDetails } from './shade.interface';

// 💡 চাইল্ড স্কিমা আপডেট করা হলো
const shadeDetailsSchema = new Schema<IShadeDetails>(
  {
    shadeName: { type: String, required: true, trim: true },
    shadeColorCode: { type: String, required: true, trim: true },
    shadeImage: { type: String, required: true }, // 💡 Base64 বা ইমেজ লিংক স্টোর করার জন্য
    stock: { type: Number, required: true, default: 0 }, // 💡 ডিফল্ট স্টক ০ থাকবে
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' } // 💡 ডিফল্ট একটিভ থাকবে
  },
  { _id: false }
);

const shadeManagementSchema = new Schema<IShadeManagement>(
  {
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    subCategory: { type: String, required: true, uppercase: true, trim: true },
    itemName: { type: String, required: true, trim: true },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    availableShades: [shadeDetailsSchema]
  },
  { timestamps: true }
);

shadeManagementSchema.index({ category: 1, subCategory: 1, itemName: 1 }, { unique: true });

export const ShadeManagement = model<IShadeManagement>('ShadeManagement', shadeManagementSchema);