import { Model } from 'mongoose';

// 🎯 লজিক সহজ করে শুধুমাত্র inside এবং outside রাখা হলো
export type TDeliveryZone = 'inside' | 'outside';

export interface IDeliveryCharge {
  zoneName: string;   // e.g., "Inside Dhaka", "Outside Dhaka"
  zoneType: TDeliveryZone;
  charge: number;
  isActive: boolean;
}

export type DeliveryChargeModel = Model<IDeliveryCharge, Record<string, never>>;