import { IShadeManagement } from './shade.interface';
import { ShadeManagement } from './shade.model';
import { uploadToCloudinary } from '../../utils/uploadConfig';

const createShadeConfigIntoDB = async (payload: IShadeManagement, files?: Express.Multer.File[]) => {
  // ফ্রন্টএন্ড থেকে আসা রিয়েল ফাইল অবজেক্টগুলোকে সিরিয়ালি ক্লাউডিনারিতে আপলোড করে URL বসানো
  if (files && files.length > 0 && payload.availableShades) {
    for (let i = 0; i < payload.availableShades.length; i++) {
      if (files[i]) {
        const imageUrl = await uploadToCloudinary(files[i]);
        payload.availableShades[i].shadeImage = imageUrl; // base64 এর পরিবর্তে আসল ক্লাউডিনারি লিংক এসাইন হচ্ছে
      }
    }
  }
  return await ShadeManagement.create(payload);
};

const getAllShadeConfigsFromDB = async (query: Record<string, any> = {}) => {
  return await ShadeManagement.find(query).populate('category');
};

const getSingleShadeConfigFromDB = async (id: string) => {
  return await ShadeManagement.findById(id).populate('category');
};

const updateShadeConfigInDB = async (id: string, payload: Partial<IShadeManagement>, files?: Express.Multer.File[]) => {
  // আপডেটের সময় নতুন কোনো ইমেজ ফাইল আপলোড করা হলে তার ক্লাউডিনারি প্রসেসিং
  if (files && files.length > 0 && payload.availableShades) {
    for (let i = 0; i < payload.availableShades.length; i++) {
      if (files[i]) {
        const imageUrl = await uploadToCloudinary(files[i]);
        payload.availableShades[i].shadeImage = imageUrl;
      }
    }
  }
  return await ShadeManagement.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
};

const deleteShadeConfigFromDB = async (id: string) => {
  return await ShadeManagement.findByIdAndDelete(id);
};

export const ShadeServices = {
  createShadeConfigIntoDB,
  getAllShadeConfigsFromDB,
  getSingleShadeConfigFromDB,
  updateShadeConfigInDB,
  deleteShadeConfigFromDB
};