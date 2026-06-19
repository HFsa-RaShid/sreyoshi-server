import { Order } from "./order.model";
import { IOrder } from "./order.interface";

const createOrderIntoDB = async (orderData: Partial<IOrder>) => {
  const result = await Order.create(orderData);
  return result;
};

const getAllOrdersFromDB = async () => {
  const result = await Order.find().populate("orderItems.product");
  return result;
};

const getSingleOrderFromDB = async (id: string) => {
  const result = await Order.findById(id).populate("orderItems.product");
  return result;
};

export const OrderServices = {
  createOrderIntoDB,
  getAllOrdersFromDB,
  getSingleOrderFromDB,
};