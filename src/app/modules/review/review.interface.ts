import { Types } from 'mongoose';

export interface IReview {
  user: Types.ObjectId;      // User মডেল থেকে আসবে
  product: Types.ObjectId;   // Product মডেল থেকে আসবে
  rating: number;            // ১ থেকে ৫ এর মধ্যে
  comment: string;
}