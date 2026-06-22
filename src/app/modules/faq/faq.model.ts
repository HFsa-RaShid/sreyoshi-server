import { Schema, model } from 'mongoose';
import { IFaq, FaqModel } from './faq.interface';

const faqSchema = new Schema<IFaq>(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  },
  { timestamps: true }
);

export const Faq = model<IFaq, FaqModel>('Faq', faqSchema);