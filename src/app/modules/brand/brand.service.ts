import { Brand, IBrand } from './brand.model';

const createBrandIntoDB = async (payload: Partial<IBrand>) => {
  // নাম থেকে স্লাগ তৈরি (e.g., "L'Oreal Paris" -> "loreal-paris")
  if (payload.name) {
    payload.slug = payload.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  const result = await Brand.create(payload);
  return result;
};

const getAllBrandsFromDB = async () => {
  return await Brand.find().sort({ createdAt: -1 });
};

const getSingleBrandFromDB = async (id: string) => {
  return await Brand.findById(id);
};

const updateBrandInDB = async (id: string, payload: Partial<IBrand>) => {
  if (payload.name) {
    payload.slug = payload.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  return await Brand.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
};

const deleteBrandFromDB = async (id: string) => {
  return await Brand.findByIdAndDelete(id);
};

export const BrandServices = {
  createBrandIntoDB,
  getAllBrandsFromDB,
  getSingleBrandFromDB,
  updateBrandInDB,
  deleteBrandFromDB,
};