import { generateMockStores } from "../../mocks/stores.mocks.js";
import { storesService } from "../stores.service.js";

export const storesMocksService = {
    getMockStores: async (quantity = 1) => {
        return generateMockStores(quantity);
    },

    createMockStores: async (quantity = 5) => {
        const mockStores = await generateMockStores(quantity);
        const createdStores = [];

        for (const storeData of mockStores) {
            const createdStore = await storesService.createStore(storeData);
            createdStores.push(createdStore);
        }

        return createdStores;
    }
};