import { Schema, model } from 'mongoose';
import { IShopSettings } from './shopSettings.interface';

const shopSettingsSchema = new Schema<IShopSettings>(
  {
    websiteName: { type: String, required: true, default: '' },
    websiteTitle: {type: String, default: '',},
    logo: { type: String, default: '' },
    email: { type: String, required: true, default: '' },
    phone: { type: String, required: true, default: '' },
    address: { type: String, required: true, default: '' },
    mapEmbedUrl: { type: String, default: '' },
    aboutUs: { type: String, default: '' },
    ourStory: { type: String, default: '' },
    privacyPolicy: { type: String, default: '' },
    termsConditions: { type: String, default: '' },
    refundPolicy: { type: String, default: '' },
    facebookUrl: { type: String, default: '' },
    instagramUrl: { type: String, default: '' },
    youtubeUrl: { type: String, default: '' },
    linkedinUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

export const ShopSettings = model<IShopSettings>('ShopSettings', shopSettingsSchema);