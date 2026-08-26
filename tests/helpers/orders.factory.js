import request from "supertest";
import app from "../../src/app.js";
import { ORDER_STATUS, ORDER_PRIORITY } from "../../src/constants/index.js";
import { createError } from "../../src/errors/createError.js";

export const buildOrder = (customerId, storeId, items, overrides = {}) => ({
    customer: customerId,
    store: storeId,
    items,
    deliveryAddress: "Calle Falsa 123",
    total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    status: ORDER_STATUS.CREATED,
    priority: ORDER_PRIORITY.NORMAL,
    proof: null,
    ...overrides,
});

export const createOrderForCustomer = async (customerId, storeId, items, overrides = {}) => {
    const payload = buildOrder(customerId, storeId, items, overrides);

    const res = await request(app).post("/api/orders").send(payload);

    if (res.status !== 201) {
        throw createError("VALIDATION_ERROR", `No se pudo crear order: ${res.body?.error?.message || res.text}`);
    }

    return res.body.payload;
};