import { Schema, model } from 'mongoose';
import { IProduct, IProductShade } from './product.interface';

const productShadeSchema = new Schema<IProductShade>(
  {
    shadeName: { type: String, required: true },
    shadeColorCode: { type: String },
    shadeImage: { type: String }, // ক্লাউডিনারি URL এখানে সেভ হবে
    isActive: { type: Boolean, default: true }
  },
  { _id: false }
);

const productSchema = new Schema<IProduct>(
  {
    productCode: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    subCategory: { type: String, required: true },
    skinType: { type: String },
    price: { type: Number, required: true },
    oldPrice: { type: Number },
    discount: { type: String },
    rating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    salesCount: { type: Number, default: 0 },
    promotion: { type: String, enum: ['Best Sellers', 'New Arrivals', 'Trending'] },
    availability: { type: String, enum: ['In Stock', 'Out of Stock'], default: 'In Stock' },
    images: [{ type: String, required: true }],
    weightOrVolume: { type: Number, required: true },
    unit: { type: String, enum: ['gm', 'ml'], required: true },
    shades: [productShadeSchema]
  },
  { timestamps: true }
);

export const Product = model<IProduct>('Product', productSchema);