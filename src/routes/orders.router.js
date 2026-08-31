import { Router } from "express";
import { getOrders, 
        getOrderById, 
        createOrder,
        updateOrder,  
        deleteOrder,
        uploadOrderProof } from "../controllers/orders.controller.js";
import { uploadOrderProof as uploadOrderProofFile } from "../middlewares/upload.middleware.js";

const router = Router();

router.get("/", getOrders);

router.get("/:oid", getOrderById);

router.post("/", createOrder);

router.post("/:oid/proof", uploadOrderProofFile, uploadOrderProof);

router.put("/:oid", updateOrder);

router.delete("/:oid", deleteOrder);

export default router;