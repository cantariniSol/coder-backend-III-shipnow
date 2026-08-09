import { usersMocksService } from "../../services/mocks/users.mocks.service.js";

export const getMockingUsers = async (req, res) => {
    try {
        const quantity = Number(req.query.quantity) || 1;
        const users = await usersMocksService.getMockUsers(quantity);

        res.status(200).json({
            status: "success",
            payload: users
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

export const generateUsers = async (req, res) => {
    try {
        
        if (!req.body || typeof req.body !== "object") {
            return res.status(400).json({
                status: "error",
                message: "El body de la petición es obligatorio y debe ser JSON"
            });
        }

        const { users = 1 } = req.body;
        const quantity = Number(users) || 1;

        const createdUsers = await usersMocksService.createMockUsers(quantity);

        res.status(201).json({
            status: "success",
            payload: {
                users: createdUsers.length
            }
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};