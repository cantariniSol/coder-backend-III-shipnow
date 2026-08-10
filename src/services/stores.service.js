import { createError } from "../errors/createError.js";
import { storesRepository } from "../repositories/stores.repository.js";
import { USER_ROLES } from "../constants/index.js";

export const storesService = {
    getStores: async () => {
        return storesRepository.findAll();
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