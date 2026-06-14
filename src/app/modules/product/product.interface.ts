import { Types } from 'mongoose';

export type IProduct = {
  productCode: string; // আপনার রিকোয়ারমেন্ট অনুযায়ী ইউনিক কোড (যেমন: "p1")
  name: string;
  category: Types.ObjectId; // Category মডিউলের _id এর সাথে রেফারেন্স (Relation)
  subCategory: string;
  skinType?: string;
  price: number;
  oldPrice?: number;
  discount?: string;
  rating: number;
  ratingCount: number;
  salesCount: number;
  promotion?: 'Best Sellers' | 'New Arrivals' | 'Trending';
  availability: 'In Stock' | 'Out of Stock';
  images: string[];
};