import { ordersMocksService } from "../../services/mocks/orders.mocks.service.js";

export const getMockingOrders = async (req, res) => {
    try {
        const quantity = Number(req.query.quantity) || 1;
        const orders = await ordersMocksService.getMockOrders(quantity);

        res.status(200).json({
            status: "success",
            payload: orders
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

export const generateOrders = async (req, res) => {
    try {
        
        if (!req.body || typeof req.body !== "object") {
            return res.status(400).json({
                status: "error",
                message: "El body de la petición es obligatorio y debe ser JSON"
            });
        }

        const { orders = 1 } = req.body;
        const quantity = Number(orders) || 1;

        const createdOrders = await ordersMocksService.createMockOrders(quantity);

        res.status(201).json({
            status: "success",
            payload: {
                orders: createdOrders.length
            }
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};