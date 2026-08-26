import request from "supertest";
import app from "../../src/app.js";
import { createError } from "../../src/errors/createError.js";

export const buildProduct = (storeId, overrides = {}) => ({
    name: "Producto de prueba",
    description: "Descripcion del producto",
    price: 1999.99,
    stock: 10,
    category: "cocina",
    code: Math.floor(100000 + Math.random() * 900000),
    isActive: true,
    store: storeId,
    ...overrides,
});

export const createProductForStore = async (storeId, overrides = {}) => {
    const payload = buildProduct(storeId, overrides);

    const res = await request(app).post("/api/products").send(payload);

    if (res.status !== 201) {
        throw createError("VALIDATION_ERROR", `No se pudo crear product: ${res.body?.error?.message || res.text}`);
    }

    return res.body.payload;
};