import request from "supertest";
import { expect } from "chai";
import app from "../src/app.js";

describe("Logger API | Check Tests", () => {
	describe("GET /api/mocks/loggerTest", () => {
		it("debe responder 200 cuando ejecuta logger test", async () => {
			const res = await request(app).get("/api/mocks/loggerTest");

			expect(res.status).to.equal(200);
			expect(res.body.status).to.equal("success");
			expect(res.body.message).to.be.a("string");
		});

		it("debe devolver el formato esperado de respuesta", async () => {
			const res = await request(app).get("/api/mocks/loggerTest");

			expect(res.status).to.equal(200);
			expect(res.body).to.be.an("object");
			expect(res.body).to.have.property("status", "success");
			expect(res.body).to.have.property("message");
		});
	});
});
