import { createError } from "../errors/createError.js";
import { storesRepository } from "../repositories/stores.repository.js";
import { USER_ROLES } from "../constants/index.js";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

const parsePagination = (pageValue, limitValue) => {
    const page = pageValue === undefined ? DEFAULT_PAGE : Number(pageValue);
    const limit = limitValue === undefined ? DEFAULT_LIMIT : Number(limitValue);

    if (
        !Number.isInteger(page) ||
        !Number.isInteger(limit) ||
        page < 1 ||
        limit < 1 ||
        limit > MAX_LIMIT
    ) {
        throw createError(
            "VALIDATION_ERROR",
            `page debe ser mayor o igual a 1 y limit debe estar entre 1 y ${MAX_LIMIT}`
        );
    }

    return { page, limit };
};

export const storesService = {
    getStores: async (query = {}) => {
        const { page, limit } = parsePagination(query.page, query.limit);
        const { stores, total } = await storesRepository.findAll({ page, limit });

        return {
            stores,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    },

    getStoreById: async (id) => {
        const store = await storesRepository.findById(id);
        if (!store) throw createError("STORE_NOT_FOUND");
        return store;
    },

    createStore: async (storeData) => {
        const { name, address, owner } = storeData;

        if (!name || !address || !owner) {
            throw createError("VALIDATION_ERROR", "Faltan datos obligatorios");
        }

        const user = await storesRepository.findOwnerById(owner);
        if (!user) throw createError("USER_NOT_FOUND");

        if (user.role !== USER_ROLES.SELLER) {
            throw createError("VALIDATION_ERROR", `El owner de una tienda debe tener rol ${USER_ROLES.SELLER}`);
        }

        return storesRepository.create(storeData);
    },

    updateStore: async (id, updates) => {
        const store = await storesRepository.update(id, updates);
        if (!store) throw createError("STORE_NOT_FOUND");
        return store;
    },

    deleteStore: async (id) => {
        const store = await storesRepository.delete(id);
        if (!store) throw createError("STORE_NOT_FOUND");
        return store;
    }
};