import request from "supertest";
import { expect } from "chai";
import app from "../src/app.js";

describe("Health | Check Tests", () => {

    it("GET /api/health debe responder 200 con datos seguros de monitoreo", async () => {
        const res = await request(app).get("/api/health");

        expect(res.status).to.equal(200);
        expect(res.body.status).to.equal("success");
        expect(res.body.environment).to.be.a("string");
        expect(res.body.uptime).to.be.a("number");
        expect(res.body.timestamp).to.be.a("string");
        expect(Number.isNaN(Date.parse(res.body.timestamp))).to.equal(false);
        expect(res.body).not.to.have.property("url");
        expect(res.body).not.to.have.property("database");
    });
});