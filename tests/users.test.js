import request from "supertest";
import { expect } from "chai";
import mongoose from "mongoose";
import app from "../src/app.js";
import { seedUserContext } from "./helpers/seed.js";

describe("Users API | Check Tests", () => {
    describe("GET /api/users", () => {
        it("debe responder 200 y un array en payload", async () => {
            const res = await request(app).get("/api/users");

            expect(res.status).to.equal(200);
            expect(res.body.status).to.equal("success");
            expect(res.body.payload).to.be.an("array");
        });

        it("debe paginar usuarios y devolver metadata", async () => {
            await seedUserContext();
            await seedUserContext();

            const res = await request(app).get("/api/users?page=1&limit=1");

            expect(res.status).to.equal(200);
            expect(res.body.payload).to.be.an("array").with.lengthOf(1);
            expect(res.body.meta).to.deep.equal({
                page: 1,
                limit: 1,
                total: 4,
                totalPages: 4,
            });
        });

        it("debe responder 400 si page o limit son inválidos", async () => {
            const res = await request(app).get("/api/users?page=0&limit=51");

            expect(res.status).to.equal(400);
            expect(res.body.status).to.equal("error");
            expect(res.body.error.code).to.equal("VALIDATION_ERROR");
        });
    });

    describe("POST /api/users", () => {
        it("debe crear un usuario customer y responder 201", async () => {
            const { customer } = await seedUserContext();

            expect(customer).to.have.property("_id");
            expect(customer.role).to.equal("CUSTOMER");
        });

        it("debe responder 400 si faltan campos obligatorios", async () => {
            const incompleteUser = {
                firstName: "Sol",
                email: "sol@mail.com",
            };

            const res = await request(app).post("/api/users").send(incompleteUser);

            expect(res.status).to.equal(400);
            expect(res.body.status).to.equal("error");
            expect(res.body.error.code).to.equal("VALIDATION_ERROR");
        });

        it("debe responder 409 si el email está duplicado", async () => {
            const repeatedEmail = `dup.${Date.now()}@mail.com`;

            const first = await request(app)
                .post("/api/users")
                .send({
                    firstName: "Ana",
                    lastName: "Lopez",
                    email: repeatedEmail,
                    password: "Pass123",
                    role: "CUSTOMER",
                });

            expect(first.status).to.equal(201);

            const second = await request(app)
                .post("/api/users")
                .send({
                    firstName: "Ana",
                    lastName: "Lopez",
                    email: repeatedEmail,
                    password: "Pass123",
                    role: "CUSTOMER",
                });

            expect(second.status).to.equal(409);
            expect(second.body.status).to.equal("error");
            expect(second.body.error.code).to.equal("DUPLICATE_KEY");
        });

        it("debe responder 400 si el rol es inválido", async () => {
            const res = await request(app)
                .post("/api/users")
                .send({
                    firstName: "Pepe",
                    lastName: "Pérez",
                    email: `invalid.${Date.now()}@mail.com`,
                    password: "Pass123",
                    role: "SUPER_ADMIN",
                });

            expect(res.status).to.equal(400);
            expect(res.body.status).to.equal("error");
            expect(res.body.error.code).to.equal("INVALID_USER_ROLE");
        });

        it("debe asignar rol CUSTOMER por defecto cuando no se envía role", async () => {
            const res = await request(app)
                .post("/api/users")
                .send({
                    firstName: "Sin",
                    lastName: "Rol",
                    email: `norole.${Date.now()}@mail.com`,
                    password: "Pass123",
                });

            expect(res.status).to.equal(201);
            expect(res.body.status).to.equal("success");
            expect(res.body.payload.role).to.equal("CUSTOMER");
        });
    });

    describe("GET /api/users/:uid", () => {
        it("debe responder 200 cuando el id existe", async () => {
            const { customer } = await seedUserContext();

            const res = await request(app).get(`/api/users/${customer._id}`);

            expect(res.status).to.equal(200);
            expect(res.body.status).to.equal("success");
            expect(res.body.payload._id).to.equal(customer._id);
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
            const { customer } = await seedUserContext();

            const res = await request(app)
                .put(`/api/users/${customer._id}`)
                .send({ lastName: "Gomez" });

            expect(res.status).to.equal(200);
            expect(res.body.status).to.equal("success");
            expect(res.body.payload._id).to.equal(customer._id);
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

        it("debe responder 400 si intenta actualizar con rol inválido", async () => {
            const { customer } = await seedUserContext();

            const res = await request(app)
                .put(`/api/users/${customer._id}`)
                .send({ role: "FAKE_ROLE" });

            expect(res.status).to.equal(400);
            expect(res.body.status).to.equal("error");
            expect(res.body.error.code).to.equal("INVALID_USER_ROLE");
        });
    });

    describe("DELETE /api/users/:uid", () => {
        it("debe eliminar un usuario y responder 200", async () => {
            const { customer } = await seedUserContext();

            const res = await request(app).delete(`/api/users/${customer._id}`);

            expect(res.status).to.equal(200);
            expect(res.body.status).to.equal("success");
            expect(res.body.payload._id).to.equal(customer._id);
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