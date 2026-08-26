import request from "supertest";
import { expect } from "chai";
import app from "../src/app.js";

describe("Support | Check Tests", () => {
    it("GET /api debe responder 200 y status success", async () => {
        const res = await request(app).get("/api");

        expect(res.status).to.equal(200);
        expect(res.body).to.be.an("object");
        expect(res.body.status).to.equal("success");
        expect(res.body).to.have.property("message");
    });

    it("GET /api/docs/ debe responder 200 y servir Swagger UI", async () => {
        const res = await request(app).get("/api/docs/");

        expect(res.status).to.equal(200);
        expect(res.headers["content-type"]).to.include("text/html");
        expect(res.text).to.include("Swagger UI");
    });

    it("GET /api/ruta-inexistente debe responder 404 con formato de error", async () => {
        const res = await request(app).get("/api/ruta-inexistente");

        expect(res.status).to.equal(404);
        expect(res.body.status).to.equal("error");
        expect(res.body).to.have.property("message");
        expect(res.body.error).to.be.an("object");
        expect(res.body.error.code).to.equal("ROUTE_NOT_FOUND");
        expect(res.body.error).to.have.property("message");
    });
});