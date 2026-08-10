import { storesMocksService } from "../../services/mocks/stores.mocks.service.js";
import { parseMockQuantity } from "../../mocks/helpers/parseMockQuantity.js";
import { createError } from "../../errors/createError.js";

export const getMockingStores = async (req, res, next) => {
    try {
        const quantity = parseMockQuantity(req.query.quantity, 1);
        const stores = await storesMocksService.getMockStores(quantity);

        res.status(200).json({
            status: "success",
            payload: stores
        });
    } catch (error) {
        next(error);
    }
};

export const generateStores = async (req, res, next) => {
    try {
        if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
            throw createError("VALIDATION_ERROR", "El body de la petición es obligatorio y debe ser un objeto JSON");
        }

        const quantity = parseMockQuantity(req.body.stores, 5);
        const createdStores = await storesMocksService.createMockStores(quantity);

        res.status(201).json({
            status: "success",
            payload: {
                stores: createdStores.length
            }
        });
    } catch (error) {
        next(error);
    }
};