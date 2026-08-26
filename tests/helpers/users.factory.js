import request from "supertest";
import app from "../../src/app.js";
import { USER_ROLES } from "../../src/constants/index.js";
import { createError } from "../../src/errors/createError.js";

export const buildUser = (overrides = {}, role = USER_ROLES.CUSTOMER) => ({
    firstName: "Juan",
    lastName: "Perez",
    email: `user.${Date.now()}.${Math.floor(Math.random() * 10000)}@mail.com`,
    password: "Pass123",
    role,
    ...overrides,
});

export const buildCustomer = (overrides = {}) =>
    buildUser(overrides, USER_ROLES.CUSTOMER);

export const buildSeller = (overrides = {}) =>
    buildUser(overrides, USER_ROLES.SELLER);

export const createCustomer = async (overrides = {}) => {
    const payload = buildCustomer(overrides);

    const res = await request(app).post("/api/users").send(payload);

    if (res.status !== 201) {
        throw createError(
            "VALIDATION_ERROR",
            `No se pudo crear customer: ${res.body?.error?.message || res.text}`
        );
    }

    return res.body.payload;
};

export const createSeller = async (overrides = {}) => {
    const payload = buildSeller(overrides);

    const res = await request(app).post("/api/users").send(payload);

    if (res.status !== 201) {
        throw createError(
            "VALIDATION_ERROR",
            `No se pudo crear seller: ${res.body?.error?.message || res.text}`
        );
    }

    return res.body.payload;
};