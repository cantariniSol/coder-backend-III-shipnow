import { productsService } from "../services/products.service.js";

export const getProducts = async (req, res, next) => {
    try {
        const { products, meta } = await productsService.getProducts(req.query);
        res.json({ status: "success", payload: products, meta });
    } catch (error) {
        next(error);
    }
};

export const getProductById = async (req, res, next) => {
    try {
        const product = await productsService.getProductById(req.params.pid);
        res.json({ status: "success", payload: product });
    } catch (error) {
        next(error);
    }
};

export const createProduct = async (req, res, next) => {
    try {
        const product = await productsService.createProduct(req.body);
        res.status(201).json({ status: "success", payload: product });
    } catch (error) {
        next(error);
    }
};

export const updateProduct = async (req, res, next) => {
    try {
        const product = await productsService.updateProduct(req.params.pid, req.body);
        res.json({ status: "success", payload: product });
    } catch (error) {
        next(error);
    }
};

export const deleteProduct = async (req, res, next) => {
    try {
        const product = await productsService.deleteProduct(req.params.pid);
        res.json({ status: "success", payload: product });
    } catch (error) {
        next(error);
    }
};