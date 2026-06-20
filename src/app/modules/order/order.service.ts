import { Order } from "./order.model";
import { IOrder } from "./order.interface";
import { Product } from "../product/product.model"; // 💡 আপনার প্রজেক্টের সঠিক পাথ দিন

const createOrderIntoDB = async (orderData: Partial<IOrder>) => {
  const { orderItems } = orderData;

  if (!orderItems || orderItems.length === 0) {
    throw new Error("Order items cannot be empty.");
  }

  // ১. ট্রিপল গার্ড চেক: ডাটাবেজ লেভেলে স্টক পর্যাপ্ত আছে কিনা নিশ্চিত করা
  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (!product) throw new Error("One of the products in your cart no longer exists!");

    let availableStock = 0;

    if (item.shadeName && item.shadeName !== "NoShade") {
      const shade = product.shades?.find((s) => s.shadeName === item.shadeName);
      availableStock = shade ? shade.stock : 0;
    } else {
      availableStock = product.totalStock;
    }

    if (item.quantity > availableStock) {
      throw new Error(`Sorry, "${product.name}" only has ${availableStock} units left. Please adjust your cart.`);
    }
  }

  // ২. স্টক মাইনাস করা (শেড থাকলে শেডের স্টক, না থাকলে মেইন টোটাল স্টক কমবে)
  for (const item of orderItems) {
    if (item.shadeName && item.shadeName !== "NoShade") {
      // নির্দিষ্ট শেডের স্টক মাইনাস করা
      await Product.updateOne(
        { _id: item.product, "shades.shadeName": item.shadeName },
        { $inc: { "shades.$.stock": -item.quantity } }
      );
      
      // 💡 শেডের স্টক কমানোর পর মেইন প্রোডাক্টের totalStock-ও সিঙ্ক করে কমানো লাগবে
      await Product.updateOne(
        { _id: item.product },
        { $inc: { totalStock: -item.quantity } }
      );
    } else {
      // রেগুলার নো-শেড প্রোডাক্টের মেইন স্টক মাইনাস করা
      await Product.updateOne(
        { _id: item.product },
        { $inc: { totalStock: -item.quantity } }
      );
    }

    // ৩. স্টক পরিবর্তনের পর প্রোডাক্টের 'availability' স্ট্যাটাস অটো-আপডেট করা
    const updatedProduct = await Product.findById(item.product);
    if (updatedProduct) {
      updatedProduct.availability = updatedProduct.totalStock > 0 ? "In Stock" : "Out of Stock";
      await updatedProduct.save();
    }
  }

  // ৪. সফলভাবে স্টক ডিডাক্ট করার পর অর্ডার ডাটাবেজে তৈরি করা
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