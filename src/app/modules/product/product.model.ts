import { Schema, model } from 'mongoose';
import { IProduct, IProductShade } from './product.interface';

const productShadeSchema = new Schema<IProductShade>(
  {
    shadeName: { type: String, required: true },
    shadeColorCode: { type: String },
    shadeImages: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
  },
  { _id: false }
);

const productSchema = new Schema<IProduct>(
  {
    productCode: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    subCategory: { type: String, required: true, uppercase: true },
    itemName: { type: String, required: true },
    skinType: { type: String },
    price: { type: Number, required: true },
    oldPrice: { type: Number },
    discount: { type: String },
    isDiscountDisabled: { type: Boolean, default: false }, // 👈 ডিফল্ট ফলস থাকবে
    description: { type: String, required: true },          // 👈 রিকোয়ার্ড করা হলো
    howToUse: { type: String },                             // 👈 অপশনাল রাখা হলো
    rating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    salesCount: { type: Number, default: 0 },
    promotion: { type: String, enum: ['Best Sellers', 'New Arrivals', 'Trending'] },
    availability: { type: String, enum: ['In Stock', 'Out of Stock'], default: 'In Stock' },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    commonImages: [{ type: String, required: true }],
    weightOrVolume: { type: Number, required: true },
    unit: { type: String, enum: ['gm', 'ml', 'pcs'], required: true },
    shades: { type: [productShadeSchema], default: undefined }
  },
  { timestamps: true }
);

export const Product = model<IProduct>('Product', productSchema);