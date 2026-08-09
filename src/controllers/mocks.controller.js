import { usersService } from "../services/users.service.js";
import { generateMockUsers } from "../mocks/users.mocks.js";

export const getMockingUsers = async (req, res) => {
    const quantity = Number(req.query.quantity) || 1;
    const users = await generateMockUsers(quantity);
    res.status(200).json({
        status: "success",
        payload: users
    });
};

export const generateUsers = async (req, res) => {
    try {
        const { users = 10 } = req.body;
        const quantity = Number(users) || 10;

        const mockUsers = await generateMockUsers(quantity);

        const created = [];
        for (const u of mockUsers) {

            const createdUser = await usersService.createUser(u);
            created.push(createdUser);
        }

        res.status(201).json({
            status: "success",
            payload: {
                users: created.length
            }
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};