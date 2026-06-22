import { Order } from "./order.model";
import { IOrder } from "./order.interface";
import { Product } from "../product/product.model"; // আপনার প্রজেক্টের সঠিক পাথ দিন

// 1. [C]REATE: স্টক ডিডাকশন লজিকসহ অর্ডার তৈরি
const createOrderIntoDB = async (orderData: Partial<IOrder>) => {
  const { orderItems } = orderData;

  if (!orderItems || orderItems.length === 0) {
    throw new Error("Order items cannot be empty.");
  }

  // ১. ট্রিপল গার্ড চেক: স্টক পর্যাপ্ত আছে কিনা নিশ্চিত করা
  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (!product) throw new Error("One of the products in your cart no longer exists!");

    let availableStock = 0;

    if (item.shadeName && item.shadeName !== "NoShade") {
      const shade = product.shades?.find((s: any) => s.shadeName === item.shadeName);
      availableStock = shade ? shade.stock : 0;
    } else {
      availableStock = product.totalStock;
    }

    if (item.quantity > availableStock) {
      throw new Error(`Sorry, "${product.name}" only has ${availableStock} units left. Please adjust your cart.`);
    }
  }

  // ২. স্টক মাইনাস করা
  for (const item of orderItems) {
    if (item.shadeName && item.shadeName !== "NoShade") {
      await Product.updateOne(
        { _id: item.product, "shades.shadeName": item.shadeName },
        { $inc: { "shades.$.stock": -item.quantity } }
      );
      await Product.updateOne(
        { _id: item.product },
        { $inc: { totalStock: -item.quantity } }
      );
    } else {
      await Product.updateOne(
        { _id: item.product },
        { $inc: { totalStock: -item.quantity } }
      );
    }

    // ৩. স্টক পরিবর্তনের পর availability অটো-আপডেট
    const updatedProduct = await Product.findById(item.product);
    if (updatedProduct) {
      updatedProduct.availability = updatedProduct.totalStock > 0 ? "In Stock" : "Out of Stock";
      await updatedProduct.save();
    }
  }

  const result = await Order.create(orderData);
  return result;
};

// 2. [R]EAD: সব অর্ডার দেখা (Admin & Dashboard)
const getAllOrdersFromDB = async () => {
  return await Order.find().populate("orderItems.product").sort({ createdAt: -1 });
};

// 3. [R]EAD: নির্দিষ্ট একটি অর্ডার দেখা (Order Details)
const getSingleOrderFromDB = async (id: string) => {
  return await Order.findById(id).populate("orderItems.product");
};

// 4. [U]PDATE: অর্ডার ও পেমেন্ট স্ট্যাটাস আপডেট করা (Admin / Automation)
const updateOrderInDB = async (id: string, payload: Partial<IOrder>) => {
  return await Order.findByIdAndUpdate(
    id,
    { $set: payload },
    { new: true, runValidators: true }
  );
};

// 5. [D]ELETE: ক্যানসেল বা ভুল অর্ডার ডেটা রিমুভ করা (Admin Only)
const deleteOrderFromDB = async (id: string) => {
  return await Order.findByIdAndDelete(id);
};

export const OrderServices = {
  createOrderIntoDB,
  getAllOrdersFromDB,
  getSingleOrderFromDB,
  updateOrderInDB,
  deleteOrderFromDB,
};