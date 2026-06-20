import { Schema, model } from 'mongoose';
import { IProduct, IProductShade } from './product.interface';

const productShadeSchema = new Schema<IProductShade>(
  {
    shadeName: { type: String, required: true },
    shadeColorCode: { type: String },
    shadeImage: { type: String, default: "" }, // required বাদ দেওয়া হয়েছে
    stock: { type: Number, default: 1 },       // required বাদ দিয়ে ডিফল্ট ০
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
  },
  { _id: false }
);

const productSchema = new Schema<IProduct>(
  {
    productCode: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    brand: { type: Schema.Types.ObjectId, ref: 'Brand', required: true },
    subCategory: { type: String, required: true, uppercase: true },
    itemName: { type: String, required: true },
    skinType: { type: String },
    price: { type: Number, required: true },
    oldPrice: { type: Number },
    discount: { type: String },
    isDiscountDisabled: { type: Boolean, default: false }, 
    description: { type: String, required: true },          
    howToUse: { type: String },                             
    rating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    salesCount: { type: Number, default: 0 },
    promotion: { type: String, enum: ['Best Sellers', 'New Arrivals', 'Trending'] },
    availability: { type: String, enum: ['In Stock', 'Out of Stock'], default: 'In Stock' },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    commonImages: [{ type: String, required: true }],
    weightOrVolume: { type: Number, required: true },
    unit: { type: String, enum: ['gm', 'ml', 'pcs'], required: true },
    totalStock: { type: Number, required: true, default: 0 },
    shades: { type: [productShadeSchema], default: undefined }
  },
  { timestamps: true }
);

export const Product = model<IProduct>('Product', productSchema);