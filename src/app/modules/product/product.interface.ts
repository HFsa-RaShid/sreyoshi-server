import { Document, Types } from 'mongoose';

export interface IProductShade {
  shadeName: string;
  shadeColorCode: string;
  shadeImage: string; 
  stock: number;      
  status: 'Active' | 'Inactive'; 
}

export interface IProduct extends Document {
  productCode: string;
  name: string;
  category: Types.ObjectId;
  brand: Types.ObjectId;
  subCategory: string;
  itemName: string;
  skinType?: string;
  price: number;
  oldPrice?: number;
  discount?: string;
  isDiscountDisabled: boolean; 
  description: string;         
  howToUse?: string;           
  rating: number;
  ratingCount: number;
  salesCount: number;
  promotion?: 'Best Sellers' | 'New Arrivals' | 'Trending';
  availability: 'In Stock' | 'Out of Stock';
  status: 'Active' | 'Inactive';
  commonImages: string[]; 
  weightOrVolume: number;
  unit: 'gm' | 'ml' | 'pcs';
  totalStock: number; // মেইন প্রোডাক্টের স্টক (ইউজার ইনপুট দিবে)
  shades?: IProductShade[];
  createdAt?: string;
  updatedAt?: string;
}