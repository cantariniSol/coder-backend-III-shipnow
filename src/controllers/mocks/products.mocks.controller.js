import { productsMocksService } from "../../services/mocks/products.mocks.service.js";

export const getMockingProducts = async (req, res) => {
    try {
        const quantity = Number(req.query.quantity) || 1;
        const products = await productsMocksService.getMockProducts(quantity);

        res.status(200).json({
            status: "success",
            payload: products
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

export const generateProducts = async (req, res) => {
    try {

        if (!req.body || typeof req.body !== "object") {
            return res.status(400).json({
                status: "error",
                message: "El body de la petición es obligatorio y debe ser JSON"
            });
        }
        
        const { products = 1 } = req.body;
        const quantity = Number(products) || 1;

        const createdProducts = await productsMocksService.createMockProducts(quantity);

        res.status(201).json({
            status: "success",
            payload: {
                products: createdProducts.length
            }
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};