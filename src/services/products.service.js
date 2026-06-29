import { productsRepository } from "../repositories/products.repository.js";

export const productsService = {
    getProducts: async () => {
        return productsRepository.findAll();
    },

    getProductById: async (id) => {
        const product = await productsRepository.findById(id);
        if (!product) {
            const error = new Error("Producto no encontrado");
            error.statusCode = 404;
            throw error;
        }

        return product;
    },

    createProduct: async (productData) => {
        const { name, price, stock, category, code, store } = productData;

        if (!name || !price || stock === undefined || !category || !code || !store) {
            const error = new Error("Faltan datos obligatorios");
            error.statusCode = 400;
            throw error;
        }

        if (price < 0 || stock < 0) {
            const error = new Error("El precio y el stock no pueden ser negativos");
            error.statusCode = 400;
            throw error;
        }

        const existingProduct = await productsRepository.findByCode(code);
        if (existingProduct) {
            const error = new Error("Ya existe un producto con ese código");
            error.statusCode = 409;
            throw error;
        }

        return productsRepository.create(productData);
    },

    updateProduct: async (id, updates) => {
        const product = await productsRepository.update(id, updates);
        if (!product) {
            const error = new Error("Producto no encontrado");
            error.statusCode = 404;
            throw error;
        }

        return product;
    },

    deleteProduct: async (id) => {
        const product = await productsRepository.delete(id);
        if (!product) {
            const error = new Error("Producto no encontrado");
            error.statusCode = 404;
            throw error;
        }

        return product;
    },

    reduceStock: async (productId, quantity) => {
        const product = await productsRepository.findById(productId);

        if (!product) {
            const error = new Error("Producto no encontrado");
            error.statusCode = 404;
            throw error;
        }

        if (product.stock < quantity) {
            const error = new Error("Stock insuficiente para completar la compra");
            error.statusCode = 400;
            throw error;
        }

        const updatedProduct = await productsRepository.update(productId, {
            stock: product.stock - quantity
        });

        return updatedProduct;
    }
};
