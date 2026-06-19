import { Request, Response } from "express";
import { PaymentServices } from "./payment.service";

const paymentSuccess = async (req: Request, res: Response) => {
  try {
    // SSLCommerz থেকে অনেক সময় ডাটা body-তেও আসতে পারে (tran_id হিসেবে)
    const transactionId = (req.query.transactionId || req.body.tran_id) as string;

    if (!transactionId) {
      throw new Error("Transaction ID missing in success response");
    }

    await PaymentServices.verifyPaymentAndUpdateOrder(transactionId);

    // সফল হলে ফ্রন্টএন্ডের সাকসেসফুল পেজে রিডাইরেক্ট করবে
    res.redirect(`${process.env.CLIENT_URL}/payment/success?status=success&id=${transactionId}`);
  } catch (error: any) {
    res.redirect(`${process.env.CLIENT_URL}/payment/fail?message=${encodeURIComponent(error.message)}`);
  }
};

const paymentFail = async (req: Request, res: Response) => {
  try {
    const transactionId = (req.query.transactionId || req.body.tran_id) as string;
    
    if (transactionId) {
      // পেমেন্ট না করায় বা ফেইল হওয়ায় ডাটাবেজ থেকে অর্ডারটি সরাসরি ডিলিট করে দেওয়া হচ্ছে
      await PaymentServices.failPaymentAndDeleteOrder(transactionId);
    }
    
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