import { ordersRepository } from "../repositories/orders.repository.js";
import { productsService } from "./products.service.js";
import { ORDER_STATUS, ORDER_PRIORITY } from "../constants/index.js";

export const ordersService = {
    getOrders: async () => {
        return ordersRepository.findAll();
    },

    getOrderById: async (id) => {
        const order = await ordersRepository.findById(id);
        if (!order) {
            const error = new Error("Pedido no encontrado");
            error.statusCode = 404;
            throw error;
        }

        return order;
    },

    createOrder: async (orderData) => {
        const { customer, store, items, deliveryAddress, priority } = orderData;

        if (!customer || !store || !items || !deliveryAddress) {
            const error = new Error("Faltan datos obligatorios");
            error.statusCode = 400;
            throw error;
        }

        const userFound = await ordersRepository.findCustomerById(customer);
        if (!userFound) {
            const error = new Error("Usuario no encontrado");
            error.statusCode = 404;
            throw error;
        }

        const storeFound = await ordersRepository.findStoreById(store)
        if (!storeFound) {
            const error = new Error("Tienda no encontrada");
            error.statusCode = 404;
            throw error;
        }

        for (const item of items) {
            if (!item.productId || !item.quantity || item.quantity <= 0) {
                const error = new Error("Cada item debe incluir productId y una cantidad válida");
                error.statusCode = 400;
                throw error;
            }

            await productsService.reduceStock(item.productId, item.quantity);
        }

        const total = items.reduce((accumulator, item) => accumulator + item.price * item.quantity, 0);

        const validPriority = priority && Object.values(ORDER_PRIORITY).includes(priority) ? priority : ORDER_PRIORITY.NORMAL;

        const newOrder = {
            ...orderData,
            total,
            status: ORDER_STATUS.CREATED,
            priority: validPriority
        };

        return ordersRepository.create(newOrder);
    },

    updateOrderStatus: async (id, status) => {
        if (!Object.values(ORDER_STATUS).includes(status)) {
            const error = new Error(`Estado inválido. Estados permitidos: ${Object.values(ORDER_STATUS).join(", ")}`);
            error.statusCode = 400;
            throw error;
        }

        const order = await ordersRepository.updateStatus(id, status);
        if (!order) {
            const error = new Error("Pedido no encontrado");
            error.statusCode = 404;
            throw error;
        }

        return order;
    },

    deleteOrder: async (id) => {
        const order = await ordersRepository.delete(id);
        if (!order) {
            const error = new Error("Pedido no encontrado");
            error.statusCode = 404;
            throw error;
        }

        return order;
    }
};