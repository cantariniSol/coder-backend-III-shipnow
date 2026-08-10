import { usersRepository } from "../repositories/users.repository.js";
import { USER_ROLES } from "../constants/index.js";
import { createError } from "../errors/createError.js";

export const usersService = {
    getUsers: async () => {
        return usersRepository.findAll();
    },

    getUserById: async (id) => {
        const user = await usersRepository.findById(id);
        if (!user) {
            throw createError("USER_NOT_FOUND");
        }

        return user;
    },

    createUser: async (userData) => {
        const { firstName, lastName, email, password, role } = userData;
        if (!firstName || !lastName || !email || !password) {
            throw createError("VALIDATION_ERROR", "Faltan datos obligatorios");
        }

        if (role && !Object.values(USER_ROLES).includes(role)) {
            throw createError(
                "INVALID_USER_ROLE",
                `Rol inválido. Roles permitidos: ${Object.values(USER_ROLES).join(", ")}`
            );
        }

        return usersRepository.create({ ...userData, role: role || USER_ROLES.CUSTOMER });
    },

    updateUser: async (id, updates) => {
        if (updates.role && !Object.values(USER_ROLES).includes(updates.role)) {
            throw createError(
                "INVALID_USER_ROLE",
                `Rol inválido. Roles permitidos: ${Object.values(USER_ROLES).join(", ")}`
            );
        }

        const user = await usersRepository.update(id, updates);
        if (!user) {
            throw createError("USER_NOT_FOUND");
        }

        return user;
    },

    deleteUser: async (id) => {
        const user = await usersRepository.delete(id);
        if (!user) {
            throw createError("USER_NOT_FOUND");
        }

        return user;
    }
};