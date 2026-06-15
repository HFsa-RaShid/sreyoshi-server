import { Types } from 'mongoose';

export type IProductShade = {
  shadeName: string;
  shadeColorCode?: string;
  shadeImage?: string; // ব্যাকএন্ড নিজে ফাইল আপলোড করে এই URLটি বসাবে, তাই এটি ক্রিয়েশনের সময় অপশনাল রাখা হয়েছে
  isActive: boolean;
};

export type IProduct = {
  productCode: string;
  name: string;
  category: Types.ObjectId;
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
  images: string[]; // মেইন ৪টি ছবি
  weightOrVolume: number;
  unit: 'gm' | 'ml';
  shades?: IProductShade[]; // মেকআপ না হলে এটি খালি বা আনডিফাইনড থাকবে
};