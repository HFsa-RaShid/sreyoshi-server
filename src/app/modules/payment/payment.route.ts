import express from "express";
import { PaymentControllers } from "./payment.controller";

const router = express.Router();

// SSLCommerz থেকে পেমেন্ট প্রসেস শেষে ডেটাসহ POST রিকোয়েস্টে ব্যাক করা হয়
router.post("/success", PaymentControllers.paymentSuccess);
router.post("/fail", PaymentControllers.paymentFail);

export const PaymentRoutes = router;