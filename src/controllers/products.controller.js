import { productsService } from "../services/products.service.js";

export const getProducts = async (req, res) => {
    try {
        const products = await productsService.getProducts();
        res.json({ status: "success", payload: products });
    } catch (error) {
        res.status(error.statusCode || 500).json({ status: "error", message: error.message });
    }
};

export const getProductById = async (req, res) => {
    try {
        const product = await productsService.getProductById(req.params.pid);
        res.json({ status: "success", payload: product });
    } catch (error) {
        res.status(error.statusCode || 500).json({ status: "error", message: error.message });
    }
};

export const createProduct = async (req, res) => {
    try {
        const product = await productsService.createProduct(req.body);
        res.status(201).json({ status: "success", payload: product });
    } catch (error) {
        res.status(error.statusCode || 500).json({ status: "error", message: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const product = await productsService.updateProduct(req.params.pid, req.body);
        res.json({ status: "success", payload: product });
    } catch (error) {
        res.status(error.statusCode || 500).json({ status: "error", message: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await productsService.deleteProduct(req.params.pid);
        res.json({ status: "success", payload: product });
    } catch (error) {
        res.status(error.statusCode || 500).json({ status: "error", message: error.message });
    }
};
