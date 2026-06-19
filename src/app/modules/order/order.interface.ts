import { Types } from "mongoose";

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
    city: string;
    email?: string;
  };
  totalPrice: number;
  paymentMethod: "COD" | "SSLCommerz";
  paymentStatus: "Pending" | "Paid" | "Failed";
  orderStatus: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  transactionId: string;
}