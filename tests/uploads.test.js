import request from "supertest";
import { expect } from "chai";
import mongoose from "mongoose";
import app from "../src/app.js";
import { seedOrderContext, seedUserContext } from "./helpers/seed.js";

const attachPdf = (requestBuilder, fieldName) => requestBuilder
    .attach(fieldName, Buffer.from("%PDF-1.4\nShipNow test file"), {
        filename: "test-document.pdf",
        contentType: "application/pdf",
    });

describe("Uploads API | Check Tests", () => {
    describe("POST /api/users/:uid/documents", () => {
        it("debe cargar un documento y guardar sus metadatos", async () => {
            const { customer } = await seedUserContext();
            const res = await attachPdf(
                request(app)
                    .post(`/api/users/${customer._id}/documents`)
                    .field("documentType", "DNI"),
                "document"
            );

            expect(res.status).to.equal(201);
            expect(res.body.status).to.equal("success");
            expect(res.body.payload.uploadedDocuments).to.have.lengthOf(1);

            const [document] = res.body.payload.uploadedDocuments;
            expect(document.originalName).to.equal("test-document.pdf");
            expect(document.filename).to.be.a("string");
            expect(document.path).to.match(/^uploads\/user-documents\//);
            expect(document.mimetype).to.equal("application/pdf");
            expect(document.size).to.be.greaterThan(0);
            expect(document.documentType).to.equal("DNI");
            expect(document.uploadedAt).to.be.a("string");
        });

        it("debe responder 400 si falta el archivo", async () => {
            const { customer } = await seedUserContext();
            const res = await request(app)
                .post(`/api/users/${customer._id}/documents`)
                .field("documentType", "DNI");

            expect(res.status).to.equal(400);
            expect(res.body.status).to.equal("error");
            expect(res.body.error.code).to.equal("FILE_REQUIRED");
        });

        it("debe responder 400 si el tipo de documento es inválido", async () => {
            const { customer } = await seedUserContext();
            const res = await attachPdf(
                request(app)
                    .post(`/api/users/${customer._id}/documents`)
                    .field("documentType", "LICENCIA"),
                "document"
            );

            expect(res.status).to.equal(400);
            expect(res.body.status).to.equal("error");
            expect(res.body.error.code).to.equal("INVALID_DOCUMENT_TYPE");
        });

        it("debe responder 404 si el usuario no existe", async () => {
            const userId = new mongoose.Types.ObjectId().toString();
            const res = await attachPdf(
                request(app)
                    .post(`/api/users/${userId}/documents`)
                    .field("documentType", "DNI"),
                "document"
            );

            expect(res.status).to.equal(404);
            expect(res.body.status).to.equal("error");
            expect(res.body.error.code).to.equal("USER_NOT_FOUND");
        });
    });

    describe("POST /api/orders/:oid/proof", () => {
        it("debe asociar un comprobante y guardar sus metadatos", async () => {
            const { order } = await seedOrderContext();
            const res = await attachPdf(
                request(app).post(`/api/orders/${order._id}/proof`),
                "proof"
            );

            expect(res.status).to.equal(201);
            expect(res.body.status).to.equal("success");
            expect(res.body.payload.proof).to.be.an("object");
            expect(res.body.payload.proof.originalName).to.equal("test-document.pdf");
            expect(res.body.payload.proof.path).to.match(/^uploads\/order-proofs\//);
            expect(res.body.payload.proof.mimetype).to.equal("application/pdf");
            expect(res.body.payload.proof.size).to.be.greaterThan(0);
            expect(res.body.payload.proof.uploadedAt).to.be.a("string");
        });

        it("debe responder 400 si falta el comprobante", async () => {
            const { order } = await seedOrderContext();
            const res = await request(app).post(`/api/orders/${order._id}/proof`);

            expect(res.status).to.equal(400);
            expect(res.body.status).to.equal("error");
            expect(res.body.error.code).to.equal("FILE_REQUIRED");
        });

        it("debe responder 404 si el pedido no existe", async () => {
            const orderId = new mongoose.Types.ObjectId().toString();
            const res = await attachPdf(
                request(app).post(`/api/orders/${orderId}/proof`),
                "proof"
            );

            expect(res.status).to.equal(404);
            expect(res.body.status).to.equal("error");
            expect(res.body.error.code).to.equal("ORDER_NOT_FOUND");
        });
    });
});