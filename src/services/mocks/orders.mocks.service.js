import { generateMockOrders } from "../../mocks/orders.mocks.js";
import { ordersService } from "../orders.service.js";

export const ordersMocksService = {
    getMockOrders: async (quantity = 1) => {
        return generateMockOrders(quantity);
    },

    createMockOrders: async (quantity = 5) => {
        const mockOrders = await generateMockOrders(quantity);
        const createdOrders = [];

        for (const orderData of mockOrders) {
            const createdOrder = await ordersService.createOrder(orderData);
            createdOrders.push(createdOrder);
        }

        return createdOrders;
    }
};