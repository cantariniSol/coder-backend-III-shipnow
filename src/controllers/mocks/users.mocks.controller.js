import { usersMocksService } from "../../services/mocks/users.mocks.service.js";
import { parseMockQuantity } from "../../mocks/parseMockQuantity.js";
import { createError } from "../../errors/createError.js";

export const getMockingUsers = async (req, res, next) => {
    try {
        const quantity = parseMockQuantity(req.query.quantity, 1);
        const users = await usersMocksService.getMockUsers(quantity);

        res.status(200).json({
            status: "success",
            payload: users
        });
    } catch (error) {
        next(error);
    }
};

export const generateUsers = async (req, res, next) => {
    try {
        if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
            throw createError("VALIDATION_ERROR", "El body de la petición es obligatorio y debe ser un objeto JSON");
        }

        const quantity = parseMockQuantity(req.body.users, 1);
        const createdUsers = await usersMocksService.createMockUsers(quantity);

        res.status(201).json({
            status: "success",
            payload: {
                users: createdUsers.length
            }
        });
    } catch (error) {
        next(error);
    }
};