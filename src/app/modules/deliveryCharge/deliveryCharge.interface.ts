import { Model } from 'mongoose';

export type TDeliveryZone = 'inside' | 'outside' | 'specific-city';

export interface IDeliveryCharge {
  zoneName: string; // e.g., "Inside Dhaka", "Barishal City", "Outside Entire Division"
  zoneType: TDeliveryZone;
  cities: string[]; // ['barishal', 'dhaka'] (সব ছোট হাতের অক্ষরে সেভ হবে ম্যাচিং সহজ করার জন্য)
  charge: number;
  isActive: boolean;
}

export type DeliveryChargeModel = Model<IDeliveryCharge, Record<string, never>>;