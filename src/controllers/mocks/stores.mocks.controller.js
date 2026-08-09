import { storesMocksService } from "../../services/mocks/stores.mocks.service.js";

export const getMockingStores = async (req, res) => {
    try {
        
        const quantity = Number(req.query.quantity) || 1;
        const stores = await storesMocksService.getMockStores(quantity);

        res.status(200).json({
            status: "success",
            payload: stores
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

export const generateStores = async (req, res) => {
    try {
        
        if (!req.body || typeof req.body !== "object") {
            return res.status(400).json({
                status: "error",
                message: "El body de la petición es obligatorio y debe ser JSON"
            });
        }

        const { stores = 5 } = req.body;
        const quantity = Number(stores) || 5;

        const createdStores = await storesMocksService.createMockStores(quantity);

        res.status(201).json({
            status: "success",
            payload: {
                stores: createdStores.length
            }
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};