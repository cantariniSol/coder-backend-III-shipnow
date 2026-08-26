import request from "supertest";
import { expect } from "chai";
import mongoose from "mongoose";
import app from "../src/app.js";

describe("Health | Check Tests", () => {

    it("GET /api/health debe responder 200 y campos de salud", async () => {
        const res = await request(app).get("/api/health");

        expect(res.status).to.equal(200);
        expect(res.body.status).to.equal("success");
        expect(res.body).to.have.property("server");
        expect(res.body).to.have.property("database");
    });
});