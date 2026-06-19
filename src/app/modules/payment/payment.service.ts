import SSLCommerzPayment from "sslcommerz-lts";
import { Order } from "../order/order.model";

const store_id = process.env.STORE_ID || "your_store_id";
const store_passwd = process.env.STORE_PASSWD || "your_store_password";
const is_live = process.env.NODE_ENV === "production"; 

const initSSLCommerzPayment = async (orderData: any, transactionId: string) => {
  const data = {
    total_amount: orderData.totalPrice,
    currency: "BDT",
    tran_id: transactionId,
    // সেন্ট্রাল রাউটের প্রিফিক্স (যেমন /api) থাকলে তা মিলিয়ে ইউআরএল চেক করে নেবেন
    success_url: `${process.env.BACKEND_URL}/payments/success?transactionId=${transactionId}`,
    fail_url: `${process.env.BACKEND_URL}/payments/fail?transactionId=${transactionId}`,
    cancel_url: `${process.env.BACKEND_URL}/payments/fail?transactionId=${transactionId}`,
    ipn_url: `${process.env.BACKEND_URL}/payments/ipn`,
    shipping_method: "Courier",
    product_name: "E-commerce Products",
    product_category: "Cosmetics",
    product_profile: "general",
    cus_name: orderData.shippingAddress.name,
    cus_email: orderData.shippingAddress.email || "customer@mail.com",
    cus_add1: orderData.shippingAddress.address,
    cus_city: orderData.shippingAddress.city,
    cus_country: "Bangladesh",
    cus_phone: orderData.shippingAddress.phone,
    ship_name: orderData.shippingAddress.name,
    ship_add1: orderData.shippingAddress.address,
    ship_city: orderData.shippingAddress.city,
    ship_state: orderData.shippingAddress.city,
    ship_postcode: 1000,
    ship_country: "Bangladesh",
  };

  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
  const apiResponse = await sslcz.init(data);
  return apiResponse;
};

// 🟢 পেমেন্ট সফল হলে অর্ডারের স্ট্যাটাস 'Paid' করা
const verifyPaymentAndUpdateOrder = async (transactionId: string) => {
  const order = await Order.findOne({ transactionId });
  if (!order) throw new Error("Order not found");

  order.paymentStatus = "Paid";
  order.orderStatus = "Processing";
  await order.save();
  return order;
};

// 🔴 পেমেন্ট ফেইল বা ক্যানসেল হলে ডাটাবেজ থেকে অর্ডার চিরতরে ডিলিট করা
const failPaymentAndDeleteOrder = async (transactionId: string) => {
  return await Order.findOneAndDelete({ transactionId });
};

export const PaymentServices = {
  initSSLCommerzPayment,
  verifyPaymentAndUpdateOrder,
  failPaymentAndDeleteOrder, // আপডেট করা ফাংশন
};