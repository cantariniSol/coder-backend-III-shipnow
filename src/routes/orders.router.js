import { Router } from "express";
import OrderModel from "../models/orders.model.js";
import UserModel from "../models/users.model.js";
import { getOrders, 
        getOrderById, 
        createOrder,
        updateOrder,  
        deleteOrder } from "../controllers/orders.controller.js";

const router = Router();

router.get("/", getOrders);

router.get("/:oid", getOrderById);

router.post("/", createOrder);

router.put("/:oid", updateOrder);

router.delete("/:oid", deleteOrder);

export default router;