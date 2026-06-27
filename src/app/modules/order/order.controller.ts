import { Request, Response } from "express";
import { OrderServices } from "./order.service";
import { PaymentServices } from "../payment/payment.service";

const createOrder = async (req: Request, res: Response) => {
  try {
    const orderData = req.body;
    const transactionId = `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    
    // সার্ভিস লেয়ার থেকে ডেলিভারি চার্জসহ ফাইনাল অর্ডার অবজেক্ট জেনারেট হচ্ছে
    const order = await OrderServices.createOrderIntoDB({
      ...orderData,
      transactionId,
    });

    if (orderData.paymentMethod === "COD") {
      return res.status(201).json({
        success: true,
        message: "Order placed successfully with Cash on Delivery",
        data: { order, paymentMethod: "COD", redirectUrl: null },
      });
    }

    if (orderData.paymentMethod === "SSLCommerz") {
      // 🎯 SSLCommerz-এ পাঠানোর সময় ডেলিভারি চার্জসহ আপডেট হওয়া ফাইনাল totalPrice পাঠানো হলো
      const sslPayload = {
        ...orderData,
        totalPrice: order.totalPrice, 
      };

      const paymentSession = await PaymentServices.initSSLCommerzPayment(sslPayload, transactionId);
      
      if (paymentSession?.GatewayPageURL) {
        return res.status(200).json({
          success: true,
          message: "SSLCommerz session generated",
          data: {
            order,
            paymentMethod: "SSLCommerz",
            redirectUrl: paymentSession.GatewayPageURL,
          },
        });
      } else {
        throw new Error("Failed to create SSLCommerz payment session");
      }
    }

    throw new Error("Invalid payment method selected");
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getAllOrders = async (req: Request, res: Response) => {
  try {
    const result = await OrderServices.getAllOrdersFromDB();
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSingleOrder = async (req: Request, res: Response) => {
  try {
    const result = await OrderServices.getSingleOrderFromDB(req.params.id as string);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateOrder = async (req: Request, res: Response) => {
  try {
    const result = await OrderServices.updateOrderInDB(req.params.id as string, req.body);
    res.status(200).json({ success: true, message: "Order updated successfully!", data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteOrder = async (req: Request, res: Response) => {
  try {
    await OrderServices.deleteOrderFromDB(req.params.id as string);
    res.status(200).json({ success: true, message: "Order deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const OrderControllers = {
  createOrder,
  getAllOrders,
  getSingleOrder,
  updateOrder,
  deleteOrder,
};