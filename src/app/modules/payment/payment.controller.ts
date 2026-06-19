import { Request, Response } from "express";
import { PaymentServices } from "./payment.service";

const paymentSuccess = async (req: Request, res: Response) => {
  try {
    const { transactionId } = req.query;

    await PaymentServices.verifyPaymentAndUpdateOrder(transactionId as string);

    // সফল হলে ক্লায়েন্ট সাইড/ফ্রন্টএন্ডের সাকসেসফুল পেজে পাঠিয়ে দেবে
    res.redirect(`${process.env.CLIENT_URL}/payment/success?status=success&id=${transactionId}`);
  } catch (error: any) {
    res.redirect(`${process.env.CLIENT_URL}/payment/fail?message=${error.message}`);
  }
};

const paymentFail = async (req: Request, res: Response) => {
  try {
    const { transactionId } = req.query;
    await PaymentServices.failPaymentAndUpdateOrder(transactionId as string);
    
    // ব্যর্থ হলে ফ্রন্টএন্ডের ফেইল পেজে রিডাইরেক্ট করবে
    res.redirect(`${process.env.CLIENT_URL}/payment/fail?status=failed`);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const PaymentControllers = {
  paymentSuccess,
  paymentFail,
};