import StoreModel from "../models/stores.model.js";
import UserModel from "../models/users.model.js";


export const storesRepository = {
    findAll: async () => {
        return StoreModel.find();
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
            { new: true, runValidators: true }
        );
    },

    delete: async (id) => {
        return StoreModel.findByIdAndDelete(id)
    },

    findOwnerById: async (id) => {
        return UserModel.findById(id);
    }
};