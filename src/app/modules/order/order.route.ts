import express from "express";
import { OrderControllers } from "./order.controller";
import auth from "../../../middlewares/auth";

const router = express.Router();

router.post("/create-order", OrderControllers.createOrder);
router.get("/", auth('admin'), OrderControllers.getAllOrders);
router.get("/:id", OrderControllers.getSingleOrder);

router.patch("/:id", auth('admin'), OrderControllers.updateOrder);
router.delete("/:id", auth('admin'), OrderControllers.deleteOrder);

export const OrderRoutes = router;