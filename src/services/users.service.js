import { usersRepository } from "../repositories/users.repository.js";
import { USER_ROLES } from "../constants/index.js";

export const usersService = {
    getUsers: async () => {
        return usersRepository.findAll();
    },

    getUserById: async (id) => {
        const user = await usersRepository.findById(id);
        if (!user) {
            const error = new Error("Usuario no encontrado");
            error.statusCode = 404;
            throw error;
        }

        return user;
    },

    createUser: async (userData) => {
        const { firstName, lastName, email, password, role } = userData;
        if (!firstName || !lastName || !email || !password) {
            const error = new Error("Faltan datos obligatorios");
            error.statusCode = 400;
            throw error;
        }

        if (role && !Object.values(USER_ROLES).includes(role)) {
            const error = new Error(`Rol inválido. Roles permitidos: ${Object.values(USER_ROLES).join(", ")}`);
            error.statusCode = 400;
            throw error;
        }

        return usersRepository.create({ ...userData, role: role || USER_ROLES.CUSTOMER });
    },

    updateUser: async (id, updates) => {
        if (updates.role && !Object.values(USER_ROLES).includes(updates.role)) {
            const error = new Error(`Rol inválido. Roles permitidos: ${Object.values(USER_ROLES).join(", ")}`);
            error.statusCode = 400;
            throw error;
        }

        const user = await usersRepository.update(id, updates);
        if (!user) {
            const error = new Error("Usuario no encontrado");
            error.statusCode = 404;
            throw error;
        }

        return user;
    },

    deleteUser: async (id) => {
        const user = await usersRepository.delete(id);
        if (!user) {
            const error = new Error("Usuario no encontrado");
            error.statusCode = 404;
            throw error;
        }

        return user;
    }
};