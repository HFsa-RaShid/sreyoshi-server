import { IFaq } from './faq.interface';
import { Faq } from './faq.model';

const createFaqIntoDB = async (payload: IFaq) => {
  return await Faq.create(payload);
};

const getAllFaqsFromDB = async () => {
  
  return await Faq.find();
};

const getSingleFaqFromDB = async (id: string) => {
  return await Faq.findById(id);
};

const updateFaqInDB = async (id: string, payload: Partial<IFaq>) => {
  return await Faq.findByIdAndUpdate(id, payload, { new: true });
};

const deleteFaqFromDB = async (id: string) => {
  return await Faq.findByIdAndDelete(id);
};

export const FaqServices = {
  createFaqIntoDB,
  getAllFaqsFromDB,
  getSingleFaqFromDB,
  updateFaqInDB,
  deleteFaqFromDB,
};