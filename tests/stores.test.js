import request from "supertest";
import { expect } from "chai";
import mongoose from "mongoose";
import app from "../src/app.js";
import { seedStoreContext } from "./helpers/seed.js";
import { buildStore } from "./helpers/stores.factory.js";

describe("Stores API | Check Tests", () => {
    describe("GET /api/stores", () => {
        it("debe responder 200 y un array en payload", async () => {
            const res = await request(app).get("/api/stores");

            expect(res.status).to.equal(200);
            expect(res.body.status).to.equal("success");
            expect(res.body.payload).to.be.an("array");
        });
    });

    describe("POST /api/stores", () => {
        it("debe crear un store con owner válido de tipo SELLER", async () => {
            const { seller } = await seedStoreContext();

            const res = await request(app)
                .post("/api/stores")
                .send(buildStore(seller._id, {
                    name: "Tienda del Seller",
                    address: "Avenida Siempre Viva 742",
                }));

            expect(res.status).to.equal(201);
            expect(res.body.status).to.equal("success");
            expect(res.body.payload.owner).to.equal(seller._id);
            expect(res.body.payload.name).to.equal("Tienda del Seller");
            expect(res.body.payload.address).to.equal("Avenida Siempre Viva 742");
        });

        it("debe responder 404 si el owner no existe", async () => {
            const fakeOwnerId = new mongoose.Types.ObjectId().toString();

            const res = await request(app)
                .post("/api/stores")
                .send(buildStore(fakeOwnerId, {
                    name: "Tienda sin owner válido",
                    address: "Calle Falsa 321",
                }));

            expect(res.status).to.equal(404);
            expect(res.body.status).to.equal("error");
            expect(res.body.error.code).to.equal("USER_NOT_FOUND");
        });
    });

    describe("GET /api/stores/:sid", () => {
        it("debe responder 200 cuando el id existe", async () => {
            const { store } = await seedStoreContext({
                storeOverrides: { name: "Store Existente" },
            });

            const res = await request(app).get(`/api/stores/${store._id}`);

            expect(res.status).to.equal(200);
            expect(res.body.status).to.equal("success");
            expect(res.body.payload._id).to.equal(store._id);
        });

        it("debe responder 400 cuando el id es inválido", async () => {
            const res = await request(app).get("/api/stores/id-invalido");

            expect(res.status).to.equal(400);
            expect(res.body.status).to.equal("error");
            expect(res.body.error.code).to.equal("INVALID_ID");
        });

        it("debe responder 404 cuando el store no existe", async () => {
            const nonExistingId = new mongoose.Types.ObjectId().toString();

            const res = await request(app).get(`/api/stores/${nonExistingId}`);

            expect(res.status).to.equal(404);
            expect(res.body.status).to.equal("error");
            expect(res.body.error.code).to.equal("STORE_NOT_FOUND");
        });
    });

    describe("PUT /api/stores/:sid", () => {
        it("debe actualizar un store y responder 200", async () => {
            const { store } = await seedStoreContext({
                storeOverrides: {
                    name: "Old Name",
                    address: "Old Address",
                },
            });

            const res = await request(app)
                .put(`/api/stores/${store._id}`)
                .send({
                    name: "New Name",
                    address: "New Address",
                });

            expect(res.status).to.equal(200);
            expect(res.body.status).to.equal("success");
            expect(res.body.payload._id).to.equal(store._id);
            expect(res.body.payload.name).to.equal("New Name");
            expect(res.body.payload.address).to.equal("New Address");
        });

        it("debe responder 404 si intenta actualizar un store inexistente", async () => {
            const nonExistingId = new mongoose.Types.ObjectId().toString();

            const res = await request(app)
                .put(`/api/stores/${nonExistingId}`)
                .send({ name: "Nuevo nombre" });

            expect(res.status).to.equal(404);
            expect(res.body.status).to.equal("error");
            expect(res.body.error.code).to.equal("STORE_NOT_FOUND");
        });
    });

    describe("DELETE /api/stores/:sid", () => {
        it("debe eliminar un store y responder 200", async () => {
            const { store } = await seedStoreContext({
                storeOverrides: { name: "Store a eliminar" },
            });

            const res = await request(app).delete(`/api/stores/${store._id}`);

            expect(res.status).to.equal(200);
            expect(res.body.status).to.equal("success");
            expect(res.body.payload._id).to.equal(store._id);
        });

        it("debe responder 404 si el store no existe", async () => {
            const nonExistingId = new mongoose.Types.ObjectId().toString();

            const res = await request(app).delete(`/api/stores/${nonExistingId}`);

            expect(res.status).to.equal(404);
            expect(res.body.status).to.equal("error");
            expect(res.body.error.code).to.equal("STORE_NOT_FOUND");
        });
    });
});