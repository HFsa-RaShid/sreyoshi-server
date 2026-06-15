import { Schema, model } from 'mongoose';
import { IShadeManagement, IShadeDetails } from './shade.interface';

const shadeDetailsSchema = new Schema<IShadeDetails>(
  {
    shadeName: { type: String, required: true, trim: true },
    shadeColorCode: { type: String, required: true, trim: true }
  },
  { _id: false }
);

const shadeManagementSchema = new Schema<IShadeManagement>(
  {
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    subCategory: { type: String, required: true, uppercase: true, trim: true },
    itemName: { type: String, required: true, trim: true },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }, // 👈 স্ট্যাটাস
    availableShades: [shadeDetailsSchema]
  },
  { timestamps: true }
);

shadeManagementSchema.index({ category: 1, subCategory: 1, itemName: 1 }, { unique: true });

export const ShadeManagement = model<IShadeManagement>('ShadeManagement', shadeManagementSchema);