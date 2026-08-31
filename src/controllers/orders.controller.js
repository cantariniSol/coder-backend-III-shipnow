import { ordersService } from "../services/orders.service.js";
import fs from "node:fs/promises";
import logger from "../utils/logger.js";

const removeUploadedFile = async (file) => {
    if (file?.path) {
        await fs.unlink(file.path).catch(() => undefined);
    }
};

export const getOrders = async (req, res, next) => {
    try {
        const orders = await ordersService.getOrders();
        res.json({ status: "success", payload: orders });
    } catch (error) {
        next(error);
    }
};

export const getOrderById = async (req, res, next) => {
    try {
        const order = await ordersService.getOrderById(req.params.oid);
        res.json({ status: "success", payload: order });
    } catch (error) {
        next(error);
    }
};

export const createOrder = async (req, res, next) => {
    try {
        const order = await ordersService.createOrder(req.body);
        res.status(201).json({ status: "success", payload: order });
    } catch (error) {
        next(error);
    }
};

export const updateOrder = async (req, res, next) => {
    try {
        const order = await ordersService.updateOrder(req.params.oid, req.body);
        res.json({ status: "success", payload: order });
    } catch (error) {
        next(error);
    }
};

export const uploadOrderProof = async (req, res, next) => {
    try {
        const order = await ordersService.addProof(req.params.oid, req.file);

        logger.info("Comprobante asociado a pedido", {
            orderId: order._id.toString(),
            filename: order.proof.filename,
        });

        res.status(201).json({ status: "success", payload: order });
    } catch (error) {
        await removeUploadedFile(req.file);
        next(error);
    }
};

export const deleteOrder = async (req, res, next) => {
    try {
        const order = await ordersService.deleteOrder(req.params.oid);
        res.json({ status: "success", payload: order });
    } catch (error) {
        next(error);
    }
};