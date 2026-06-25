import { IDeliveryCharge } from './deliveryCharge.interface';
import { DeliveryCharge } from './deliveryCharge.model';

const createZone = async (payload: IDeliveryCharge) => {
  return await DeliveryCharge.create(payload);
};

const getAllZones = async () => {
  return await DeliveryCharge.find().sort({ createdAt: -1 });
};

const updateZone = async (id: string, payload: Partial<IDeliveryCharge>) => {
  if (payload.cities) {
    payload.cities = payload.cities.map((c) => c.toLowerCase().trim());
  }
  return await DeliveryCharge.findByIdAndUpdate(id, { $set: payload }, { new: true });
};

const deleteZone = async (id: string) => {
  return await DeliveryCharge.findByIdAndDelete(id);
};

// 🎯 চেকআউট পেজের জন্য ক্যালকুলেশন লজিক
const calculateChargeForCity = async (userCity: string) => {
  const normalizedCity = userCity.toLowerCase().trim();

  // ১. প্রথমে চেক করব স্পেসিফিক কোনো সিটির ভেতর এই সিটি অ্যাসাইন করা আছে কি না
  let deliveryZone = await DeliveryCharge.findOne({
    isActive: true,
    cities: normalizedCity,
  });

  // ২. যদি স্পেসিফিক ম্যাচ না পায়, তবে টাইপ অনুযায়ী জোন খুঁজবে
  if (!deliveryZone) {
    deliveryZone = await DeliveryCharge.findOne({
      isActive: true,
      zoneType: 'outside',
    });
  }

  // ৩. যদি তাও না পায় (ব্যাকআপ হিসেবে ফালব্যাক চার্জ)
  if (!deliveryZone) {
    return { charge: 120, zoneName: 'Standard Delivery' }; // Fallback charge
  }

  return {
    charge: deliveryZone.charge,
    zoneName: deliveryZone.zoneName,
  };
};

export const DeliveryChargeService = {
  createZone,
  getAllZones,
  updateZone,
  deleteZone,
  calculateChargeForCity,
};