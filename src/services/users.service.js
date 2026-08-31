import { usersRepository } from "../repositories/users.repository.js";
import path from "node:path";
import { DOCUMENT_TYPES, USER_ROLES } from "../constants/index.js";
import { createError } from "../errors/createError.js";

const createDocumentMetadata = (file, documentType) => ({
    originalName: file.originalname,
    filename: file.filename,
    path: path.relative(process.cwd(), file.path).replaceAll("\\", "/"),
    mimetype: file.mimetype,
    size: file.size,
    documentType,
    uploadedAt: new Date(),
});

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

    addUploadedDocument: async (id, file, documentType) => {
        if (!file) {
            throw createError("FILE_REQUIRED");
        }

        const normalizedDocumentType = documentType?.trim().toUpperCase();
        if (!Object.values(DOCUMENT_TYPES).includes(normalizedDocumentType)) {
            throw createError("INVALID_DOCUMENT_TYPE");
        }

        try {
            const user = await usersRepository.addUploadedDocument(
                id,
                createDocumentMetadata(file, normalizedDocumentType)
            );

            if (!user) {
                throw createError("USER_NOT_FOUND");
            }

            return user;
        } catch (error) {
            if (error.code || error.name === "CastError") {
                throw error;
            }

            throw createError("FILE_SAVE_ERROR");
        }
    },

    deleteUser: async (id) => {
        const user = await usersRepository.delete(id);
        if (!user) {
            throw createError("USER_NOT_FOUND");
        }

        return user;
    }
};