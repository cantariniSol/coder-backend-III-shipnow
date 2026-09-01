import OrderModel from "../models/orders.model.js";
import UserModel from "../models/users.model.js";
import StoreModel from "../models/stores.model.js";

export const ordersRepository = {
    findAll: async ({ page, limit }) => {
        const skip = (page - 1) * limit;

        const [orders, total] = await Promise.all([
            OrderModel.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate("customer")
                .populate("store")
                .lean(),
            OrderModel.countDocuments(),
        ]);

        return {
            orders,
            total,
        };
    },

    findById: async (id) => {
        return OrderModel.findById(id).populate("customer").populate("store");
    },

    create: async (orderData) => {
        return OrderModel.create(orderData);
    },

    update: async (id, updates) => {
        return OrderModel.findByIdAndUpdate(
            id,
            updates,
            { returnDocument: "after", runValidators: true, context: "query" }
        );
    },

    addProof: async (id, proof) => {
        return OrderModel.findByIdAndUpdate(
            id,
            { proof },
            { returnDocument: "after", runValidators: true, context: "query" }
        );
    },

    delete: async (id) => {
        return OrderModel.findByIdAndDelete(id);
    },

    findCustomerById: async (id) => {
        return UserModel.findById(id);
    },

    findStoreById: async (id) => {
        return StoreModel.findById(id);
    }
};