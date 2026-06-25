import { Request, Response } from 'express';
import { ShopSettingsService } from './shopSettings.service';
import { uploadToCloudinary } from '../../utils/uploadConfig';

export const ShopSettingsController = {
  getSettings: async (req: Request, res: Response) => {
    try {
      const result = await ShopSettingsService.getSettingsFromDB();
      res.status(200).json({
        success: true,
        message: 'Shop settings fetched successfully!',
        data: result,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  updateSettings: async (req: Request, res: Response) => {
    try {
      const updateData = { ...req.body };

      // 🎯 যদি মেমোরি স্টোরেজে নতুন ফাইল আসে, তবে স্ট্রিম ফাংশনটি রান হবে
      if (req.file) {
        const secureUrl = await uploadToCloudinary(req.file);
        updateData.logo = secureUrl; // ক্লাউডিনারি থেকে পাওয়া আসল লিংক বসানো হলো
      }

      const result = await ShopSettingsService.updateSettingsInDB(updateData);

      res.status(200).json({
        success: true,
        message: 'Shop configurations saved successfully!',
        data: result,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },


  resetSettings: async (req: Request, res: Response) => {
    try {
      await ShopSettingsService.resetSettingsInDB();
      res.status(200).json({
        success: true,
        message: 'Shop settings purged successfully!',
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
};