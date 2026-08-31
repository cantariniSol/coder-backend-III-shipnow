import { createError } from "../errors/createError.js";
import { ordersRepository } from "../repositories/orders.repository.js";
import { productsService } from "./products.service.js";
import path from "node:path";
import { ORDER_STATUS, ORDER_PRIORITY } from "../constants/index.js";

const CANNOT_CANCEL_AFTER = [
    ORDER_STATUS.ASSIGNED,
    ORDER_STATUS.PICKED_UP,
    ORDER_STATUS.IN_TRANSIT,
    ORDER_STATUS.DELIVERED,
];

const createProofMetadata = (file) => ({
    originalName: file.originalname,
    filename: file.filename,
    path: path.relative(process.cwd(), file.path).replaceAll("\\", "/"),
    mimetype: file.mimetype,
    size: file.size,
    uploadedAt: new Date(),
});

export const ordersService = {
    getOrders: async () => {
        return ordersRepository.findAll();
    },

    getOrderById: async (id) => {
        const order = await ordersRepository.findById(id);
        if (!order) {
            throw createError("ORDER_NOT_FOUND");
        }

        return order;
    },

    createOrder: async (orderData) => {
        const { customer, store, items, deliveryAddress, priority } = orderData;

        if (!customer || !store || !items || !deliveryAddress) {
            throw createError("VALIDATION_ERROR", "Faltan datos obligatorios");
        }

        const userFound = await ordersRepository.findCustomerById(customer);
        if (!userFound) {
            throw createError("USER_NOT_FOUND");
        }

        const storeFound = await ordersRepository.findStoreById(store)
        if (!storeFound) {
            throw createError("STORE_NOT_FOUND");
        }

        for (const item of items) {
            if (!item.productId || !item.quantity || item.quantity <= 0) {
                throw createError("ORDER_ITEMS_REQUIRED", "Cada item debe incluir productId y una cantidad válida");
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

    updateOrder: async (id, updates) => {
        const order = await ordersRepository.findById(id);
        if (!order) throw createError("ORDER_NOT_FOUND");

        if (updates.status) {
            if (!Object.values(ORDER_STATUS).includes(updates.status)) {
                throw createError(
                    "INVALID_ORDER_STATUS",
                    `Estado inválido. Estados permitidos: ${Object.values(ORDER_STATUS).join(", ")}`
                );
            }

            if (
                updates.status === ORDER_STATUS.CANCELLED &&
                CANNOT_CANCEL_AFTER.includes(order.status)
            ) {
                throw createError(
                    "INVALID_ORDER_STATUS",
                    `No se puede cancelar un pedido con estado ${order.status}`
                );
            }
        }

        if (updates.priority && !Object.values(ORDER_PRIORITY).includes(updates.priority)) {
            throw createError(
                "VALIDATION_ERROR",
                `Prioridad inválida. Prioridades permitidas: ${Object.values(ORDER_PRIORITY).join(", ")}`
            );
        }

        if (updates.items) {
            for (const item of updates.items) {
                if (!item.productId || !item.quantity || item.quantity <= 0) {
                    throw createError(
                        "ORDER_ITEMS_REQUIRED",
                        "Cada item debe incluir productId y una cantidad válida"
                    );
                }
            }
        }

        const updateData = {
            ...updates,
            total: updates.items
                ? updates.items.reduce((acc, item) => acc + item.price * item.quantity, 0)
                : updates.total ?? order.total
        };

        return ordersRepository.update(id, updateData);
    },

    addProof: async (id, file) => {
        if (!file) {
            throw createError("FILE_REQUIRED");
        }

        try {
            const order = await ordersRepository.addProof(
                id,
                createProofMetadata(file)
            );

            if (!order) {
                throw createError("ORDER_NOT_FOUND");
            }

            return order;
        } catch (error) {
            if (error.code || error.name === "CastError") {
                throw error;
            }

            throw createError("FILE_SAVE_ERROR");
        }
    },

    deleteOrder: async (id) => {
        const order = await ordersRepository.delete(id);
        if (!order) {
            throw createError("ORDER_NOT_FOUND");
        }

        return order;
    }
};