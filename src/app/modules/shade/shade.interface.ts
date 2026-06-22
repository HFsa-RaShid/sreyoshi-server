import { Document, Types, Model } from 'mongoose';

export interface IShadeDetails {
  shadeName: string;
  shadeColorCode: string;
  status: 'Active' | 'Inactive'; 
}

export interface IShadeManagement extends Document {
  category: Types.ObjectId;
  subCategory: string;
  itemName: string;
  status: 'Active' | 'Inactive'; 
  availableShades: IShadeDetails[];
}

export type ShadeManagementModel = Model<IShadeManagement, Record<string, unknown>>;