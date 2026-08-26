import request from "supertest";
import { expect } from "chai";
import app from "../src/app.js";
import {
	seedOrderContext,
	seedStoreContext,
	seedUserContext,
} from "./helpers/seed.js";

describe("Mocks API | Check Tests", () => {
	describe("GET /api/mocks/mockingUsers", () => {
		it("debe responder 200 y generar la cantidad solicitada", async () => {
			const res = await request(app).get("/api/mocks/mockingUsers?quantity=3");

			expect(res.status).to.equal(200);
			expect(res.body.status).to.equal("success");
			expect(res.body.payload).to.be.an("array").with.lengthOf(3);
		});

		it("debe responder 400 cuando quantity es inválido", async () => {
			const res = await request(app).get("/api/mocks/mockingUsers?quantity=-1");

			expect(res.status).to.equal(400);
			expect(res.body.status).to.equal("error");
			expect(res.body.error.code).to.equal("VALIDATION_ERROR");
		});
	});

	describe("POST /api/mocks/generateUsers", () => {
		it("debe responder 201 y persistir la cantidad solicitada", async () => {
			const res = await request(app)
				.post("/api/mocks/generateUsers")
				.send({ users: 2 });

			expect(res.status).to.equal(201);
			expect(res.body.status).to.equal("success");
			expect(res.body.payload.users).to.equal(2);
		});

		it("debe responder 400 si el body no es un objeto JSON válido", async () => {
			const res = await request(app)
				.post("/api/mocks/generateUsers")
				.send([]);

			expect(res.status).to.equal(400);
			expect(res.body.status).to.equal("error");
			expect(res.body.error.code).to.equal("VALIDATION_ERROR");
		});
	});

	describe("GET /api/mocks/mockingStores", () => {
		it("debe responder 200 cuando existe al menos un seller", async () => {
			const { seller } = await seedUserContext();
			expect(seller.role).to.equal("SELLER");

			const res = await request(app).get("/api/mocks/mockingStores?quantity=2");

			expect(res.status).to.equal(200);
			expect(res.body.status).to.equal("success");
			expect(res.body.payload).to.be.an("array").with.lengthOf(2);
		});
	});

	describe("POST /api/mocks/generateStores", () => {
		it("debe responder 201 y persistir stores si hay seller disponible", async () => {
			await seedUserContext();

			const res = await request(app)
				.post("/api/mocks/generateStores")
				.send({ stores: 2 });

			expect(res.status).to.equal(201);
			expect(res.body.status).to.equal("success");
			expect(res.body.payload.stores).to.equal(2);
		});

		it("debe responder 400 si la cantidad supera el máximo permitido", async () => {
			await seedUserContext();

			const res = await request(app)
				.post("/api/mocks/generateStores")
				.send({ stores: 99 });

			expect(res.status).to.equal(400);
			expect(res.body.status).to.equal("error");
			expect(res.body.error.code).to.equal("VALIDATION_ERROR");
		});
	});

	describe("GET /api/mocks/mockingProducts", () => {
		it("debe responder 200 cuando existe al menos una store", async () => {
			const { store } = await seedStoreContext();
			expect(store).to.have.property("_id");

			const res = await request(app).get("/api/mocks/mockingProducts?quantity=2");

			expect(res.status).to.equal(200);
			expect(res.body.status).to.equal("success");
			expect(res.body.payload).to.be.an("array").with.lengthOf(2);
		});
	});

	describe("POST /api/mocks/generateProducts", () => {
		it("debe responder 201 y persistir products si hay store disponible", async () => {
			await seedStoreContext();

			const res = await request(app)
				.post("/api/mocks/generateProducts")
				.send({ products: 2 });

			expect(res.status).to.equal(201);
			expect(res.body.status).to.equal("success");
			expect(res.body.payload.products).to.equal(2);
		});

		it("debe responder 400 si el body es inválido", async () => {
			const res = await request(app)
				.post("/api/mocks/generateProducts")
				.send("texto");

			expect(res.status).to.equal(400);
			expect(res.body.status).to.equal("error");
			expect(res.body.error.code).to.equal("VALIDATION_ERROR");
		});
	});

	describe("GET /api/mocks/mockingOrders", () => {
		it("debe responder 200 cuando existe customer, store y product", async () => {
			await seedOrderContext();

			const res = await request(app).get("/api/mocks/mockingOrders?quantity=2");

			expect(res.status).to.equal(200);
			expect(res.body.status).to.equal("success");
			expect(res.body.payload).to.be.an("array").with.lengthOf(2);
		});
	});

	describe("POST /api/mocks/generateOrders", () => {
		it("debe responder 201 y persistir orders si hay datos relacionados", async () => {
			await seedOrderContext();

			const res = await request(app)
				.post("/api/mocks/generateOrders")
				.send({ orders: 2 });

			expect(res.status).to.equal(201);
			expect(res.body.status).to.equal("success");
			expect(res.body.payload.orders).to.equal(2);
		});

		it("debe responder 400 cuando quantity es cero", async () => {
			await seedOrderContext();

			const res = await request(app)
				.post("/api/mocks/generateOrders")
				.send({ orders: 0 });

			expect(res.status).to.equal(400);
			expect(res.body.status).to.equal("error");
			expect(res.body.error.code).to.equal("VALIDATION_ERROR");
		});
	});
});
