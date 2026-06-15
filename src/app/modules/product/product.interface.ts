import { Document, Types } from 'mongoose';

export interface IProductShade {
  shadeName: string;
  shadeColorCode?: string;
  shadeImage: string; // প্রথম ছবি (শেড ভিত্তিক)
  stock: number;
  status: 'Active' | 'Inactive'; // 👈 প্রতিটি শেডের নিজস্ব ইন্ডিভিজুয়াল স্ট্যাটাস
}

export interface IProduct extends Document {
  productCode: string;
  name: string;
  category: Types.ObjectId;
  subCategory: string;
  itemName: string;
  skinType?: string;
  price: number;
  oldPrice?: number;
  discount?: string;
  rating: number;
  ratingCount: number;
  salesCount: number;
  promotion?: 'Best Sellers' | 'New Arrivals' | 'Trending';
  availability: 'In Stock' | 'Out of Stock';
  status: 'Active' | 'Inactive'; // 👈 মেইন প্রোডাক্টের সম্পূর্ণ ভিজিবিলিটি স্ট্যাটাস
  commonImages: string[]; // বাকি ৩টি ছবি
  weightOrVolume: number;
  unit: 'gm' | 'ml';
  shades?: IProductShade[];
}