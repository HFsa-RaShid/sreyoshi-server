import { Model } from 'mongoose';

export type IFaq = {
  question: string;
  answer: string;
  status: 'Active' | 'Inactive';
};

export type FaqModel = Model<IFaq, Record<string, unknown>>;