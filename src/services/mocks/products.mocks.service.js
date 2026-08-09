import { generateMockProducts } from "../../mocks/products.mocks.js";
import { productsService } from "../products.service.js";

export const productsMocksService = {
    getMockProducts: async (quantity = 1) => {
        return generateMockProducts(quantity);
    },

    createMockProducts: async (quantity = 10) => {
        const mockProducts = await generateMockProducts(quantity);
        const createdProducts = [];

        for (const productData of mockProducts) {
            const createdProduct = await productsService.createProduct(productData);
            createdProducts.push(createdProduct);
        }

        return createdProducts;
    }
};