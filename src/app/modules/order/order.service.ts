import { Order } from "./order.model";
import { IOrder } from "./order.interface";
import { Product } from "../product/product.model"; 
import { DeliveryCharge } from "../deliveryCharge/deliveryCharge.model"; // 🎯 পাথ প্রজেক্ট অনুযায়ী চেক করে নিন

// 1. [C]REATE: স্টক ডিডাকশন ও ইনসাইড/আউটসাইড ডেলিভারি লজিকসহ অর্ডার তৈরি
const createOrderIntoDB = async (orderData: Partial<IOrder>) => {
  const { orderItems, shippingAddress, totalPrice: productTotal } = orderData;

  if (!orderItems || orderItems.length === 0) {
    throw new Error("Order items cannot be empty.");
  }
  if (!shippingAddress?.city) {
    throw new Error("Shipping city is required to calculate delivery charge.");
  }

  // সিটির নামকে নরমালইজ করা (সব ছোট হাতের অক্ষর ও স্পেস ট্রিম করা)
  const customerCity = shippingAddress.city.toLowerCase().trim();

  // 🎯 ১. সহজ ডেলিভারি চার্জ ক্যালকুলেশন লজিক (Inside / Outside)
  // সিটি 'dhaka' হলে জোন টাইপ হবে 'inside', অন্য সব ক্ষেত্রে 'outside'
  const targetZoneType = customerCity === "dhaka" ? "inside" : "outside";

  let matchedZone = await DeliveryCharge.findOne({
    zoneType: targetZoneType,
    isActive: true,
  });

  // যদি ডাটাবেজে কোনো রুল না পাওয়া যায়, তবে ব্যাকআপ হিসেবে ফলব্যাক চার্জ (Inside: 60, Outside: 120)
  const deliveryCost = matchedZone ? matchedZone.charge : (targetZoneType === "inside" ? 60 : 120);

  // গ্র্যান্ড টোটাল = কার্টের প্রোডাক্টের দাম (Subtotal) + ডেলিভারি চার্জ
  const finalGrandTotal = (productTotal || 0) + deliveryCost;


  // ২. ট্রিপল গার্ড চেক: স্টক পর্যাপ্ত আছে কিনা নিশ্চিত করা
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
      throw new Error(`Sorry, "${product.name}" only has ${availableStock} units left.`);
    }
  }


  // ৩. স্টক মাইনাস করা
  for (const item of orderItems) {
    if (item.shadeName && item.shadeName !== "NoShade") {
      // শেড অনুযায়ী স্টক মাইনাস
      await Product.updateOne(
        { _id: item.product, "shades.shadeName": item.shadeName },
        { $inc: { "shades.$.stock": -item.quantity } }
      );
      // প্রোডাক্টের ওভারঅল টোটাল স্টক মাইনাস
      await Product.updateOne(
        { _id: item.product },
        { $inc: { totalStock: -item.quantity } }
      );
    } else {
      // শেড না থাকলে শুধু মেইন টোটাল স্টক মাইনাস
      await Product.updateOne(
        { _id: item.product },
        { $inc: { totalStock: -item.quantity } }
      );
    }

    // ৪. স্টক পরিবর্তনের পর availability অটো-আপডেট করা (In Stock / Out of Stock)
    const updatedProduct = await Product.findById(item.product);
    if (updatedProduct) {
      updatedProduct.availability = updatedProduct.totalStock > 0 ? "In Stock" : "Out of Stock";
      await updatedProduct.save();
    }
  }

  // 🎯 পেলোডে লাইভ ক্যালকুলেটেড ডাটা এবং গ্র্যান্ড টোটাল অ্যাসাইন করা
  orderData.deliveryCharge = deliveryCost;
  orderData.totalPrice = finalGrandTotal;

  // ফাইনাল অর্ডার ডাটাবেজে ক্রিয়েট করা
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
  return await Order.findByIdAndUpdate(id, { $set: payload }, { new: true, runValidators: true });
};

// 5. [D]ELETE: অর্ডার ডিলিট করা
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