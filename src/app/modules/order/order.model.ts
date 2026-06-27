import { Schema, model } from "mongoose";
import { IOrder, OrderModel } from "./order.interface";

const orderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    orderItems: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        shadeName: { type: String },
      },
    ],
    shippingAddress: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
    },
    deliveryCharge: { type: Number, required: true }, // 🎯 স্কিমা আপডেট
    totalPrice: { type: Number, required: true },      // ফাইনাল টোটাল
    paymentMethod: {
      type: String,
      enum: ["COD", "SSLCommerz"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    orderStatus: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    transactionId: { type: String, required: true, unique: true },
    additionalNotes: { type: String },
  },
  { timestamps: true }
);

export const Order = model<IOrder, OrderModel>("Order", orderSchema);