import request from "supertest";
import { expect } from "chai";
import mongoose from "mongoose";
import app from "../src/app.js";
import { buildOrder } from "./helpers/orders.factory.js";
import { seedOrderContext, seedProductContext } from "./helpers/seed.js";
import { ORDER_STATUS, ORDER_PRIORITY } from "../src/constants/index.js";
import { createCustomer } from "./helpers/users.factory.js";

describe("Orders API | Check Tests", () => {
    describe("GET /api/orders", () => {
        it("debe responder 200 y un array en payload", async () => {
            await seedOrderContext();

            const res = await request(app).get("/api/orders");

            expect(res.status).to.equal(200);
            expect(res.body.status).to.equal("success");
            expect(res.body.payload).to.be.an("array");
        });

        it("debe paginar orders y devolver metadata", async () => {
            await seedOrderContext();
            await seedOrderContext();

            const res = await request(app).get("/api/orders?page=1&limit=1");

            expect(res.status).to.equal(200);
            expect(res.body.payload).to.be.an("array").with.lengthOf(1);
            expect(res.body.meta).to.deep.equal({
                page: 1,
                limit: 1,
                total: 2,
                totalPages: 2,
            });
        });

        it("debe responder 400 si page o limit son inválidos", async () => {
            const res = await request(app).get("/api/orders?page=0&limit=51");

            expect(res.status).to.equal(400);
            expect(res.body.status).to.equal("error");
            expect(res.body.error.code).to.equal("VALIDATION_ERROR");
        });
    });

    describe("POST /api/orders", () => {
        it("debe crear una order válida con customer, store e items", async () => {
            const customer = await createCustomer();
            const { store, product } = await seedProductContext({
                productOverrides: {
                    code: 610001,
                    stock: 15,
                    price: 1000,
                    name: "Producto para order",
                },
            });

            const item = {
                productId: product._id,
                name: product.name,
                quantity: 2,
                price: product.price,
            };

            const payload = buildOrder(customer._id, store._id, [item], {
                deliveryAddress: "Av. Siempre Viva 123",
                priority: ORDER_PRIORITY.NORMAL,
            });

            const res = await request(app).post("/api/orders").send(payload);

            expect(res.status).to.equal(201);
            expect(res.body.status).to.equal("success");
            expect(res.body.payload.customer).to.equal(customer._id);
            expect(res.body.payload.store).to.equal(store._id);
            expect(res.body.payload.items[0].name).to.equal(product.name);
            expect(res.body.payload.items[0].quantity).to.equal(2);
            expect(res.body.payload.total).to.equal(product.price * 2);
            expect(res.body.payload.priority).to.equal(ORDER_PRIORITY.NORMAL);
        });

        it("debe responder 400 si faltan datos obligatorios", async () => {
            const res = await request(app).post("/api/orders").send({
                customer: new mongoose.Types.ObjectId().toString(),
            });

            expect(res.status).to.equal(400);
            expect(res.body.status).to.equal("error");
            expect(res.body.error.code).to.equal("VALIDATION_ERROR");
        });

        it("debe responder 404 si el customer no existe", async () => {
            const { seller, store, product } = await seedProductContext({
                productOverrides: { code: 610002 },
            });

            expect(seller.role).to.equal("SELLER");

            const fakeCustomerId = new mongoose.Types.ObjectId().toString();
            const item = {
                productId: product._id,
                name: product.name,
                quantity: 1,
                price: product.price,
            };

            const payload = buildOrder(fakeCustomerId, store._id, [item]);
            const res = await request(app).post("/api/orders").send(payload);

            expect(res.status).to.equal(404);
            expect(res.body.status).to.equal("error");
            expect(res.body.error.code).to.equal("USER_NOT_FOUND");
        });

        it("debe responder 404 si la store no existe", async () => {
            const customer = await createCustomer();
            const { product } = await seedProductContext({
                productOverrides: { code: 610003 },
            });

            const fakeStoreId = new mongoose.Types.ObjectId().toString();
            const item = {
                productId: product._id,
                name: product.name,
                quantity: 1,
                price: product.price,
            };

            const payload = buildOrder(customer._id, fakeStoreId, [item]);
            const res = await request(app).post("/api/orders").send(payload);

            expect(res.status).to.equal(404);
            expect(res.body.status).to.equal("error");
            expect(res.body.error.code).to.equal("STORE_NOT_FOUND");
        });

        it("debe responder 400 si un item no tiene productId o quantity válida", async () => {
            const customer = await createCustomer();
            const { store, product } = await seedProductContext({
                productOverrides: { code: 610004 },
            });

            const payload = buildOrder(customer._id, store._id, [
                {
                    name: product.name,
                    quantity: 0,
                    price: product.price,
                }
            ]);

            const res = await request(app).post("/api/orders").send(payload);

            expect(res.status).to.equal(400);
            expect(res.body.status).to.equal("error");
            expect(res.body.error.code).to.equal("ORDER_ITEMS_REQUIRED");
        });
    });

    describe("GET /api/orders/:oid", () => {
        it("debe responder 200 cuando el id existe", async () => {
            const { order } = await seedOrderContext();

            const res = await request(app).get(`/api/orders/${order._id}`);

            expect(res.status).to.equal(200);
            expect(res.body.status).to.equal("success");
            expect(res.body.payload._id).to.equal(order._id);
        });

        it("debe responder 400 cuando el id es inválido", async () => {
            const res = await request(app).get("/api/orders/id-invalido");

            expect(res.status).to.equal(400);
            expect(res.body.status).to.equal("error");
            expect(res.body.error.code).to.equal("INVALID_ID");
        });

        it("debe responder 404 cuando la order no existe", async () => {
            const nonExistingId = new mongoose.Types.ObjectId().toString();

            const res = await request(app).get(`/api/orders/${nonExistingId}`);

            expect(res.status).to.equal(404);
            expect(res.body.status).to.equal("error");
            expect(res.body.error.code).to.equal("ORDER_NOT_FOUND");
        });
    });

    describe("PUT /api/orders/:oid", () => {
        it("debe actualizar una order y responder 200", async () => {
            const { order } = await seedOrderContext();

            const res = await request(app)
                .put(`/api/orders/${order._id}`)
                .send({
                    status: ORDER_STATUS.ASSIGNED,
                    priority: ORDER_PRIORITY.HIGH,
                });

            expect(res.status).to.equal(200);
            expect(res.body.status).to.equal("success");
            expect(res.body.payload._id).to.equal(order._id);
            expect(res.body.payload.status).to.equal(ORDER_STATUS.ASSIGNED);
            expect(res.body.payload.priority).to.equal(ORDER_PRIORITY.HIGH);
        });

        it("debe responder 400 si el estado es inválido", async () => {
            const { order } = await seedOrderContext();

            const res = await request(app)
                .put(`/api/orders/${order._id}`)
                .send({ status: "estado_invalido" });

            expect(res.status).to.equal(400);
            expect(res.body.status).to.equal("error");
            expect(res.body.error.code).to.equal("INVALID_ORDER_STATUS");
        });

        it("debe responder 400 si la prioridad es inválida", async () => {
            const { order } = await seedOrderContext();

            const res = await request(app)
                .put(`/api/orders/${order._id}`)
                .send({ priority: "urgente_max" });

            expect(res.status).to.equal(400);
            expect(res.body.status).to.equal("error");
            expect(res.body.error.code).to.equal("VALIDATION_ERROR");
        });

        it("debe responder 400 si intenta cancelar una order ya asignada", async () => {
            const { order } = await seedOrderContext();

            const assigned = await request(app)
                .put(`/api/orders/${order._id}`)
                .send({ status: ORDER_STATUS.ASSIGNED });

            expect(assigned.status).to.equal(200);

            const cancelled = await request(app)
                .put(`/api/orders/${order._id}`)
                .send({ status: ORDER_STATUS.CANCELLED });

            expect(cancelled.status).to.equal(400);
            expect(cancelled.body.status).to.equal("error");
            expect(cancelled.body.error.code).to.equal("INVALID_ORDER_STATUS");
        });

        it("debe responder 404 si intenta actualizar una order inexistente", async () => {
            const nonExistingId = new mongoose.Types.ObjectId().toString();

            const res = await request(app)
                .put(`/api/orders/${nonExistingId}`)
                .send({ status: ORDER_STATUS.ASSIGNED });

            expect(res.status).to.equal(404);
            expect(res.body.status).to.equal("error");
            expect(res.body.error.code).to.equal("ORDER_NOT_FOUND");
        });
    });

    describe("DELETE /api/orders/:oid", () => {
        it("debe eliminar una order y responder 200", async () => {
            const { order } = await seedOrderContext();

            const res = await request(app).delete(`/api/orders/${order._id}`);

            expect(res.status).to.equal(200);
            expect(res.body.status).to.equal("success");
            expect(res.body.payload._id).to.equal(order._id);
        });

        it("debe responder 404 si la order no existe", async () => {
            const nonExistingId = new mongoose.Types.ObjectId().toString();

            const res = await request(app).delete(`/api/orders/${nonExistingId}`);

            expect(res.status).to.equal(404);
            expect(res.body.status).to.equal("error");
            expect(res.body.error.code).to.equal("ORDER_NOT_FOUND");
        });
    });
});