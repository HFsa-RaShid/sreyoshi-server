import { Schema, model } from 'mongoose';
import { IProduct } from './product.interface';

const productSchema = new Schema<IProduct>(
  {
    productCode: { type: String, required: true, unique: true }, // প্রোডাক্ট কোড ইউনিক হবে
    name: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true }, // Mongoose Relation
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
    images: [{ type: String, required: true }]
  },
  { timestamps: true }
);

export const Product = model<IProduct>('Product', productSchema);