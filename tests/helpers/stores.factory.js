import request from "supertest";
import app from "../../src/app.js";
import { createError } from "../../src/errors/createError.js";

export const buildStore = (ownerId, overrides = {}) => ({
    name: "Tienda Central",
    address: "Calle Falsa 123",
    owner: ownerId,
    isActive: true,
    ...overrides,
});

export const createStoreForSeller = async (sellerId, overrides = {}) => {
    const payload = buildStore(sellerId, overrides);

    const res = await request(app).post("/api/stores").send(payload);

    if (res.status !== 201) {
        throw createError("VALIDATION_ERROR", `No se pudo crear store: ${res.body?.error?.message || res.text}`);
    }

    return res.body.payload;
};