import request from "supertest";
import app from "../../src/app.js";
import { createCustomer, createSeller } from "./users.factory.js";
import { createStoreForSeller } from "./stores.factory.js";
import { createProductForStore } from "./products.factory.js";
import { createError } from "../../src/errors/createError.js";

export const seedUserContext = async ({
    customerOverrides = {},
    sellerOverrides = {},
} = {}) => {
    const customer = await createCustomer(customerOverrides);
    const seller = await createSeller(sellerOverrides);

    return {
        customer,
        seller,
    };
};

export const seedStoreContext = async ({
    sellerOverrides = {},
    storeOverrides = {},
} = {}) => {
    const seller = await createSeller(sellerOverrides);
    const store = await createStoreForSeller(seller._id, storeOverrides);

    return {
        seller,
        store,
    };
};

export const seedProductContext = async ({
    sellerOverrides = {},
    storeOverrides = {},
    productOverrides = {},
} = {}) => {
    const seller = await createSeller(sellerOverrides);
    const store = await createStoreForSeller(seller._id, storeOverrides);
    const product = await createProductForStore(store._id, productOverrides);

    return {
        seller,
        store,
        product,
    };
};

export const seedOrderContext = async () => {
    const customer = await createCustomer();
    const seller = await createSeller();
    const store = await createStoreForSeller(seller._id);
    const product = await createProductForStore(store._id, {
        name: "Gorgeous Marble Bike",
        price: 54900.69,
        stock: 10,
        code: Math.floor(100000 + Math.random() * 900000),
    });

    const orderPayload = {
        customer: customer._id,
        store: store._id,
        items: [
            {
                productId: product._id,
                name: product.name,
                quantity: 2,
                price: product.price,
            }
        ],
        deliveryAddress: "14483 W Pine Street Suite 735",
        total: product.price * 2,
        status: "delivered",
        priority: "normal",
        proof: null
    };

    const res = await request(app).post("/api/orders").send(orderPayload);

    if (res.status !== 201) {
        throw createError("VALIDATION_ERROR", `No se pudo crear la order: ${res.body?.error?.message || res.text}`);
    }

    return {
        customer,
        seller,
        store,
        product,
        order: res.body.payload
    };
};