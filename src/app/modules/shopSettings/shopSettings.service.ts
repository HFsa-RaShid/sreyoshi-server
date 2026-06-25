import { IShopSettings } from './shopSettings.interface';
import { ShopSettings } from './shopSettings.model';

export const ShopSettingsService = {
  // ১. ডাটাবেজ থেকে সেটিংস গেট করা বা না থাকলে ডিফল্ট তৈরি করা
  getSettingsFromDB: async () => {
    let settings = await ShopSettings.findOne();
    if (!settings) {
      settings = await ShopSettings.create({
        websiteName: 'Sreyoshi Shop',
        email: 'admin@sreyoshi.com',
        phone: '01700000000',
        address: 'Dhaka, Bangladesh',
      });
    }
    return settings;
  },

  // ২. সেটিংস আপডেট বা নতুন ক্রিয়েট করা (Upsert Logic)
  updateSettingsInDB: async (payload: Partial<IShopSettings>) => {
    let settings = await ShopSettings.findOne();

    if (settings) {
      // ডাটা থাকলে নির্দিষ্ট ID ধরে আপডেট হবে
      settings = await ShopSettings.findByIdAndUpdate(settings._id, payload, {
        new: true,
        runValidators: true,
      });
    } else {
      // ডাটা কোনো কারণে ডিলিট হয়ে থাকলে নতুন ক্রিয়েট হবে
      settings = await ShopSettings.create(payload);
    }
    return settings;
  },

  // ৩. সেটিংস রিসেট করা
  resetSettingsInDB: async () => {
    return await ShopSettings.deleteMany({});
  },
};