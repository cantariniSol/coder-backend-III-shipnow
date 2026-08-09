import { generateMockUsers } from "../../mocks/users.mocks.js";
import { usersService } from "../users.service.js";

export const usersMocksService = {
    getMockUsers: async (quantity = 1) => {
        return generateMockUsers(quantity);
    },

    createMockUsers: async (quantity = 10) => {
        const mockUsers = await generateMockUsers(quantity);
        const createdUsers = [];

        for (const userData of mockUsers) {
            const createdUser = await usersService.createUser(userData);
            createdUsers.push(createdUser);
        }

        return createdUsers;
    }
};