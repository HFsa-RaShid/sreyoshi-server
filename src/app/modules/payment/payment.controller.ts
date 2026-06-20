import { Request, Response } from "express";
import { PaymentServices } from "./payment.service";

const paymentSuccess = async (req: Request, res: Response) => {
  try {
  
    const transactionId = (req.query.transactionId || req.body.tran_id) as string;

    if (!transactionId) {
      throw new Error("Transaction ID missing in success response");
    }

    await PaymentServices.verifyPaymentAndUpdateOrder(transactionId);


    res.redirect(`${process.env.CLIENT_URL}/payment/success?status=success&id=${transactionId}`);
  } catch (error: any) {
    res.redirect(`${process.env.CLIENT_URL}/payment/fail?message=${encodeURIComponent(error.message)}`);
  }
};

const paymentFail = async (req: Request, res: Response) => {
  try {
    const transactionId = (req.query.transactionId || req.body.tran_id) as string;
    
    if (transactionId) {
      
      await PaymentServices.failPaymentAndDeleteOrder(transactionId);
    }
    
  
    res.redirect(`${process.env.CLIENT_URL}/payment/fail?status=failed`);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const PaymentControllers = {
  paymentSuccess,
  paymentFail,
};