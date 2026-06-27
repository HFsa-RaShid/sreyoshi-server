import { Schema, model } from 'mongoose';
import { IDeliveryCharge, DeliveryChargeModel } from './deliveryCharge.interface';

const deliveryChargeSchema = new Schema<IDeliveryCharge, DeliveryChargeModel>(
  {
    zoneName: { type: String, required: true, unique: true, trim: true },
    zoneType: { type: String, enum: ['inside', 'outside'], required: true, unique: true }, // এক টাইপের জোন একটাই থাকবে
    charge: { type: Number, required: true, min: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const DeliveryCharge = model<IDeliveryCharge, DeliveryChargeModel>(
  'DeliveryCharge',
  deliveryChargeSchema
);