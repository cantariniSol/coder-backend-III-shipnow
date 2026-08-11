import request from "supertest";
import { expect } from "chai";
import app from "../src/app.js";

describe("Support / Smoke tests", () => {
    it("GET / debe responder 200 y status success", async () => {
        const res = await request(app).get("/");

        expect(res.status).to.equal(200);
        expect(res.body).to.be.an("object");
        expect(res.body.status).to.equal("success");
        expect(res.body).to.have.property("message");
    });

    it("GET /health debe responder 200 y campos de salud", async () => {
        const res = await request(app).get("/health");

        expect(res.status).to.equal(200);
        expect(res.body.status).to.equal("success");
        expect(res.body).to.have.property("server");
        expect(res.body).to.have.property("database");
    });
});