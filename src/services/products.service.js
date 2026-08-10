import { createError } from "../errors/createError.js";
import { productsRepository } from "../repositories/products.repository.js";
import { PRODUCT_STATUS, PRODUCT_CATEGORIES } from "../constants/index.js";

const allowedCategories = Object.values(PRODUCT_CATEGORIES);

const validateCategory = (category) => {
    const normalizedCategory = category?.trim().toLowerCase();

    if (!normalizedCategory || !allowedCategories.includes(normalizedCategory)) {
        throw createError(
            "VALIDATION_ERROR",
            `Categoría inválida. Categorías permitidas: ${allowedCategories.join(", ")}`
        );
    }

    return normalizedCategory;
};

export const productsService = {
    getProducts: async () => {
        return productsRepository.findAll();
    },

    getProductById: async (id) => {
        const product = await productsRepository.findById(id);
        if (!product) throw createError("PRODUCT_NOT_FOUND");
        return product;
    },

    createProduct: async (productData) => {
        const { name, price, stock, category, code, store } = productData;

        if (!name || price === undefined || stock === undefined || !category || !code || !store) {
            throw createError("VALIDATION_ERROR", "Faltan datos obligatorios");
        }

        if (price < 0 || stock < 0) {
            throw createError("VALIDATION_ERROR", "El precio y el stock no pueden ser negativos");
        }

        const normalizedCategory = validateCategory(category);

        const existingProduct = await productsRepository.findByCode(code);
        if (existingProduct) {
            throw createError("PRODUCT_ALREADY_EXISTS", "Ya existe un producto con ese código");
        }

        return productsRepository.create({
            ...productData,
            category: normalizedCategory
        });
    },

    updateProduct: async (id, updates) => {
        if (updates.category) {
            updates.category = validateCategory(updates.category);
        }

        const product = await productsRepository.update(id, updates);
        if (!product) throw createError("PRODUCT_NOT_FOUND");
        return product;
    },

    deleteProduct: async (id) => {
        const product = await productsRepository.delete(id);
        if (!product) throw createError("PRODUCT_NOT_FOUND");
        return product;
    },

    reduceStock: async (productId, quantity) => {
        const product = await productsRepository.findById(productId);
        if (!product) throw createError("PRODUCT_NOT_FOUND");

        if (product.stock < quantity) {
            throw createError("VALIDATION_ERROR", "Stock insuficiente para completar la compra");
        }

        return productsRepository.update(productId, {
            stock: product.stock - quantity
        });
    }
};