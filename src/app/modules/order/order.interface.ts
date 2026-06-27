import { Types, Model } from "mongoose";

export interface IOrderProduct {
  product: Types.ObjectId;
  quantity: number;
  price: number;
  shadeName?: string;
}

export interface IOrder {
  user?: Types.ObjectId;
  orderItems: IOrderProduct[];
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
    city: string; // e.g., "dhaka", "barishal"
    email?: string;
  };
  deliveryCharge: number; // 🎯 নতুন ফিল্ড: অর্ডারে কত চার্জ ধরা হয়েছে তার ট্র্যাক রাখতে
  totalPrice: number;    // প্রোডাক্ট প্রাইস + ডেলিভারি চার্জ মিলে গ্র্যান্ড টোটাল
  paymentMethod: "COD" | "SSLCommerz";
  paymentStatus: "Pending" | "Paid" | "Failed";
  orderStatus: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  transactionId: string;
  additionalNotes?: string; 
}

export type OrderModel = Model<IOrder, Record<string, unknown>>;