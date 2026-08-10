import { productsMocksService } from "../../services/mocks/products.mocks.service.js";
import { parseMockQuantity } from "../../mocks/parseMockQuantity.js";
import { createError } from "../../errors/createError.js";

export const getMockingProducts = async (req, res, next) => {
    try {
        const quantity = parseMockQuantity(req.query.quantity, 1);
        const products = await productsMocksService.getMockProducts(quantity);

        res.status(200).json({
            status: "success",
            payload: products
        });
    } catch (error) {
        next(error);
    }
};

export const generateProducts = async (req, res, next) => {
    try {
        if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
            throw createError("VALIDATION_ERROR", "El body de la petición es obligatorio y debe ser un objeto JSON");
        }
        
        const quantity = parseMockQuantity(req.body.products, 1);
        const createdProducts = await productsMocksService.createMockProducts(quantity);

        res.status(201).json({
            status: "success",
            payload: {
                products: createdProducts.length
            }
        });
    } catch (error) {
        next(error);
    }
};