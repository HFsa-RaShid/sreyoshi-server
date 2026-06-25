import { Schema, model } from 'mongoose';
import { IDeliveryCharge, DeliveryChargeModel } from './deliveryCharge.interface';

const deliveryChargeSchema = new Schema<IDeliveryCharge, DeliveryChargeModel>(
  {
    zoneName: { type: String, required: true, unique: true, trim: true },
    zoneType: { type: String, enum: ['inside', 'outside', 'specific-city'], required: true },
    cities: { type: [String], default: [] }, // Array of city names normalized to lowercase
    charge: { type: Number, required: true, min: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// সেভ করার আগে সিটিগুলোর নাম lowercase করে নেওয়া হচ্ছে
deliveryChargeSchema.pre('save', function () {
  if (this.cities && this.cities.length > 0) {
    this.cities = this.cities.map((city) => city.toLowerCase().trim());
  }

});

export const DeliveryCharge = model<IDeliveryCharge, DeliveryChargeModel>(
  'DeliveryCharge',
  deliveryChargeSchema
);