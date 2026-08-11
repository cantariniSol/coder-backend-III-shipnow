import request from "supertest";
import { expect } from "chai";
import mongoose from "mongoose";
import app from "../src/app.js";

const buildUser = (overrides = {}) => ({
    firstName: "Juan",
    lastName: "Perez",
    email: `juan.${Date.now()}.${Math.floor(Math.random() * 10000)}@mail.com`,
    password: "Pass123",
    role: "CUSTOMER",
    ...overrides,
});

describe("Users API", () => {
    describe("GET /api/users", () => {
        it("debe responder 200 y un array en payload", async () => {
            const res = await request(app).get("/api/users");

            expect(res.status).to.equal(200);
            expect(res.body).to.be.an("object");
            expect(res.body.status).to.equal("success");
            expect(res.body.payload).to.be.an("array");
        });
    });

    describe("POST /api/users", () => {
        it("debe crear un usuario y responder 201", async () => {
            const userData = buildUser();

            const res = await request(app).post("/api/users").send(userData);

            expect(res.status).to.equal(201);
            expect(res.body.status).to.equal("success");
            expect(res.body.payload).to.be.an("object");
            expect(res.body.payload).to.have.property("_id");
            expect(res.body.payload.email).to.equal(userData.email);
            expect(res.body.payload.role).to.equal("CUSTOMER");
        });

        it("debe responder 400 si faltan campos obligatorios", async () => {
            const incompleteUser = {
                firstName: "Sol",
                email: "sol@mail.com",
            };

            const res = await request(app).post("/api/users").send(incompleteUser);

            expect(res.status).to.equal(400);
            expect(res.body.status).to.equal("error");
            expect(res.body.error).to.be.an("object");
            expect(res.body.error.code).to.equal("VALIDATION_ERROR");
        });

        it("debe responder 409 si el email está duplicado", async () => {
            const repeatedEmail = `dup.${Date.now()}@mail.com`;
            const user1 = buildUser({ email: repeatedEmail });
            const user2 = buildUser({ email: repeatedEmail });

            const first = await request(app).post("/api/users").send(user1);
            expect(first.status).to.equal(201);

            const second = await request(app).post("/api/users").send(user2);
            expect(second.status).to.equal(409);
            expect(second.body.status).to.equal("error");
            expect(second.body.error.code).to.equal("DUPLICATE_KEY");
        });
    });

    describe("GET /api/users/:uid", () => {
        it("debe responder 200 cuando el id existe", async () => {
            const userData = buildUser();
            const created = await request(app).post("/api/users").send(userData);

            const userId = created.body.payload._id;
            const res = await request(app).get(`/api/users/${userId}`);

            expect(res.status).to.equal(200);
            expect(res.body.status).to.equal("success");
            expect(res.body.payload._id).to.equal(userId);
        });

        it("debe responder 400 cuando el id es inválido", async () => {
            const res = await request(app).get("/api/users/id-invalido");

            expect(res.status).to.equal(400);
            expect(res.body.status).to.equal("error");
            expect(res.body.error.code).to.equal("INVALID_ID");
        });

        it("debe responder 404 cuando el id no existe", async () => {
            const nonExistingId = new mongoose.Types.ObjectId().toString();

            const res = await request(app).get(`/api/users/${nonExistingId}`);

            expect(res.status).to.equal(404);
            expect(res.body.status).to.equal("error");
            expect(res.body.error.code).to.equal("USER_NOT_FOUND");
        });
    });

    describe("PUT /api/users/:uid", () => {
        it("debe actualizar un usuario y responder 200", async () => {
            const userData = buildUser();
            const created = await request(app).post("/api/users").send(userData);
            const userId = created.body.payload._id;

            const updates = { lastName: "Gomez" };

            const res = await request(app).put(`/api/users/${userId}`).send(updates);

            expect(res.status).to.equal(200);
            expect(res.body.status).to.equal("success");
            expect(res.body.payload._id).to.equal(userId);
            expect(res.body.payload.lastName).to.equal("Gomez");
        });

        it("debe responder 404 si intenta actualizar un usuario inexistente", async () => {
            const nonExistingId = new mongoose.Types.ObjectId().toString();

            const res = await request(app)
                .put(`/api/users/${nonExistingId}`)
                .send({ lastName: "NuevoApellido" });

            expect(res.status).to.equal(404);
            expect(res.body.status).to.equal("error");
            expect(res.body.error.code).to.equal("USER_NOT_FOUND");
        });
    });

    describe("DELETE /api/users/:uid", () => {
        it("debe eliminar un usuario y responder 200", async () => {
            const userData = buildUser();
            const created = await request(app).post("/api/users").send(userData);
            const userId = created.body.payload._id;

            const res = await request(app).delete(`/api/users/${userId}`);

            expect(res.status).to.equal(200);
            expect(res.body.status).to.equal("success");
            expect(res.body.payload._id).to.equal(userId);
        });

        it("debe responder 404 si el usuario no existe", async () => {
            const nonExistingId = new mongoose.Types.ObjectId().toString();

            const res = await request(app).delete(`/api/users/${nonExistingId}`);

            expect(res.status).to.equal(404);
            expect(res.body.status).to.equal("error");
            expect(res.body.error.code).to.equal("USER_NOT_FOUND");
        });
    });
});