import { ordersMocksService } from "../../services/mocks/orders.mocks.service.js";
import { parseMockQuantity } from "../../utils/mocks.validate.js";
import { createError } from "../../errors/createError.js";

export const getMockingOrders = async (req, res, next) => {
    try {
        const quantity = parseMockQuantity(req.query.quantity, 1);
        const orders = await ordersMocksService.getMockOrders(quantity);

        res.status(200).json({
            status: "success",
            payload: orders
        });
    } catch (error) {
        next(error);
    }
};

export const generateOrders = async (req, res, next) => {
    try {
        if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
            throw createError("VALIDATION_ERROR", "El body de la petición es obligatorio y debe ser un objeto JSON");
        }

        const quantity = parseMockQuantity(req.body.orders, 1);
        const createdOrders = await ordersMocksService.createMockOrders(quantity);

        res.status(201).json({
            status: "success",
            payload: {
                orders: createdOrders.length
            }
        });
    } catch (error) {
        next(error);
    }
};