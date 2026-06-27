import { IDeliveryCharge } from './deliveryCharge.interface';
import { DeliveryCharge } from './deliveryCharge.model';

const createZone = async (payload: IDeliveryCharge) => {
  return await DeliveryCharge.create(payload);
};

const getAllZones = async () => {
  return await DeliveryCharge.find().sort({ createdAt: -1 });
};

const updateZone = async (id: string, payload: Partial<IDeliveryCharge>) => {
  return await DeliveryCharge.findByIdAndUpdate(id, { $set: payload }, { new: true });
};

const deleteZone = async (id: string) => {
  return await DeliveryCharge.findByIdAndDelete(id);
};

// 🎯 ফিক্সড ক্যালকুলেশন লজিক: সিটি যদি 'dhaka' হয় তবে inside, অন্য সব ক্ষেত্রে outside
const calculateChargeForCity = async (userCity: string) => {
  const normalizedCity = userCity.toLowerCase().trim();
  
  // ইউজার সিটি ঢাকা হলে 'inside' জোন খুঁজবে, না হলে 'outside' জোন খুঁজবে
  const targetZoneType = normalizedCity === 'dhaka' ? 'inside' : 'outside';

  let deliveryZone = await DeliveryCharge.findOne({
    zoneType: targetZoneType,
    isActive: true,
  });

  // ডাটাবেজে জোন কনফিগার করা না থাকলে সেফটি ফলব্যাক চার্জ
  if (!deliveryZone) {
    const fallbackCharge = targetZoneType === 'inside' ? 60 : 120;
    return { 
      charge: fallbackCharge, 
      zoneName: targetZoneType === 'inside' ? 'Inside Dhaka (Fallback)' : 'Outside Dhaka (Fallback)' 
    };
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