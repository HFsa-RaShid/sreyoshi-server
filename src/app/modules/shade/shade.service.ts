import { IShadeManagement } from './shade.interface';
import { ShadeManagement } from './shade.model';

const createShadeConfigIntoDB = async (payload: IShadeManagement) => {
  return await ShadeManagement.create(payload);
};

const getAllShadeConfigsFromDB = async () => {
  return await ShadeManagement.find().populate('category');
};

const getSingleShadeConfigFromDB = async (id: string) => {
  return await ShadeManagement.findById(id).populate('category');
};

const updateShadeConfigInDB = async (id: string, payload: Partial<IShadeManagement>) => {
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