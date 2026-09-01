import request from "supertest";
import { expect } from "chai";
import mongoose from "mongoose";
import app from "../src/app.js";
import { seedProductContext } from "./helpers/seed.js";
import { buildProduct } from "./helpers/products.factory.js";

describe("Products API | Check Tests", () => {
    describe("GET /api/products", () => {
        it("debe responder 200 y un array en payload", async () => {
            const res = await request(app).get("/api/products");

            expect(res.status).to.equal(200);
            expect(res.body.status).to.equal("success");
            expect(res.body.payload).to.be.an("array");
        });

        it("debe paginar productos y devolver metadata", async () => {
            await seedProductContext();
            await seedProductContext();

            const res = await request(app).get("/api/products?page=1&limit=1");

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
            const res = await request(app).get("/api/products?page=0&limit=51");

            expect(res.status).to.equal(400);
            expect(res.body.status).to.equal("error");
            expect(res.body.error.code).to.equal("VALIDATION_ERROR");
        });
    });

    describe("POST /api/products", () => {
        it("debe crear un producto a partir de un seller y una store válidos", async () => {
            const { seller, store } = await seedProductContext({
                storeOverrides: {
                    name: "Tienda del Seller",
                    address: "Avenida de los Productos 123",
                },
                productOverrides: {
                    name: "Producto inicial",
                    code: 403588,
                },
            });

            const res = await request(app)
                .post("/api/products")
                .send(buildProduct(store._id, {
                    name: "Producto de prueba",
                    description: "Descripcion del producto de prueba",
                    price: 4999.99,
                    stock: 10,
                    category: "cocina",
                    code: 403589,
                }));

            expect(res.status).to.equal(201);
            expect(res.body.status).to.equal("success");
            expect(res.body.payload.name).to.equal("Producto de prueba");
            expect(res.body.payload.store).to.equal(store._id);
            expect(res.body.payload.category).to.equal("cocina");
            expect(res.body.payload.stock).to.equal(10);
            expect(seller.role).to.equal("SELLER");
        });

        it("debe responder 400 si faltan datos obligatorios", async () => {
            const { store } = await seedProductContext({
                productOverrides: {
                    name: "Producto base",
                    code: 500001,
                },
            });

            const res = await request(app)
                .post("/api/products")
                .send({
                    name: "Producto incompleto",
                    store: store._id,
                });

            expect(res.status).to.equal(400);
            expect(res.body.status).to.equal("error");
            expect(res.body.error.code).to.equal("VALIDATION_ERROR");
        });

        it("debe responder 400 si la categoría es inválida", async () => {
            const { store } = await seedProductContext({
                productOverrides: {
                    name: "Producto base categoria",
                    code: 500002,
                },
            });

            const res = await request(app)
                .post("/api/products")
                .send(buildProduct(store._id, {
                    category: "categoria_invalida",
                    code: 111111,
                }));

            expect(res.status).to.equal(400);
            expect(res.body.status).to.equal("error");
            expect(res.body.error.code).to.equal("VALIDATION_ERROR");
        });

        it("debe responder 409 si el código ya existe", async () => {
            const { store } = await seedProductContext({
                productOverrides: {
                    name: "Producto 1",
                    code: 999999,
                },
            });

            const res = await request(app)
                .post("/api/products")
                .send(buildProduct(store._id, {
                    code: 999999,
                    name: "Producto duplicado",
                }));

            expect(res.status).to.equal(409);
            expect(res.body.status).to.equal("error");
            expect(res.body.error.code).to.equal("PRODUCT_ALREADY_EXISTS");
        });
    });

    describe("GET /api/products/:pid", () => {
        it("debe responder 200 cuando el id existe", async () => {
            const { product } = await seedProductContext({
                productOverrides: {
                    name: "Producto existente",
                    code: 222222,
                },
            });

            const res = await request(app).get(`/api/products/${product._id}`);

            expect(res.status).to.equal(200);
            expect(res.body.status).to.equal("success");
            expect(res.body.payload._id).to.equal(product._id);
        });

        it("debe responder 400 cuando el id es inválido", async () => {
            const res = await request(app).get("/api/products/id-invalido");

            expect(res.status).to.equal(400);
            expect(res.body.status).to.equal("error");
            expect(res.body.error.code).to.equal("INVALID_ID");
        });

        it("debe responder 404 cuando el producto no existe", async () => {
            const nonExistingId = new mongoose.Types.ObjectId().toString();

            const res = await request(app).get(`/api/products/${nonExistingId}`);

            expect(res.status).to.equal(404);
            expect(res.body.status).to.equal("error");
            expect(res.body.error.code).to.equal("PRODUCT_NOT_FOUND");
        });
    });

    describe("PUT /api/products/:pid", () => {
        it("debe actualizar un producto y responder 200", async () => {
            const { product } = await seedProductContext({
                productOverrides: {
                    name: "Producto viejo",
                    code: 333333,
                },
            });

            const res = await request(app)
                .put(`/api/products/${product._id}`)
                .send({
                    name: "Producto nuevo",
                    price: 2500,
                    stock: 8,
                });

            expect(res.status).to.equal(200);
            expect(res.body.status).to.equal("success");
            expect(res.body.payload._id).to.equal(product._id);
            expect(res.body.payload.name).to.equal("Producto nuevo");
            expect(res.body.payload.price).to.equal(2500);
            expect(res.body.payload.stock).to.equal(8);
        });
    });

    describe("DELETE /api/products/:pid", () => {
        it("debe eliminar un producto y responder 200", async () => {
            const { product } = await seedProductContext({
                productOverrides: {
                    name: "Producto a eliminar",
                    code: 444444,
                },
            });

            const res = await request(app).delete(`/api/products/${product._id}`);

            expect(res.status).to.equal(200);
            expect(res.body.status).to.equal("success");
            expect(res.body.payload._id).to.equal(product._id);
        });

        it("debe responder 404 si el producto no existe", async () => {
            const nonExistingId = new mongoose.Types.ObjectId().toString();

            const res = await request(app).delete(`/api/products/${nonExistingId}`);

            expect(res.status).to.equal(404);
            expect(res.body.status).to.equal("error");
            expect(res.body.error.code).to.equal("PRODUCT_NOT_FOUND");
        });
    });
});
