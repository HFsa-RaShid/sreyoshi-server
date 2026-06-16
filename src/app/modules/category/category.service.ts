import { ICategory } from './category.interface';
import { Category } from './category.model';
import { uploadToCloudinary } from '../../utils/uploadConfig';

const createCategoryIntoDB = async (payload: Partial<ICategory>, file?: Express.Multer.File) => {
  if (!file) throw new Error('Category banner image is required!');
  const imageUrl = await uploadToCloudinary(file);
  payload.image = imageUrl;
  return await Category.create(payload);
};

// 🔹 সব ক্যাটাগরি গেট করার সময় (ডাটাবেজে যা আছে হুবহু ফ্রন্টঅ্যান্ডে যাবে, কোনো ফিল্টার হবে না)
const getAllCategoriesFromDB = async () => {
  return await Category.find();
};

// 🔹 সিঙ্গেল ক্যাটাগরি গেট করার সময়
const getSingleCategoryFromDB = async (id: string) => {
  return await Category.findById(id);
};

const updateCategoryInDB = async (id: string, payload: Partial<ICategory>, file?: Express.Multer.File) => {
  if (file) {
    const imageUrl = await uploadToCloudinary(file);
    payload.image = imageUrl;
  }
  return await Category.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
};

const deleteCategoryFromDB = async (id: string) => {
  return await Category.findByIdAndDelete(id);
};

export const CategoryServices = {
  createCategoryIntoDB,
  getAllCategoriesFromDB,
  getSingleCategoryFromDB,
  updateCategoryInDB,
  deleteCategoryFromDB
};