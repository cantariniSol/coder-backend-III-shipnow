import StoreModel from "../models/stores.model.js";
import UserModel from "../models/users.model.js";


export const storesRepository = {
    findAll: async ({ page, limit }) => {
        const skip = (page - 1) * limit;

        const [stores, total] = await Promise.all([
            StoreModel.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            StoreModel.countDocuments(),
        ]);

        return {
            stores,
            total,
        };
    },

    findById: async (id) => {
        return StoreModel.findById(id);
    },

    create: async (storeData) => {
        return StoreModel.create(storeData);
    },

    update: async (id, updates) => {
        return StoreModel.findByIdAndUpdate(
            id,
            updates,
            { returnDocument: 'after', runValidators: true }
        );
    },

    delete: async (id) => {
        return StoreModel.findByIdAndDelete(id)
    },

    findOwnerById: async (id) => {
        return UserModel.findById(id);
    }
};