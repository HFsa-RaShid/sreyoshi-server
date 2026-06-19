import express from "express";
import { OrderControllers } from "./order.controller";

const router = express.Router();

router.post("/create-order", OrderControllers.createOrder);
router.get("/", OrderControllers.getAllOrders);
router.get("/:id", OrderControllers.getSingleOrder);

export const OrderRoutes = router;