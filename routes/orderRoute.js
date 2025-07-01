import express from "express";
import { listOrders, placeOrder, updateStatus, userOrders, verifyOrder } from "../controllers/orderController.js";
import authMiddleware from "../middlewares/auth.js";

const orderRouter = express.Router();

orderRouter.post('/place-order', authMiddleware, placeOrder);
orderRouter.post('/verify-order', authMiddleware, verifyOrder);
orderRouter.post('/user-order', authMiddleware, userOrders);
orderRouter.get('/list-order', authMiddleware, listOrders);
orderRouter.post('/update-status', authMiddleware, updateStatus);

export default orderRouter;