import { Types } from 'mongoose';

export interface IReview {
  user: Types.ObjectId;
  product: Types.ObjectId;
  rating: number;
  comment: string;
  status: 'Active' | 'Inactive'; 
}