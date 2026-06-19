import { Document } from 'mongoose';


export interface IBrand {
  name: string;
  slug: string;
  logo?: string;
  status: 'Active' | 'Inactive';
}


export interface IBrandDocument extends IBrand, Document {
  createdAt: Date;
  updatedAt: Date;
}